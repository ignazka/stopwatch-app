import { DayCard } from './components/DayCard';
import { getSessions, getSessionTypes } from '@/lib/sessions';
import { groupByDate } from '@/lib/groupByDate';
import { filterSessionsByTag } from '@/lib/filterSessionsByTag';
import { TagFilterButton } from './components/TagFilterButton';
import { Timer } from './components/Timer';
import { View } from '@/lib/types';
import { ViewTabs } from './components/ViewTabs';
import { isView } from '@/lib/typeGuards';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    tag?: string;
    view?: string;
  }>;
}) {
  const { tag, view } = await searchParams;

  const guardedView: View = view && isView(view) ? view : 'week';

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
    <div className='bg-zinc-50 font-sans dark:bg-zinc-950'>
      <main className='w-full max-w-3xl py-32 px-16 sm:items-start'>
        <ViewTabs currentTag={tag} currentView={guardedView} />

        <Timer types={sessionTypesRAW} />
        {allTags.map((t) => (
          <TagFilterButton key={t} tag={t} />
        ))}
        <h1>Alle Sessions</h1>
        {sortedArrayByDate.map((date) => (
          <DayCard
            key={date}
            date={date}
            sessions={groupedSessionsByDate[date]}
          />
        ))}
      </main>
    </div>
  );
}
