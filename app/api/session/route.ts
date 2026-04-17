import { getSessions, saveSession } from '@/lib/sessions';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const IntervalSchema = z.object({
  start: z.string(),
  end: z.string(),
});

const SessionSchema = z.object({
  tag: z.string().nullable(),
  date: z.string(),
  start: z.string(),
  end: z.string(),
  duration_seconds: z.number(),
  intervals: z.array(IntervalSchema),
  meta: z.record(z.string(), z.unknown()),
  note: z.string().nullable(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = SessionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: 'Unexpected data' }, { status: 422 });
  }

  const sessions = getSessions();
  sessions.sessions.push(result.data);

  saveSession(sessions);

  return NextResponse.json({ ok: true });
}
