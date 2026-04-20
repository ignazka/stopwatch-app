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

export interface DehnenMeasurement {
  nbp: number;
  bp: number;
}

export interface DehnenImages {
  laenge_s_nbp?: string;
  laenge_s_bp?: string;
  laenge_e_nbp?: string;
  laenge_e_bp?: string;
}

export interface DehnenEntry {
  month: string; // "YYYY-MM"
  laenge_s: DehnenMeasurement;
  laenge_e: DehnenMeasurement;
  images?: DehnenImages;
}

export interface DehnenProgressFile {
  entries: DehnenEntry[];
}
