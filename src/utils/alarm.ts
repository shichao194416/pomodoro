/**
 * Alarm playback that actually works on iOS.
 *
 * Why this exists: iOS refuses to play an <audio> element that was not
 * "unlocked" by a user gesture. A 25-minute timer fires long after the tap
 * that started it, so `new Audio(src).play()` at completion time is silently
 * blocked on iPhone.
 *
 * The fix is to open a Web Audio context *during* the start tap, resume it,
 * and pre-decode the alarm sounds into AudioBuffers. Once the context is
 * running it stays unlocked for the page session, so playing the alarm later
 * needs no further gesture.
 */

type AudioContextCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();
let primed = false;

function getAudioContext(): AudioContext | null {
  if (ctx) return ctx;
  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    ctx = null;
  }
  return ctx;
}

/**
 * Must be called synchronously from a user gesture (the Start button).
 * Safe to call repeatedly.
 */
export function unlockAudio(): void {
  const audio = getAudioContext();
  if (!audio) return;
  try {
    if (audio.state === 'suspended') void audio.resume();
    // A one-sample silent buffer is enough to satisfy iOS's gesture check.
    const buffer = audio.createBuffer(1, 1, 22050);
    const source = audio.createBufferSource();
    source.buffer = buffer;
    source.connect(audio.destination);
    source.start(0);
  } catch {
    /* ignore */
  }
}

/** Decode the alarm sounds ahead of time so playback is instant and offline. */
export async function primeAlarmSounds(urls: string[]): Promise<void> {
  const audio = getAudioContext();
  if (!audio) return;
  if (audio.state === 'suspended') {
    try {
      await audio.resume();
    } catch {
      /* ignore */
    }
  }
  await Promise.all(
    urls.map(async (url) => {
      if (buffers.has(url)) return;
      try {
        const res = await fetch(url);
        const data = await res.arrayBuffer();
        const decoded = await audio.decodeAudioData(data);
        buffers.set(url, decoded);
      } catch {
        /* fall back to the <audio> element path */
      }
    })
  );
  primed = true;
}

export function isPrimed(): boolean {
  return primed;
}

/**
 * Plays an alarm sound `times` times, `gapMs` apart.
 * Falls back to a plain Audio element when Web Audio is unavailable.
 */
export function playAlarm(url: string, times = 3, gapMs = 900): void {
  const audio = getAudioContext();
  const buffer = buffers.get(url);

  if (audio && buffer) {
    const startAt = () => {
      try {
        if (audio.state === 'suspended') void audio.resume();
        const source = audio.createBufferSource();
        source.buffer = buffer;
        source.connect(audio.destination);
        source.start(0);
      } catch {
        /* ignore */
      }
    };
    for (let i = 0; i < times; i += 1) {
      if (i === 0) startAt();
      else window.setTimeout(startAt, i * gapMs);
    }
    return;
  }

  // Fallback: plain <audio>
  for (let i = 0; i < times; i += 1) {
    window.setTimeout(() => {
      try {
        void new Audio(url).play().catch(() => undefined);
      } catch {
        /* ignore */
      }
    }, i * gapMs);
  }
}

/** Short haptic pattern where supported (Android/Chrome; no-op on iOS). */
export function vibrateAlarm(): void {
  const nav = navigator as Navigator & { vibrate?: (pattern: number[]) => boolean };
  try {
    nav.vibrate?.([220, 120, 220, 120, 460]);
  } catch {
    /* ignore */
  }
}

export function stopAllAudio(): void {
  try {
    void ctx?.close();
  } catch {
    /* ignore */
  }
  ctx = null;
  buffers.clear();
  primed = false;
}
