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
    <Card className='mb-5'>
      <CardHeader>{date}</CardHeader>
      <CardContent>
        <Table>
          <TableBody className={``}>
            {sessions.map((s) => (
              <TableRow key={s.start}>
                <TableCell>{s.start.slice(0, 5)}</TableCell>

                <TableCell>
                  {s.tag ?? <span className=''>{`[kein tag]`}</span>}
                </TableCell>
                <TableCell>{formatDuration(s.duration_seconds)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        {' '}
        Gesamtzeit: <span className='font-bold'>{formatDuration(total)}</span>
      </CardFooter>
    </Card>
  );
}
