import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}