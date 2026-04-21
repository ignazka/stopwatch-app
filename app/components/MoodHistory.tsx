import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MoodEntry } from '@/lib/types';

function moodBar(mood: number) {
  return (
    <div className='flex gap-0.5 items-center'>
      {Array.from({ length: 20 }, (_, i) => {
        const val = i - 10;
        const filled = mood >= 0 ? val >= 0 && val < mood : val < 0 && val >= mood;
        return (
          <>
            {i === 10 && <div key='divider' className='w-1' />}
            <div
              key={i}
              className={[
                'h-2 w-2 rounded-sm',
                mood === 0 ? 'bg-yellow-400' : filled ? (mood > 0 ? 'bg-green-400' : 'bg-red-400') : 'bg-zinc-700',
              ].join(' ')}
            />
          </>
        );
      })}
      <span className='ml-2 font-mono text-sm text-zinc-300'>
        {mood > 0 ? `+${mood}` : mood}
      </span>
    </div>
  );
}

export function MoodHistory({ entries }: { entries: MoodEntry[] }) {
  if (entries.length === 0) {
    return <p className='text-zinc-600 font-mono'>Noch keine Einträge.</p>;
  }

  return (
    <div className='flex flex-col gap-3 w-full max-w-md'>
      {[...entries].reverse().map((entry) => (
        <Card key={entry.id} className='font-thin'>
          <CardHeader className='text-zinc-400 text-sm pb-1'>
            {entry.date}
            <span className='ml-2 text-zinc-600'>{entry.time.slice(0, 5)}</span>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            {moodBar(entry.mood)}
            {entry.note && (
              <p className='text-zinc-400 text-sm'>{entry.note}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
