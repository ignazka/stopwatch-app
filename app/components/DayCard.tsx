import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
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
    <Card className='mb-4 font-thin w-120'>
      <CardHeader className='text-foreground text-[1.15em]'>{date}</CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.start}>
                <TableCell>{s.start.slice(0, 5)}</TableCell>

                <TableCell>
                  {s.tag ?? <span className='font-mono'>{`[kein tag]`}</span>}
                </TableCell>
                <TableCell>{formatDuration(s.duration_seconds)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        Gesamtzeit:
        <span className='ml-2 font-normal text-[1.15em]'>
          {formatDuration(total)}
        </span>
      </CardFooter>
    </Card>
  );
}
