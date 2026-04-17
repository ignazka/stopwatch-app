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
