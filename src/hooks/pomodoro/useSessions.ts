import { useState, useEffect, useCallback } from 'react';
import type { PomodoroSession } from '../../types/pomodoro.types';
import { loadSessionsFromStorage, saveSessionsToStorage } from './storage';

interface UseSessionsProps {
  tag: string;
  setTag: (tag: string) => void;
  sessionNote: string;
  setSessionNote: (note: string) => void;
}

export function useSessions({ tag, setTag, sessionNote, setSessionNote }: UseSessionsProps) {
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => loadSessionsFromStorage());

  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  const saveSession = useCallback((session: PomodoroSession) => {
    setSessions((prev) => [...prev, { ...session, note: sessionNote }]);
    setSessionNote('');
  }, [sessionNote, setSessionNote]);

  const renameTag = useCallback((oldName: string, newName: string) => {
    // Update all saved sessions that use the old tag name
    setSessions((prev) => prev.map((s) => (s.tag === oldName ? { ...s, tag: newName } : s)));
    // Update the active tag if it matches
    if (tag === oldName) {
      setTag(newName);
    }
  }, [tag, setTag]);

  return {
    sessions,
    setSessions,
    saveSession,
    renameTag,
  };
}
