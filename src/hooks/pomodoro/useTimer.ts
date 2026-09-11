import { useState, useEffect, useCallback, useRef } from 'react';
import type { PomodoroMode } from '../../types/pomodoro.types';
import type { PersistedState } from './types';

interface UseTimerProps {
  defaultWorkTime: number;
  defaultBreakTime: number;
  mode: PomodoroMode;
  savedState: Partial<PersistedState>;
}

export function useTimer({ defaultWorkTime, defaultBreakTime, mode, savedState }: UseTimerProps) {
  // Restore targetEndTime: if timer was running when page closed, recover it
  const [initialTimeState] = useState(() => {
    const restoredEndTime = savedState.targetEndTime ?? null;
    if (restoredEndTime !== null) {
      const remaining = Math.ceil((restoredEndTime - Date.now()) / 1000);
      if (remaining > 0) {
        return { timeLeft: remaining, isRunning: true, targetEndTime: restoredEndTime };
      }
      // Timer expired while page was closed — timeLeft=0 triggers completion effect
      return { timeLeft: 0, isRunning: false, targetEndTime: null };
    }
    return {
      timeLeft: savedState.timeLeft ?? defaultWorkTime,
      isRunning: false,
      targetEndTime: null
    };
  });

  const [timeLeft, setTimeLeft] = useState<number>(initialTimeState.timeLeft);
  const [isRunning, setIsRunning] = useState<boolean>(initialTimeState.isRunning);
  const [targetEndTime, setTargetEndTime] = useState<number | null>(initialTimeState.targetEndTime);

  /**
   * How long the current phase was planned to run. `timeLeft` alone is not
   * enough to draw a progress ring: it changes every second, and it also
   * changes when the user edits the time while idle.
   */
  const [phaseTotal, setPhaseTotal] = useState<number>(initialTimeState.timeLeft);

  // Track previous durations to detect settings changes
  const prevWorkDuration = useRef(defaultWorkTime);
  const prevBreakDuration = useRef(defaultBreakTime);

  // Wall-clock countdown: calculate remaining time from targetEndTime
  useEffect(() => {
    if (!isRunning || targetEndTime === null) return;

    const tick = () => {
      const remaining = Math.ceil((targetEndTime - Date.now()) / 1000);
      setTimeLeft(remaining <= 0 ? 0 : remaining);
    };

    tick(); // immediate sync
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, targetEndTime]);

  // Instant resync when tab becomes visible again (no 1s delay)
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && isRunning && targetEndTime !== null) {
        const remaining = Math.ceil((targetEndTime - Date.now()) / 1000);
        setTimeLeft(remaining <= 0 ? 0 : remaining);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRunning, targetEndTime]);

  // Sync timer when settings change (only if at reset state)
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'work' && timeLeft === prevWorkDuration.current) {
        setTimeLeft(defaultWorkTime);
        setPhaseTotal(defaultWorkTime);
      } else if (mode === 'break' && timeLeft === prevBreakDuration.current) {
        setTimeLeft(defaultBreakTime);
        setPhaseTotal(defaultBreakTime);
      }
    }
    prevWorkDuration.current = defaultWorkTime;
    prevBreakDuration.current = defaultBreakTime;
  }, [defaultWorkTime, defaultBreakTime, mode, timeLeft, isRunning]);

  const sessionDuration = useRef<number>(initialTimeState.timeLeft);

  const startTimer = useCallback(() => {
    sessionDuration.current = timeLeft;
    setPhaseTotal(timeLeft);
    setTargetEndTime(Date.now() + timeLeft * 1000);
    setIsRunning(true);
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
    setTargetEndTime((prev) => {
      if (prev !== null) {
        const remaining = Math.max(0, Math.ceil((prev - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
      return null;
    });
    setIsRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    setTargetEndTime(null);
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    const fresh = mode === 'work' ? defaultWorkTime : defaultBreakTime;
    setTargetEndTime(null);
    setIsRunning(false);
    setTimeLeft(fresh);
    setPhaseTotal(fresh);
  }, [mode, defaultWorkTime, defaultBreakTime]);

  return {
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    targetEndTime,
    sessionDuration,
    phaseTotal,
    setPhaseTotal,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  };
}
