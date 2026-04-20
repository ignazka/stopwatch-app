import { View } from '@/lib/types';
import { getPeriodLabel, shiftDate } from '@/lib/periodUtils';

function buildUrl(view: View, date: string, tag?: string): string {
  const params = new URLSearchParams({ view, date });
  if (tag) params.set('tag', tag);
  return `?${params.toString()}`;
}

export function PeriodNav({
  currentView,
  date,
  currentTag,
}: {
  currentView: View;
  date: string;
  currentTag?: string;
}) {
  const prevDate = shiftDate(currentView, date, -1);
  const nextDate = shiftDate(currentView, date, 1);
  const label = getPeriodLabel(currentView, date);

  return (
    <div className='flex items-center gap-4 py-3 font-mono text-zinc-300'>
      <a
        href={buildUrl(currentView, prevDate, currentTag)}
        className='px-2 hover:text-white transition-colors'
      >
        ←
      </a>
      <span className='min-w-40 text-center'>{label}</span>
      <a
        href={buildUrl(currentView, nextDate, currentTag)}
        className='px-2 hover:text-white transition-colors'
      >
        →
      </a>
    </div>
  );
}
