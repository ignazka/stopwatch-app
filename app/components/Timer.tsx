'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionTypes } from '@/lib/types';
import { Button } from '@/components/ui/button';

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function nowTimeString(): string {
  return new Date().toTimeString().slice(0, 8);
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// Drei Zustände: kein Timer / läuft / pausiert
type TimerStatus = 'idle' | 'running' | 'paused';

export function Timer({ types }: { types: SessionTypes }) {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [meta, setMeta] = useState<Record<string, string>>({});
  const [note, setNote] = useState<string | null>(null);

  // Echter Timestamp (Date.now()) beim Start — Basis für die Zeitberechnung.
  // Nicht State, weil Änderungen keinen Re-Render brauchen.
  const startTimestamp = useRef<number | null>(null);
  // Akkumulierte Pausenzeit in ms — wird bei jedem Resume erhöht.
  const totalPausedMs = useRef<number>(0);
  // Timestamp wann die aktuelle Pause begann.
  const pauseStartTimestamp = useRef<number | null>(null);
  // Wallclock-Zeit (HH:MM:SS) für sessions.json
  const startTime = useRef<string | null>(null);
  const startDate = useRef<string | null>(null);
  // Intervals für sessions.json: jedes { start, end } ist ein aktiver Abschnitt.
  const intervals = useRef<{ start: string; end: string }[]>([]);

  const router = useRouter();
  const currentFields = selectedTag ? (types[selectedTag]?.fields ?? []) : [];

  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      // elapsed immer aus der echten Uhr berechnen, nie akkumulieren.
      // Dadurch stimmt die Zeit auch wenn der Tab im Hintergrund gedrosselt wird.
      setElapsed(Date.now() - startTimestamp.current! - totalPausedMs.current);
    }, 100);

    return () => clearInterval(interval);
  }, [status]);

  function handleTagChange(tag: string) {
    setSelectedTag(tag);
    setMeta({});
  }

  function handleStart() {
    const now = Date.now();
    startTimestamp.current = now;
    totalPausedMs.current = 0;
    startTime.current = nowTimeString();
    startDate.current = todayDateString();
    // Erstes Interval beginnt jetzt
    intervals.current = [{ start: nowTimeString(), end: '' }];
    setElapsed(0);
    setStatus('running');
  }

  function handlePause() {
    // Pausezeit merken, aktuelles Interval schließen
    pauseStartTimestamp.current = Date.now();
    intervals.current[intervals.current.length - 1].end = nowTimeString();
    setStatus('paused');
  }

  function handleResume() {
    // Pausendauer akkumulieren, neues Interval öffnen
    totalPausedMs.current += Date.now() - pauseStartTimestamp.current!;
    intervals.current.push({ start: nowTimeString(), end: '' });
    setStatus('running');
  }

  async function handleStop() {
    // Letztes Interval schließen
    intervals.current[intervals.current.length - 1].end = nowTimeString();
    setStatus('idle');

    const parsedMeta: Record<string, unknown> = {};
    for (const field of currentFields) {
      const val = meta[field.key] ?? '';
      parsedMeta[field.key] =
        field.type.startsWith('enum:') || field.type === 'number'
          ? parseFloat(val)
          : val;
    }

    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag: selectedTag || null,
        date: startDate.current,
        start: startTime.current,
        end: nowTimeString(),
        duration_seconds: elapsed / 1000,
        intervals: intervals.current,
        meta: parsedMeta,
        note: note || null,
      }),
    });
    router.refresh();
    setElapsed(0);
    setMeta({});
    setNote(null);
  }

  // Laden — einmal beim Mount:
  useEffect(() => {
    const raw = localStorage.getItem('timer');
    if (!raw) return;
    const saved = JSON.parse(raw);

    startTimestamp.current = saved.startTimestamp;
    totalPausedMs.current = saved.totalPausedMs;
    pauseStartTimestamp.current = saved.pauseStartTimestamp;
    startTime.current = saved.startTime;
    startDate.current = saved.startDate;
    intervals.current = saved.intervals ?? [];

    setSelectedTag(saved.selectedTag ?? '');
    setMeta(saved.meta ?? {});
    setNote(saved.note ?? null);
    setStatus(saved.status ?? 'idle');
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'timer',
      JSON.stringify({
        status,
        selectedTag,
        meta,
        note,
        startTimestamp: startTimestamp.current,
        totalPausedMs: totalPausedMs.current,
        pauseStartTimestamp: pauseStartTimestamp.current,
        startTime: startTime.current,
        startDate: startDate.current,
        intervals: intervals.current,
      }),
    );
  }, [status, selectedTag, meta, note]);

  return (
    <div className='mb-4'>
      {/* Tag und Meta-Felder nur im idle-Zustand */}
      {status === 'idle' && (
        <div className='flex flex-col'>
          <select
            value={selectedTag}
            onChange={(e) => handleTagChange(e.target.value)}
            className='mr-2'
          >
            <option value=''>— Preset wählen —</option>
            {Object.keys(types).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {currentFields.map((field) => {
            if (field.type.startsWith('enum:')) {
              const options = field.type.replace('enum:', '').split(',');
              return (
                <select
                  key={field.key}
                  value={meta[field.key] ?? ''}
                  onChange={(e) =>
                    setMeta((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                >
                  <option value=''>— {field.label} —</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={field.key}
                type='number'
                placeholder={field.label}
                value={meta[field.key] ?? ''}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
              />
            );
          })}

          {/* <input
            type='text'
            placeholder='Notiz (optional)'
            value={note ?? ''}
            onChange={(e) => setNote(e.target.value)}
          /> */}
        </div>
      )}

      <div className='text-3xl pt-10 pb-10 flex justify-center items-center'>
        <span className='mr-10'>{formatElapsed(elapsed)}</span>

        {status === 'idle' && (
          <Button
            size='lg'
            variant='destructive'
            className='scale-150'
            onClick={handleStart}
          >
            Start
          </Button>
        )}
        {status === 'running' && (
          <>
            <Button onClick={handlePause}>Pause</Button>
            <Button onClick={handleStop}>Stop</Button>
          </>
        )}
        {status === 'paused' && (
          <>
            <Button onClick={handleResume}>Weiter</Button>
            <Button onClick={handleStop}>Stop</Button>
          </>
        )}
      </div>
    </div>
  );
}
