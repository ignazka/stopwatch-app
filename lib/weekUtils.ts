import { Session } from './types';

export function getWeekRange(date: string): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + offset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

export function getWeeksInMonth(date: string): Array<{ start: string; end: string }> {
  const d = new Date(date);
  const month = d.getMonth();
  const firstOfMonth = new Date(d.getFullYear(), month, 1);
  const firstDay = firstOfMonth.getDay();
  const offset = firstDay === 0 ? -6 : 1 - firstDay;
  const cursor = new Date(firstOfMonth);
  cursor.setDate(firstOfMonth.getDate() + offset);

  const weeks: Array<{ start: string; end: string }> = [];
  while (cursor.getMonth() <= month && cursor.getFullYear() <= d.getFullYear()) {
    const weekStart = new Date(cursor);
    const weekEnd = new Date(cursor);
    weekEnd.setDate(cursor.getDate() + 6);
    weeks.push({
      start: weekStart.toISOString().slice(0, 10),
      end: weekEnd.toISOString().slice(0, 10),
    });
    cursor.setDate(cursor.getDate() + 7);
    // stop when the monday is already past the month
    if (cursor.getMonth() !== month && weekEnd.getMonth() !== month) break;
  }
  return weeks;
}

export function filterSessionsInRange(
  sessions: Session[],
  start: string,
  end: string,
): Session[] {
  return sessions.filter((s) => s.date >= start && s.date <= end);
}

export function sumDuration(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
}
