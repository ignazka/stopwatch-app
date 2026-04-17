import { DayCard } from './components/DayCard';
import { getSessions, getSessionTypes } from '@/lib/sessions';
import { groupByDate } from '@/lib/groupByDate';
import { filterSessionsByTag } from '@/lib/filterSessionsByTag';
import { TagFilterButton } from './components/TagFilterButton';
import { Timer } from './components/Timer';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

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
    <div className='bg-zinc-50 font-sans dark:bg-black'>
      <main className='w-full max-w-3xl py-32 px-16 bg-white dark:bg-black sm:items-start'>
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
