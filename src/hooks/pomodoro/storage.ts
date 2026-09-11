import type { PomodoroSession } from '../../types/pomodoro.types';
import type { PersistedState } from './types';

const SESSIONS_STORAGE_KEY = 'pomodoro_sessions';
const STATE_STORAGE_KEY = 'pomodoro_state';

export const loadSessionsFromStorage = (): PomodoroSession[] => {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load sessions from localStorage', error);
  }
  return [];
};

export const saveSessionsToStorage = (sessions: PomodoroSession[]) => {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions to localStorage', error);
  }
};

export const loadStateFromStorage = (): Partial<PersistedState> => {
  try {
    const stored = localStorage.getItem(STATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage', error);
  }
  return {};
};

export const saveStateToStorage = (state: PersistedState) => {
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage', error);
  }
};
