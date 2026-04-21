import { MoodForm } from '@/app/components/MoodForm';
import { MoodHistory } from '@/app/components/MoodHistory';
import { MoodChart } from '@/app/components/MoodChart';
import { readMoodEntries } from '@/lib/mood';

export default function MoodPage() {
  const { entries } = readMoodEntries();

  return (
    <main className='flex flex-col w-full items-center p-10 bg-zinc-950 font-heading gap-8'>
      <div className='w-full max-w-md'>
        <a href='/' className='text-zinc-500 hover:text-zinc-300 text-sm font-mono'>
          ← Zurück
        </a>
      </div>
      <h1 className='text-zinc-300 text-xl font-mono'>Stimmungstagebuch</h1>
      <MoodForm />
      <MoodChart entries={entries} />
      <MoodHistory entries={entries} />
    </main>
  );
}
