export default interface CalendarEvent {
  id: string;
  description: string;
  date: Date;
  timeLabel?: string;
  color?: string;
}
