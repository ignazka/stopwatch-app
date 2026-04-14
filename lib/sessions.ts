import path from 'path';
import fs from 'fs';
import { SessionsFile } from './types';

const DATA_PATH = path.resolve(
  process.cwd(),
  '../scripts/stopwatch/sessions.json',
);

/**
 * Reads and parses the sessions data files from disk
 *
 * @returns the full sessions file including all recorded sessions
 * @throws If the files does not exist or contains invalid JSON
 */

export function getSessions(): SessionsFile {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as SessionsFile;
}
