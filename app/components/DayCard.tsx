import { formatDuration } from '@/lib/formatDuration';
import { Session } from '@/lib/types';

export function DayCard({
  date,
  sessions,
}: {
  date: string;
  sessions: Session[];
}) {
  const total = sessions.reduce((sum, session) => {
    return sum + session.duration_seconds;
  }, 0);

  return (
    <div className='p-2 w-max mb-5 bg-gray-900'>
      <span className=' text-fuchsia-200'>{date}</span>
      <ul className='m-2 flex flex-col w-100 '>
        {sessions.map((s, idx) => (
          <li
            className={`font-mono flex justify-between font-light text-emerald-400 ${sessions.length === idx + 1 ? 'text-green-200' : ''}`}
            key={s.start}
          >
            <div className='flex-1/3'>{s.start.slice(0, 5)}</div>

            <div className='flex-1/3 text-center'>
              {s.tag ?? <span className='text-gray-500'>{`[kein tag]`}</span>}
            </div>
            <div className='flex-1/3'>{formatDuration(s.duration_seconds)}</div>
          </li>
        ))}
      </ul>
      <div>
        <hr className='mt-3 mb-3' />
        Gesamtzeit: <span className='font-bold'>{formatDuration(total)}</span>
      </div>
    </div>
  );
}
