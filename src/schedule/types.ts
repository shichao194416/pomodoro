export type WeekType = 'A' | 'B';

export interface ScheduleSlot {
  id: string;
  time: string;
  task: string;
  completed: boolean;
  actualStart: number | null;
  sessionId: number | null;
}
