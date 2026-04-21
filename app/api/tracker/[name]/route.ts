import { NextRequest } from 'next/server';
import z, { ZodTypeAny } from 'zod';
import {
  getTrackerConfig,
  readTrackerEntries,
  appendTrackerEntry,
} from '@/lib/trackers';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const config = getTrackerConfig(name);
  if (!config) return Response.json({ message: 'Tracker not found' }, { status: 404 });
  return Response.json(readTrackerEntries(name));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const config = getTrackerConfig(name);
  if (!config) return Response.json({ message: 'Tracker not found' }, { status: 404 });

  const body = await req.json();

  const fieldSchema = Object.fromEntries(
    config.fields.map((f): [string, ZodTypeAny] => [
      f.key,
      f.type === 'number' ? z.number() : z.string().nullable(),
    ]),
  );

  const Schema = z.object({
    period: z.string(),
    fields: z.object(fieldSchema),
  });

  const result = Schema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { message: 'Unexpected data', errors: result.error.issues },
      { status: 422 },
    );
  }

  appendTrackerEntry(name, {
    period: result.data.period,
    fields: result.data.fields as Record<string, number | string | null>,
  });
  return Response.json({ success: true }, { status: 201 });
}
