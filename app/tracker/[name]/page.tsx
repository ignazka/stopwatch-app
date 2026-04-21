import { notFound } from 'next/navigation';
import { getTrackerConfig, readTrackerEntries } from '@/lib/trackers';
import { TrackerForm } from '@/app/components/TrackerForm';
import { TrackerHistory } from '@/app/components/TrackerHistory';

export default async function TrackerPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const config = getTrackerConfig(name);
  if (!config) notFound();

  const { entries } = readTrackerEntries(name);

  return (
    <main className='flex flex-col w-full items-center p-10 bg-zinc-950 font-heading gap-8'>
      <div className='w-full max-w-md'>
        <a href='/' className='text-zinc-500 hover:text-zinc-300 text-sm font-mono'>
          ← Zurück
        </a>
      </div>
      <h1 className='text-zinc-300 text-xl font-mono'>{config.label}</h1>
      <TrackerForm config={config} />
      <TrackerHistory config={config} entries={entries} />
    </main>
  );
}
