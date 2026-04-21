import { DayCard } from './components/DayCard';
import { getSessions, getSessionTypes } from '@/lib/sessions';
import { groupByDate } from '@/lib/groupByDate';
import { filterSessionsByTag } from '@/lib/filterSessionsByTag';
import { TagFilterButton } from './components/TagFilterButton';
import { Timer } from './components/Timer';
import { View } from '@/lib/types';
import { ViewTabs } from './components/ViewTabs';
import { PeriodNav } from './components/PeriodNav';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { isView } from '@/lib/typeGuards';
import { TrackerReminder } from './components/TrackerReminder';
import { getTrackerConfigs, readTrackerEntries } from '@/lib/trackers';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    tag?: string;
    view?: string;
    date?: string;
  }>;
}) {
  const { tag, view, date } = await searchParams;

  const guardedView: View = view && isView(view) ? view : 'week';
  const guardedDate = date ?? new Date().toISOString().slice(0, 10);

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const currentDay = now.getDate();
  const trackerConfigs = getTrackerConfigs();
  const missingTrackers = trackerConfigs
    .filter((t) => t.interval === 'monthly')
    .filter((t) => t.available_from_day == null || currentDay >= t.available_from_day)
    .filter((t) => !readTrackerEntries(t.name).entries.some((e) => e.period === currentMonth))
    .map((t) => ({ name: t.name, label: t.label }));

  const sessionsRAW = getSessions();
  const sessionTypesRAW = getSessionTypes();

  const allTags = [
    'alle',
    ...Array.from(
      new Set(sessionsRAW.sessions.map((s) => s.tag).filter((t) => t !== null)),
    ),
  ];
  const filteredSessions = filterSessionsByTag(sessionsRAW.sessions, tag);
  const groupedSessionsByDate = groupByDate(filteredSessions);
  const sortedArrayByDate = Object.keys(groupedSessionsByDate).sort().reverse();
  return (
    <main className='flex flex-col w-full flex-wrap items-center  p-10 bg-zinc-950 font-heading'>
      <TrackerReminder missing={missingTrackers} />
      <div className="w-full flex justify-end gap-4 mb-4">
        <a href="/mood" className="text-zinc-500 hover:text-zinc-300 text-sm font-mono">Stimmung →</a>
        {trackerConfigs.map((t) => (
          <a key={t.name} href={`/tracker/${t.name}`} className="text-zinc-500 hover:text-zinc-300 text-sm font-mono">
            {t.label} →
          </a>
        ))}
      </div>
      <Timer types={sessionTypesRAW} />
      <div className='pb-5'>
        {allTags.map((t) => (
          <TagFilterButton key={t} tag={t} currentTag={tag} />
        ))}
      </div>

      <div>
        <ViewTabs currentTag={tag} currentView={guardedView} />
        <PeriodNav currentView={guardedView} date={guardedDate} currentTag={tag} />
        {guardedView === 'day' && groupedSessionsByDate[guardedDate] && (
          <DayCard date={guardedDate} sessions={groupedSessionsByDate[guardedDate]} />
        )}
        {guardedView === 'day' && !groupedSessionsByDate[guardedDate] && (
          <p className='text-zinc-600 font-mono'>Keine Sessions.</p>
        )}
        {guardedView === 'week' && (
          <WeekView date={guardedDate} sessions={filteredSessions} currentTag={tag} />
        )}
        {guardedView === 'month' && (
          <MonthView date={guardedDate} sessions={filteredSessions} currentTag={tag} />
        )}
      </div>
    </main>
  );
}
