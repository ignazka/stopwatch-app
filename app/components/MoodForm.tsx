'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function MoodForm() {
  const [mood, setMood] = useState(0);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);

    await fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time, mood, note: note || null }),
    });

    setMood(0);
    setNote('');
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    router.refresh();
  }

  return (
    <div className='flex flex-col gap-4 w-80'>
      <div className='flex flex-col gap-1'>
        <label className='text-sm text-zinc-400'>
          Stimmung: <span className='text-white font-mono'>{mood > 0 ? `+${mood}` : mood}</span>
        </label>
        <input
          type='range'
          min={-10}
          max={10}
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className={mood > 0 ? 'accent-green-400' : mood < 0 ? 'accent-red-400' : 'accent-yellow-400'}
        />
      </div>

      <textarea
        placeholder='Notiz (optional)'
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className='bg-zinc-800 text-white text-sm rounded p-2 resize-none outline-none focus:ring-1 focus:ring-green-400'
      />

      <Button onClick={handleSubmit} disabled={loading} variant='secondary'>
        {loading ? 'Speichern…' : 'Eintrag speichern'}
      </Button>

      {submitted && (
        <p className='text-green-400 text-sm font-mono'>Gespeichert.</p>
      )}
    </div>
  );
}
