"use client";

import { useState } from "react";

export function DehnenReminder({ hasEntryThisMonth }: { hasEntryThisMonth: boolean }) {
  const [dismissed, setDismissed] = useState(false);

  const day = new Date().getDate();
  if (day < 19 || hasEntryThisMonth || dismissed) return null; // Popup nur genau am 19., nicht den ganzen Rest des Monats

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-zinc-800 border border-zinc-600 rounded-lg p-4 shadow-lg max-w-xs">
      <p className="text-zinc-200 text-sm mb-3">Für diesen Monat fehlt noch die Dehnen-Messung.</p>
      <div className="flex items-center gap-3">
        <a
          href="/dehnen"
          className="text-violet-300 hover:text-violet-200 text-sm font-mono"
        >
          Zur Messung →
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-zinc-300 text-sm ml-auto"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
