import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DehnenEntry } from "@/lib/types";
import Image from "next/image";

const FIELDS = [
  { key: "laenge_s_nbp" as const, label: "Länge S NBP", value: (e: DehnenEntry) => e.laenge_s.nbp },
  { key: "laenge_s_bp" as const, label: "Länge S BP",  value: (e: DehnenEntry) => e.laenge_s.bp  },
  { key: "laenge_e_nbp" as const, label: "Länge E NBP", value: (e: DehnenEntry) => e.laenge_e.nbp },
  { key: "laenge_e_bp" as const, label: "Länge E BP",  value: (e: DehnenEntry) => e.laenge_e.bp  },
];

export function DehnenHistory({ entries }: { entries: DehnenEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-zinc-600 font-mono">Noch keine Einträge.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {[...entries].reverse().map((entry) => (
        <Card key={entry.month} className="font-thin w-full max-w-md">
          <CardHeader className="text-foreground text-[1.15em]">{entry.month}</CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableBody>
                {FIELDS.map(({ key, label, value }) => (
                  <TableRow key={key}>
                    <TableCell className="text-zinc-500">{label}</TableCell>
                    <TableCell className="font-mono">{value(entry)}</TableCell>
                    <TableCell>
                      {entry.images?.[key] && (
                        <Image
                          src={`/dehnen/${entry.images[key]}`}
                          alt={label}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                      )}
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
