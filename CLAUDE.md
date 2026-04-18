# CLAUDE.md

## Project

Activity and work tracker. Reads session data logged by a Bash script and
visualizes it in a Next.js web app (later PWA + Apple Watch).

Tracks two kinds of activity:
- **Work sessions** — freelance dev work per client/project, with issue references,
  for client billing and reporting
- **Health/sport sessions** — rowing, stretching, etc.

Later: Pomodoro, GitHub integration, PDF export for client invoicing.

---

## Repo layout

```
stopwatch-app/          ← this repo (Next.js)
../scripts/stopwatch/
  └── sessions.json     ← data source (read-only from app perspective)
```

---

## sessions.json schema

```json
{
  "sessions": [
    {
      "tag": "sherpath",
      "date": "2026-04-15",
      "start": "09:00:00",
      "end": "11:30:00",
      "duration_seconds": 5400,
      "intervals": [
        { "start": "09:00:00", "end": "09:45:00" },
        { "start": "10:00:00", "end": "11:30:00" }
      ],
      "meta": {
        "issue": "#42"
      },
      "note": "Login screen redesign",
      "laps_seconds": []
    },
    {
      "tag": "dehnen",
      "date": "2026-04-13",
      "start": "09:54:25",
      "end": "10:06:48",
      "duration_seconds": 641.98,
      "intervals": [],
      "meta": {
        "zugkraft": 2,
        "laenge_cm": 17.2
      },
      "note": null,
      "laps_seconds": []
    }
  ]
}
```

### Field notes

- `tag` — project/client name (e.g. `"sherpath"`) or activity (e.g. `"dehnen"`, `"rudern"`)
- `intervals` — list of `{ start, end }` time strings; empty if no pause was taken.
  `duration_seconds` = sum of interval durations (real active time, pauses excluded).
  If `intervals` is empty, `duration_seconds` = wall-clock time from `start` to `end`.
- `meta` — tag-specific fields, treat as `Record<string, unknown>`.
  For work sessions: `{ issue: "#42" }`. For sport: varies (e.g. `zugkraft`, `laenge_cm`).
- `note` — free-text description, `string | null`. For work sessions: task description.
- `laps_seconds` — legacy field, ignore. Will be removed from future entries.
- File path (relative to project root): `../scripts/stopwatch/sessions.json`

---

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Charts: recharts
- No database yet — read directly from JSON file via `fs` in Server Components
  or API routes
- Package manager: pnpm

---

## Conventions

- Strict TypeScript — no `any`, no `as` casts without comment
- Named exports for components, default export only for pages
- API routes in `app/api/` with Zod validation on input
- Tailwind only for styling — no inline styles, no CSS modules
- Component files: PascalCase (`SessionCard.tsx`)
- Utility files: camelCase (`formatDuration.ts`)

---

## Collaboration workflow

This project is a learning exercise. Follow this workflow strictly:

1. **Plan first** — before any implementation, present a numbered step-by-step plan and wait for approval
2. **User implements** — explain the goal and hints for each step, then let the user write the code themselves
3. **Claude reviews** — once the user shares their code, review it and give feedback
4. **Capture learnings** — after each step is complete, append an entry to `LEARNINGS.md`

Do not write non-trivial code unless the user explicitly asks. Offer hints and explain concepts instead.

---

## LEARNINGS.md format

One entry per completed step. Each entry:

```markdown
## YYYY-MM-DD — <short title>

**What we built:** one sentence

**Key concept:** the main thing learned

**Code:**
\```ts
// relevant snippet (keep short)
\```

**Gotchas / notes:** anything worth remembering
```

---

## Current status

- [x] Repo exists
- [x] sessions.json einlesen und typisieren (`lib/types.ts`, `lib/sessions.ts`)
- [x] Types aktualisieren: `intervals` rein, `laps_seconds` optional, `tag` nullable, `meta` gelockert
- [x] Dashboard: Tagesübersicht (alle Sessions eines Tages, Gesamtzeit pro Tag)
- [x] Filter nach Tag — Dashboard gefiltert auf einen Tag (z.B. nur "sherpath")
- [x] Session starten/stoppen — Timer im Browser, schreibt in sessions.json via API Route
- [x] Meta-Felder erfassen — Formular je nach Tag (analog zu session-types.json im Script)
- [x] Pause/Resume im Browser-Timer
- [x] Note-Eingabe im Timer
- [ ] Dashboard: Wochen- und Monatsansicht (Tabs: Tag / Woche / Monat, Vor/Zurück-Navigation)
  - Wochenansicht: Gesamtzeit pro Tag, Wochensumme
  - Monatsansicht: Gesamtzeit pro Woche, Monatssumme
- [ ] Work-Report: Gesamtstunden + Issue-Liste pro Kunde (later)
- [ ] PDF-Export: Monatsübersicht + Detailliste pro Kunde (later)
- [ ] Charts (recharts, later)
- [ ] Pomodoro (later)
- [ ] GitHub-Anbindung für Issue-Namen (later)
- [ ] PWA setup (manifest + service worker, later)

---

## Out of scope (for now)

- Database / SQLite / Postgres migration
- Apple Watch / native Swift
- Write access to sessions.json from the web app (Bash script handles recording)
