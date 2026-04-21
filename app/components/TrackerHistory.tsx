import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TrackerConfig, TrackerEntry } from '@/lib/types';

export function TrackerHistory({
  config,
  entries,
}: {
  config: TrackerConfig;
  entries: TrackerEntry[];
}) {
  if (entries.length === 0) {
    return <p className='text-zinc-600 font-mono'>Noch keine Einträge.</p>;
  }

  return (
    <div className='flex flex-col gap-4 w-full max-w-md'>
      {[...entries].reverse().map((entry) => (
        <Card key={entry.id} className='font-thin'>
          <CardHeader className='text-foreground text-[1.15em]'>{entry.period}</CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {config.fields.map((f) => (
                  <TableRow key={f.key}>
                    <TableCell className='text-zinc-500'>{f.label}</TableCell>
                    <TableCell className='font-mono'>
                      {entry.fields[f.key] ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
