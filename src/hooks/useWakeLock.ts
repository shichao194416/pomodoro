import { useEffect, useRef, useState } from 'react';

/**
 * Minimal shape of the Screen Wake Lock API. Declared locally so the hook
 * compiles no matter which TypeScript DOM lib version is installed.
 */
interface WakeLockSentinelLike {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
}

interface NavigatorWithWakeLock {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
}

/**
 * Keeps the phone screen awake while `enabled` is true.
 *
 * This is what makes the countdown reliable on iOS: a web app cannot post a
 * notification from the background, so instead we stop the screen from
 * sleeping while a focus/break session is running. The lock is automatically
 * dropped when the page is hidden and re-acquired when it comes back.
 *
 * iOS supports this from Safari 16.4; on older versions (or unsupported
 * browsers) the hook is a silent no-op.
 */
export function useWakeLock(enabled: boolean): boolean {
  const [isActive, setIsActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    const nav = navigator as unknown as NavigatorWithWakeLock;
    const api = nav.wakeLock;
    if (!api) return;

    let disposed = false;

    const release = async () => {
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      setIsActive(false);
      if (sentinel && !sentinel.released) {
        try {
          await sentinel.release();
        } catch {
          /* already gone */
        }
      }
    };

    const acquire = async () => {
      if (disposed || !enabled) return;
      if (sentinelRef.current && !sentinelRef.current.released) return;
      if (document.visibilityState !== 'visible') return;
      try {
        const sentinel = await api.request('screen');
        if (disposed) {
          void sentinel.release();
          return;
        }
        sentinelRef.current = sentinel;
        setIsActive(true);
        sentinel.addEventListener('release', () => {
          sentinelRef.current = null;
          setIsActive(false);
        });
      } catch {
        // Denied (e.g. low battery mode) — degrade gracefully.
        setIsActive(false);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void acquire();
      } else {
        void release();
      }
    };

    if (enabled) {
      void acquire();
    } else {
      void release();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void release();
    };
  }, [enabled]);

  return isActive;
}
