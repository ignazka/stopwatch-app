import fs from 'fs';
import path from 'path';
import { TrackerConfig, TrackerEntry, TrackerFile, TrackersFile } from './types';

const CONFIG_PATH = path.resolve(process.cwd(), 'config/trackers.json');

export function getTrackerConfigs(): TrackerConfig[] {
  if (!fs.existsSync(CONFIG_PATH)) return [];
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return (JSON.parse(raw) as TrackersFile).trackers;
}

export function getTrackerConfig(name: string): TrackerConfig | undefined {
  return getTrackerConfigs().find((t) => t.name === name);
}

export function readTrackerEntries(name: string): TrackerFile {
  const filePath = path.resolve(process.cwd(), `data/tracker-${name}.json`);
  if (!fs.existsSync(filePath)) return { entries: [] };
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as TrackerFile;
}

export function appendTrackerEntry(
  name: string,
  entry: Omit<TrackerEntry, 'id'>,
): void {
  const filePath = path.resolve(process.cwd(), `data/tracker-${name}.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const file = readTrackerEntries(name);
  file.entries.push({ ...entry, id: crypto.randomUUID() });
  fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf-8');
}
