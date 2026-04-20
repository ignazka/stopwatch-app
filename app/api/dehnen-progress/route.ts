import { getDehnenProgress, saveDehnenProgress } from '@/lib/dehnen';
import { NextRequest } from 'next/server';
import z from 'zod';

const DehnenProgressSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  laenge_s: z.object({ nbp: z.number(), bp: z.number() }),
  laenge_e: z.object({ nbp: z.number(), bp: z.number() }),
  images: z.object({
    laenge_s_nbp: z.string().optional(),
    laenge_s_bp: z.string().optional(),
    laenge_e_nbp: z.string().optional(),
    laenge_e_bp: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  if (new Date().getDate() < 19) {
    return Response.json({ message: 'Nur am 19. des Monats möglich' }, { status: 403 });
  }

  const body = await req.json();

  const result = DehnenProgressSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { message: 'Unexpected data', errors: result.error.issues },
      { status: 422 },
    );
  }

  const dehnenProgresses = getDehnenProgress();
  dehnenProgresses.entries.push(result.data);

  saveDehnenProgress(dehnenProgresses);

  return Response.json({ ok: true });
}
