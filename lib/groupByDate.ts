import { Session } from './types';

export function groupByDate(sessions: Session[]): Record<string, Session[]> {
  const obj: Record<string, Session[]> = {};

  for (const session of sessions) {
    const date = session.date;

    // Array fuer Datum anlegen
    if (!obj[date]) {
      obj[date] = [];
    }
    // Session in Array speichern
    obj[date].push(session);
  }

  return obj;
}
