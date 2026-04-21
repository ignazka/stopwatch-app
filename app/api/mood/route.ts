import { appendMoodEntry, readMoodEntries } from '@/lib/mood';
import { NextRequest } from 'next/server';
import z from 'zod';

const MoodSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  mood: z.number().int().min(-10).max(10),
  note: z.string().nullable(),
});

export async function GET() {
  const data = readMoodEntries();
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = MoodSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { message: 'Unexpected data', errors: result.error.issues },
      { status: 422 },
    );
  }

  appendMoodEntry(result.data);

  return Response.json({ success: true }, { status: 201 });
}
