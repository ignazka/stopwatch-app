import fs from 'fs';
import path from 'path';
import { MoodEntry, MoodFile } from './types';

const DATA_PATH_MOOD = path.resolve(process.cwd(), 'data/mood.json');

export function readMoodEntries(): MoodFile {
  if (!fs.existsSync(DATA_PATH_MOOD)) {
    const defaultData: MoodFile = { entries: [] };
    fs.writeFileSync(DATA_PATH_MOOD, JSON.stringify(defaultData, null, 2));
  }

  const raw = fs.readFileSync(DATA_PATH_MOOD, 'utf-8');
  return JSON.parse(raw) as MoodFile;
}

export function appendMoodEntry(data: Omit<MoodEntry, 'id'>): void {
  const entry: MoodEntry = { ...data, id: crypto.randomUUID() };
  fs.mkdirSync(path.dirname(DATA_PATH_MOOD), { recursive: true });
  const allExisitingMoodEntries = readMoodEntries();

  allExisitingMoodEntries.entries.push(entry);
  fs.writeFileSync(
    DATA_PATH_MOOD,
    JSON.stringify(allExisitingMoodEntries, null, 2),
  );
}
