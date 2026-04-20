import { View } from './types';

function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Thursday of current week determines the ISO year
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week, year: d.getFullYear() };
}

export function getPeriodLabel(view: View, date: string): string {
  const d = new Date(date);
  if (view === 'day') {
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (view === 'week') {
    const { week, year } = getISOWeek(d);
    return `KW ${week} · ${year}`;
  }
  return d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}

export function shiftDate(view: View, date: string, direction: -1 | 1): string {
  const d = new Date(date);
  if (view === 'day') {
    d.setDate(d.getDate() + direction);
  } else if (view === 'week') {
    d.setDate(d.getDate() + 7 * direction);
  } else {
    d.setMonth(d.getMonth() + direction);
  }
  return d.toISOString().slice(0, 10);
}
