export type PomodoroMode = 'work' | 'break';

export interface PomodoroState {
  tag: string;
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  defaultWorkTime: number;
  defaultBreakTime: number;
}

export interface PomodoroSession {
  tag: string;
  duration: number;
  timestamp: number;
  completed: boolean;
  note?: string;
  /**
   * Which phase produced this record. Optional for backwards compatibility:
   * records written before this field existed are treated as 'work'.
   * Only 'work' records count towards study time.
   */
  mode?: PomodoroMode;
}
