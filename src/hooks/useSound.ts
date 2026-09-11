import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { playAlarm, unlockAudio, primeAlarmSounds, vibrateAlarm } from '../utils/alarm';

import workCompleteSound from '../assets/sounds/work-complete.mp3';
import breakCompleteSound from '../assets/sounds/break-complete.mp3';

export const ALARM_SOUNDS = [workCompleteSound, breakCompleteSound];

/**
 * Alarm playback for session completion.
 *
 * `unlock()` must be called from the Start tap — that is the user gesture iOS
 * requires before any audio may play.
 */
export function useSound() {
  const { soundEnabled } = useSettings();

  const unlock = useCallback(() => {
    unlockAudio();
    void primeAlarmSounds(ALARM_SOUNDS);
  }, []);

  const playWorkComplete = useCallback(
    (times = 3) => {
      if (!soundEnabled) return;
      playAlarm(workCompleteSound, times);
      vibrateAlarm();
    },
    [soundEnabled]
  );

  const playBreakComplete = useCallback(
    (times = 3) => {
      if (!soundEnabled) return;
      playAlarm(breakCompleteSound, times);
      vibrateAlarm();
    },
    [soundEnabled]
  );

  return { playWorkComplete, playBreakComplete, unlock };
}
