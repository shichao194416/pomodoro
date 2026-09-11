import type { PomodoroState, PomodoroMode, PomodoroSession } from '../../types/pomodoro.types';

export interface PomodoroContextType extends PomodoroState {
  setTag: (tag: string) => void;
  setMode: (mode: PomodoroMode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setIsRunning: (running: boolean) => void;
  sessions: PomodoroSession[];
  setSessions: (sessions: PomodoroSession[]) => void;
  sessionDuration: React.RefObject<number>;
  /** Planned length of the current phase — used to draw the progress ring. */
  phaseTotal: number;
  setPhaseTotal: (total: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  saveSession: (session: PomodoroSession) => void;
  renameTag: (oldName: string, newName: string) => void;
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  wasRunningBeforeModal: boolean;
  setWasRunningBeforeModal: (wasRunning: boolean) => void;
  sessionNote: string;
  setSessionNote: (note: string) => void;
}

export interface PersistedState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  showConfirmModal: boolean;
  wasRunningBeforeModal: boolean;
  sessionNote: string;
  targetEndTime: number | null;
}
