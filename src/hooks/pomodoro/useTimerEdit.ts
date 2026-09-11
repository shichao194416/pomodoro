import { useState, useRef, useCallback, useEffect } from 'react';
import { formatTimeMMSS, parseTimeInput } from '../../utils/formatTime';

interface UseTimerEditProps {
  isRunning: boolean;
  timeLeft: number;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  /** Kept in sync so the progress ring matches an edited duration. */
  setPhaseTotal: (total: number) => void;
}

export function useTimerEdit({
  isRunning,
  timeLeft,
  setTimeLeft,
  setPhaseTotal,
}: UseTimerEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isCancelling = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    if (isRunning) return;
    setEditValue(formatTimeMMSS(timeLeft));
    isCancelling.current = false;
    setIsEditing(true);
  }, [isRunning, timeLeft]);

  const confirmEdit = useCallback(() => {
    if (isCancelling.current) return;

    const seconds = parseTimeInput(editValue);
    if (seconds !== null) {
      setTimeLeft(seconds);
      setPhaseTotal(seconds);
    }
    setIsEditing(false);
  }, [editValue, setTimeLeft, setPhaseTotal]);

  const cancelEdit = useCallback(() => {
    isCancelling.current = true;
    setIsEditing(false);
  }, []);

  const handleEditChange = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      setEditValue(digits.slice(0, 2) + ':' + digits.slice(2));
    } else if (digits.length > 0) {
      setEditValue(digits + ':');
    } else {
      setEditValue('');
    }
  }, []);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') confirmEdit();
    if (e.key === 'Escape') cancelEdit();
  }, [confirmEdit, cancelEdit]);

  return {
    isEditing,
    editValue,
    inputRef,
    startEditing,
    confirmEdit,
    cancelEdit,
    handleEditChange,
    handleEditKeyDown,
  };
}
