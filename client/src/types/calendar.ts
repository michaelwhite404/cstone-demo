export type CalendarView = "day" | "week" | "month" | "year";
export interface CalendarEvent {
  id: string;
  description: string;
  date: Date;
  timeLabel?: string;
  color?: string;
}
