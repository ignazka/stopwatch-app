import { DehnenForm } from "@/app/components/DehnenForm";
import { DehnenHistory } from "@/app/components/DehnenHistory";
import { getDehnenProgress } from "@/lib/dehnen";

export default function DehnenPage() {
  const { entries } = getDehnenProgress();

  return (
    <main className="flex flex-col w-full items-center p-10 bg-zinc-950 font-heading gap-8">
      <div className="w-full max-w-md">
        <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm font-mono">← Zurück</a>
      </div>
      <DehnenForm />
      <DehnenHistory entries={entries} />
    </main>
  );
}
