import path from 'path';
import fs from 'fs';
import { SessionsFile, SessionTypes } from './types';

const DATA_PATH_SESSIONS = path.resolve(
  process.cwd(),
  '../scripts/stopwatch/sessions.json',
);
const DATA_PATH_SESSION_TYPES = path.resolve(
  process.cwd(),
  '../scripts/stopwatch/session-types.json',
);

/**
 * Reads and parses the sessions data files from disk
 *
 * @returns the full sessions file including all recorded sessions
 * @throws If the files does not exist or contains invalid JSON
 */

export function getSessions(): SessionsFile {
  const raw = fs.readFileSync(DATA_PATH_SESSIONS, 'utf-8');
  return JSON.parse(raw) as SessionsFile;
}

export function saveSession(data: SessionsFile): void {
  fs.writeFileSync(DATA_PATH_SESSIONS, JSON.stringify(data, null, 2));
}

export function getSessionTypes() {
  const raw = fs.readFileSync(DATA_PATH_SESSION_TYPES, 'utf-8');
  return JSON.parse(raw) as SessionTypes;
}
