'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TrackerConfig } from '@/lib/types';

export function TrackerForm({ config }: { config: TrackerConfig }) {
  const [fields, setFields] = useState<Record<string, string>>(
    Object.fromEntries(config.fields.map((f) => [f.key, ''])),
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const router = useRouter();

  const now = new Date();
  const period =
    config.interval === 'monthly'
      ? now.toISOString().slice(0, 7)
      : now.toISOString().slice(0, 10);

  const available =
    config.available_from_day == null || now.getDate() >= config.available_from_day;

  function setField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');

    const parsedFields = Object.fromEntries(
      config.fields.map((f) => [
        f.key,
        f.type === 'number' ? parseFloat(fields[f.key]) : fields[f.key] || null,
      ]),
    );

    try {
      const res = await fetch(`/api/tracker/${config.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, fields: parsedFields }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
      router.refresh();
    } catch {
      setStatus('error');
    }
  }

  if (!available) {
    return (
      <p className='text-zinc-500 text-sm font-mono'>
        Eintrag ab dem {config.available_from_day}. des Monats möglich.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-md'>
      <p className='text-zinc-400 text-sm font-mono'>{period}</p>
      {config.fields.map((f) => (
        <div key={f.key} className='flex items-center gap-3'>
          <label className='w-36 text-zinc-500 text-sm'>{f.label}</label>
          <input
            type={f.type === 'number' ? 'number' : 'text'}
            step={f.type === 'number' ? '0.1' : undefined}
            value={fields[f.key]}
            onChange={(e) => setField(f.key, e.target.value)}
            required
            className='bg-zinc-900 border border-zinc-700 rounded px-2 py-1 w-28 font-mono text-sm'
          />
        </div>
      ))}
      <div className='flex items-center gap-4'>
        <Button type='submit' disabled={status === 'saving'}>
          {status === 'saving' ? 'Speichern…' : 'Speichern'}
        </Button>
        {status === 'done' && <span className='text-green-400 text-sm'>Gespeichert.</span>}
        {status === 'error' && <span className='text-red-400 text-sm'>Fehler.</span>}
      </div>
    </form>
  );
}
