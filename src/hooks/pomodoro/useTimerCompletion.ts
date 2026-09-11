import { useEffect, useRef, useState, useCallback } from 'react';
import type { PomodoroMode, PomodoroSession } from '../../types/pomodoro.types';
import { useSound } from '../useSound';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendNotification } from '../../utils/notifications';

export interface SessionAlertData {
  /** The phase that just finished. */
  finished: PomodoroMode;
  /** The phase that is queued up and waiting for the user. */
  next: PomodoroMode;
  /** How long the finished phase actually ran, in seconds. */
  duration: number;
}

interface UseTimerCompletionProps {
  timeLeft: number;
  mode: PomodoroMode;
  tag: string;
  defaultWorkTime: number;
  defaultBreakTime: number;
  showConfirmModal: boolean;
  sessionDuration: React.RefObject<number>;
  stopTimer: () => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setPhaseTotal: (total: number) => void;
  saveSession: (session: PomodoroSession) => void;
}

/**
 * Watches the countdown and fires the end-of-phase alarm exactly once:
 * plays the alarm, records the session, sends a notification, advances the
 * mode, and surfaces a blocking alert that the UI renders full-screen.
 */
export function useTimerCompletion({
  timeLeft,
  mode,
  tag,
  defaultWorkTime,
  defaultBreakTime,
  showConfirmModal,
  sessionDuration,
  stopTimer,
  setMode,
  setTimeLeft,
  setPhaseTotal,
  saveSession,
}: UseTimerCompletionProps) {
  const { playWorkComplete, playBreakComplete } = useSound();
  const { translations } = useLanguage();

  const [alert, setAlert] = useState<SessionAlertData | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    // Re-arm as soon as the countdown is running again.
    if (timeLeft > 0) {
      handledRef.current = false;
      return;
    }
    if (handledRef.current || showConfirmModal) return;
    handledRef.current = true;

    if (mode === 'work') {
      playWorkComplete();
    } else {
      playBreakComplete();
    }

    const actualDuration = sessionDuration.current ?? 0;
    const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';

    // Only focus sessions count towards study time. A zero-length record
    // (timer that expired while the page was closed) is not worth storing.
    if (mode === 'work' && actualDuration > 0) {
      saveSession({
        tag,
        duration: actualDuration,
        timestamp: Date.now(),
        completed: true,
        mode: 'work',
      });

      const notificationBody = translations.notificationWorkBody;
      sendNotification(translations.workCompleted, notificationBody);
    }

    setAlert({ finished: mode, next: nextMode, duration: actualDuration });

    stopTimer();
    setMode(nextMode);
    const nextDuration = nextMode === 'work' ? defaultWorkTime : defaultBreakTime;
    setTimeLeft(nextDuration);
    setPhaseTotal(nextDuration);
  }, [
    timeLeft,
    showConfirmModal,
    mode,
    tag,
    defaultWorkTime,
    defaultBreakTime,
    sessionDuration,
    saveSession,
    stopTimer,
    setMode,
    setTimeLeft,
    setPhaseTotal,
    playWorkComplete,
    playBreakComplete,
    translations,
  ]);

  const closeAlert = useCallback(() => setAlert(null), []);

  return { alert, closeAlert };
}
