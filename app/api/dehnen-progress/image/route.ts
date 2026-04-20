import fs from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get('image') as File;
  const month = formData.get('month') as string;
  // field identifies which measurement this image belongs to, e.g. "laenge_s_nbp"
  const field = formData.get('field') as string;

  if (!file || !month || !field) {
    return Response.json({ message: 'Missing data' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), 'public/dehnen');
  const filePath = path.join(dir, `${month}-${field}.jpg`);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, buffer);

  return Response.json({ ok: true });
}
