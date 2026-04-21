export interface Session {
  tag: string | null;
  date: string;
  start: string;
  end: string;
  duration_seconds: number;
  meta: Record<string, unknown>;
  note: string | null;
  laps_seconds?: number[];
  intervals?: Interval[];
}

export interface SessionsFile {
  sessions: Session[];
}

export interface Interval {
  start: string;
  end: string;
}
export interface SessionTypeField {
  key: string;
  label: string;
  type: string;
}
export interface SessionType {
  fields: SessionTypeField[];
}
export type SessionTypes = Record<string, SessionType>;

// VIEW
export const VIEWS = ['day', 'week', 'month'] as const;
export type View = (typeof VIEWS)[number];

export const VIEW_LABELS: Record<View, string> = {
  day: 'Tag',
  week: 'Woche',
  month: 'Monat',
};

export type TrackerFieldType = 'number' | 'text';

export interface TrackerField {
  key: string;
  label: string;
  type: TrackerFieldType;
}

export interface TrackerConfig {
  name: string;
  label: string;
  interval: 'daily' | 'monthly';
  available_from_day?: number;
  fields: TrackerField[];
}

export interface TrackersFile {
  trackers: TrackerConfig[];
}

export interface TrackerEntry {
  id: string;
  period: string; // "YYYY-MM" or "YYYY-MM-DD"
  fields: Record<string, number | string | null>;
}

export interface TrackerFile {
  entries: TrackerEntry[];
}

export type MoodEntry = {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM:SS"
  mood: number; // -10–10
  note: string | null;
};

export interface MoodFile {
  entries: MoodEntry[];
}
