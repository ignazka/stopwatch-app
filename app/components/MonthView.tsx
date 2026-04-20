import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Session } from '@/lib/types';
import { formatDuration } from '@/lib/formatDuration';
import { getWeeksInMonth, filterSessionsInRange, sumDuration } from '@/lib/weekUtils';

// ISO-Wochennummer für ein Datum berechnen.
// Die Regel: Der Donnerstag einer Woche bestimmt in welches Jahr (und welche KW) sie fällt.
// Deshalb verschieben wir das Datum zum Donnerstag der gleichen Woche, bevor wir rechnen.
function getISOWeekNumber(date: string): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // getDay() gibt 0 (So) bis 6 (Sa) — (d.getDay() || 7) macht aus Sonntag eine 7
  // +4 − Wochentag verschiebt das Datum auf den Donnerstag der Woche
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  // Millisekunden seit Jahresanfang → Tage → Wochen (aufgerundet)
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function MonthView({ date, sessions, currentTag }: { date: string; sessions: Session[]; currentTag?: string }) {
  // Array aller Wochen im Monat als { start, end }-Objekte (Montag–Sonntag)
  const weeks = getWeeksInMonth(date);

  // Monatssumme: vom Montag der ersten bis Sonntag der letzten Woche
  const monthTotal = sumDuration(
    filterSessionsInRange(sessions, weeks[0].start, weeks[weeks.length - 1].end),
  );

  // Lesbarer Monatsname für den Card-Header, z.B. "April 2026"
  const monthLabel = new Date(date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <Card className='mb-4 font-thin w-120'>
      <CardHeader className='text-foreground text-[1.15em]'>{monthLabel}</CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {weeks.map(({ start, end }) => {
              const total = sumDuration(filterSessionsInRange(sessions, start, end));
              const kw = getISOWeekNumber(start);
              // URL für den Link zur Wochenansicht bauen, Tag-Filter beibehalten
              const params = new URLSearchParams({ view: 'week', date: start });
              if (currentTag) params.set('tag', currentTag);
              return (
                // Wochen ohne Sessions werden ausgegraut
                <TableRow key={start} className={total === 0 ? 'text-zinc-600' : ''}>
                  <TableCell>
                    <a href={`?${params.toString()}`} className='hover:underline'>KW {kw}</a>
                  </TableCell>
                  {/* slice(5) schneidet das Jahr ab: "2026-04-14" → "04-14" */}
                  <TableCell className='text-zinc-500'>{start.slice(5)} – {end.slice(5)}</TableCell>
                  <TableCell>{total > 0 ? formatDuration(total) : '—'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        Gesamtzeit:
        <span className='ml-2 font-normal text-[1.15em]'>{formatDuration(monthTotal)}</span>
      </CardFooter>
    </Card>
  );
}
