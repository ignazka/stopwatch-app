export interface Session {
  tag: string;
  date: string;
  start: string;
  end: string;
  duration_seconds: number;
  meta: Record<string, number>;
  note: string | null;
  laps_seconds: number[];
}

export interface SessionsFile {
  sessions: Session[];
}
