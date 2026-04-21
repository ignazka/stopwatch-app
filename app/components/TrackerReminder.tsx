'use client';

import { useState } from 'react';

type MissingTracker = { name: string; label: string };

export function TrackerReminder({ missing }: { missing: MissingTracker[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (missing.length === 0 || dismissed) return null;

  return (
    <div className='fixed bottom-6 right-6 z-50 bg-zinc-800 border border-zinc-600 rounded-lg p-4 shadow-lg max-w-xs'>
      <p className='text-zinc-200 text-sm mb-3'>Fehlende Einträge diesen Monat:</p>
      <div className='flex flex-col gap-1 mb-3'>
        {missing.map((t) => (
          <a
            key={t.name}
            href={`/tracker/${t.name}`}
            className='text-violet-300 hover:text-violet-200 text-sm font-mono'
          >
            {t.label} →
          </a>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className='text-zinc-500 hover:text-zinc-300 text-sm'
      >
        ✕
      </button>
    </div>
  );
}
