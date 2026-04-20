import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Session } from '@/lib/types';
import { formatDuration } from '@/lib/formatDuration';
import { getWeekRange, filterSessionsInRange, sumDuration } from '@/lib/weekUtils';

// Kurzbezeichnungen für die 7 Wochentage, Index 0 = Montag
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function WeekView({ date, sessions, currentTag }: { date: string; sessions: Session[]; currentTag?: string }) {
  // Montag und Sonntag der Woche ermitteln, die `date` enthält
  const { start, end } = getWeekRange(date);

  // Nur Sessions innerhalb dieser Woche (alle anderen ausblenden)
  const weekSessions = filterSessionsInRange(sessions, start, end);

  // Summe aller Sekunden der ganzen Woche
  const weekTotal = sumDuration(weekSessions);

  // Array mit 7 Einträgen (Mo–So) — Array.from mit length:7 erzeugt [0,1,2,3,4,5,6]
  // `_` ist der Wert (immer undefined), `i` ist der Index
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i); // Montag + i Tage = jeweiliger Wochentag
    const dayStr = d.toISOString().slice(0, 10); // → "2026-04-21"
    const daySessions = weekSessions.filter((s) => s.date === dayStr);
    return {
      dayStr,
      label: WEEKDAYS[i],
      total: sumDuration(daySessions),
      // filter(Boolean) entfernt null-Werte aus dem tags-Array
      tags: daySessions.map((s) => s.tag).filter(Boolean),
    };
  });

  return (
    <Card className='mb-4 font-thin w-full'>
      <CardHeader className='text-foreground text-[1.15em]'>{start} – {end}</CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {days.map(({ dayStr, label, total, tags }) => {
              // URL für den Link zur Tagesansicht bauen, Tag-Filter beibehalten
              const params = new URLSearchParams({ view: 'day', date: dayStr });
              if (currentTag) params.set('tag', currentTag);
              return (
                // Tage ohne Sessions werden ausgegraut
                <TableRow key={dayStr} className={total === 0 ? 'text-zinc-600' : ''}>
                  <TableCell>
                    <a href={`?${params.toString()}`} className='hover:underline'>{label}</a>
                  </TableCell>
                  <TableCell className='text-zinc-500'>{tags.join(', ')}</TableCell>
                  <TableCell>{total > 0 ? formatDuration(total) : '—'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        Gesamtzeit:
        <span className='ml-2 font-normal text-[1.15em]'>{formatDuration(weekTotal)}</span>
      </CardFooter>
    </Card>
  );
}
