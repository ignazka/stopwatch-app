import { Session } from './types';

export function filterSessionsByTag(
  sessions: Session[],
  tag: string | undefined,
): Session[] {
  if (tag === undefined || tag === 'alle') return sessions;
  const filteredSessions = sessions.filter((s) => s.tag === tag);
  return filteredSessions;
}
