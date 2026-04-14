# CLAUDE.md

## Project

Stopwatch dashboard app. Reads session data logged by a Bash script and
visualizes it in a Next.js web app (later PWA + Apple Watch).

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
      "tag": "dehnen",
      "date": "2026-04-13",
      "start": "09:54:25",
      "end": "10:06:48",
      "duration_seconds": 641.98,
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

- `meta` fields vary by tag — treat as `Record`
- `laps_seconds` is an empty array if no laps were recorded
- `note` is `string | null`
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
- [ ] Dashboard: Wochenrückblick (nach Tag + Tageszusammenfassung)
- [ ] Dashboard: Charts (recharts, later)
- [ ] PWA setup (manifest + service worker)

---

## Out of scope (for now)

- Database / SQLite / Postgres migration
- Apple Watch / native Swift
- Write access to sessions.json from the web app
