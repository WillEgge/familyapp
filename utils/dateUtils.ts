import { format, startOfDay, addDays, subDays, parseISO } from "date-fns";

export function formatDueDate(dueDate: string): string {
  // Parse the input date string
  const inputDate = parseISO(dueDate);

  // Get the current date in the local timezone
  const now = new Date();

  // Create date objects for today, tomorrow, and yesterday in the local timezone
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const yesterday = subDays(today, 1);

  // Create a date object for the input date in the local timezone
  const localInputDate = startOfDay(
    new Date(inputDate.getTime() + now.getTimezoneOffset() * 60000)
  );

  console.log("Input Date:", dueDate);
  console.log("Parsed Local Date:", localInputDate.toISOString());
  console.log("Today:", today.toISOString());
  console.log("Tomorrow:", tomorrow.toISOString());
  console.log("Yesterday:", yesterday.toISOString());

  if (localInputDate.getTime() === today.getTime()) return "Today";
  if (localInputDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (localInputDate.getTime() === yesterday.getTime()) return "Yesterday";
  return format(localInputDate, "MMM d, yyyy");
}