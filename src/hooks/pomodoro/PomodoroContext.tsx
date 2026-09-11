import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { PomodoroMode } from '../../types/pomodoro.types';
import type { PomodoroContextType } from './types';
import { useSettings } from '../../contexts/SettingsContext';
import { loadStateFromStorage, saveStateToStorage } from './storage';
import { useTimer } from './useTimer';
import { useSessions } from './useSessions';

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

interface PomodoroProviderProps {
  children: ReactNode;
}

export function PomodoroProvider({ children }: PomodoroProviderProps) {
  const { workDuration, breakDuration } = useSettings();

  const defaultWorkTime = workDuration;
  const defaultBreakTime = breakDuration;

  const [savedState] = useState(() => loadStateFromStorage());

  const [tag, setTag] = useState<string>(savedState.tag ?? 'General');
  const [mode, setMode] = useState<PomodoroMode>(savedState.mode ?? 'work');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(savedState.showConfirmModal ?? false);
  const [wasRunningBeforeModal, setWasRunningBeforeModal] = useState<boolean>(savedState.wasRunningBeforeModal ?? false);
  const [sessionNote, setSessionNote] = useState<string>(savedState.sessionNote ?? '');

  const {
    timeLeft, setTimeLeft,
    isRunning, setIsRunning,
    targetEndTime,
    sessionDuration,
    phaseTotal, setPhaseTotal,
    startTimer, pauseTimer, stopTimer, resetTimer,
  } = useTimer({ defaultWorkTime, defaultBreakTime, mode, savedState });

  const {
    sessions, setSessions,
    saveSession, renameTag,
  } = useSessions({ tag, setTag, sessionNote, setSessionNote });

  // Persist state to localStorage
  useEffect(() => {
    saveStateToStorage({
      tag,
      mode,
      timeLeft,
      isRunning,
      showConfirmModal,
      wasRunningBeforeModal,
      sessionNote,
      targetEndTime
    });
  }, [tag, mode, timeLeft, isRunning, showConfirmModal, wasRunningBeforeModal, sessionNote, targetEndTime]);

  return (
    <PomodoroContext.Provider
      value={{
        defaultBreakTime,
        defaultWorkTime,
        isRunning,
        mode,
        pauseTimer,
        phaseTotal,
        renameTag,
        resetTimer,
        saveSession,
        sessionDuration,
        sessionNote,
        sessions,
        setIsRunning,
        setMode,
        setPhaseTotal,
        setSessionNote,
        setSessions,
        setShowConfirmModal,
        setTag,
        setTimeLeft,
        setWasRunningBeforeModal,
        showConfirmModal,
        startTimer,
        stopTimer,
        tag,
        timeLeft,
        wasRunningBeforeModal,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);

  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }

  return context;
}
