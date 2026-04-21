# LEARNINGS – stopwatch-app

---

## 2026-04-17 — TypeScript-Typen für sessions.json

**What we built:** `Session`- und `Interval`-Interfaces die das reale JSON-Schema korrekt abbilden

**Key concept:** Optionale Felder mit `?` für Rückwärtskompatibilität — alte Sessions haben kein `intervals`, neue haben kein `laps_seconds`. Beide Felder als optional markieren statt zu löschen.

**Code:**
```ts
export interface Interval {
  start: string;
  end: string;
}

export interface Session {
  tag: string | null;        // null wenn kein Tag angegeben
  date: string;
  start: string;
  end: string;
  duration_seconds: number;
  meta: Record<string, unknown>; // nicht nur Zahlen — auch Strings möglich
  note: string | null;
  laps_seconds?: number[];   // legacy, optional
  intervals?: Interval[];    // neu, optional für alte Sessions
}
```

**Gotchas / notes:** `Interval` muss `export` haben, damit Komponenten den Typ importieren können. `meta` als `Record<string, number>` war zu eng — Felder wie `intensitaet: "moderat"` wären ein TypeScript-Fehler.

---

## 2026-04-17 — Tagesübersicht Dashboard

**What we built:** Sessions aus JSON laden, nach Datum gruppieren, als Liste rendern

**Key concept:** Next.js Server Components können `fs` direkt aufrufen — kein `useEffect`, kein `fetch`. `getSessions()` läuft auf dem Server, die Seite wird als HTML ausgeliefert.

**Code:**
```tsx
// page.tsx — Server Component, kein "use client"
export default function Home() {
  const { sessions } = getSessions();
  const grouped = groupByDate(sessions);
  const dates = Object.keys(grouped).sort().reverse();
  return dates.map((date) => (
    <DayCard key={date} date={date} sessions={grouped[date]} />
  ));
}
```

**Gotchas / notes:**
- `Object.keys()` gibt nur die Keys zurück — Values separat mit `grouped[date]` holen
- Komponenten immer als JSX `<DayCard />` aufrufen, nie als Funktion `DayCard({})`
- Named exports für Komponenten (`export function DayCard`), default export nur für Pages
- `array.reduce((sum, item) => sum + item.wert, 0)` — Startwert `0` nicht vergessen

---

## 2026-04-17 — Filter nach Tag

**What we built:** URL-basierter Tag-Filter mit dynamischen Filter-Buttons

**Key concept:** `searchParams` in Server Components — Query-Parameter kommen als Prop, kein `useSearchParams`, kein `"use client"`. Filter-Buttons sind einfache `<a href="/?tag=...">` Links.

**Code:**
```tsx
export default function Home({ searchParams }: { searchParams: { tag?: string } }) {
  const allTags = Array.from(
    new Set(sessions.map(s => s.tag).filter((t): t is string => t !== null))
  );
}
```

**Gotchas / notes:**
- `filter(Boolean)` engt `string | null` in TypeScript nicht automatisch auf `string` ein — Type Predicate `(t): t is string => t !== null` nötig
- `useMemo` macht in Server Components keinen Sinn — kein Re-Render, kein Cache nötig
- "alle" als Reset-Link zeigt auf `/` (kein `?tag=`), landet also nie in `searchParams`

---

## 2026-04-17 — Browser-Timer mit useEffect + useRef

**What we built:** Client Component mit laufendem Timer, Stop speichert Session via API Route

**Key concept:** `setInterval` in React braucht `useEffect` als Container — der Effect startet den Interval wenn `running` true wird, und die Cleanup-Funktion stoppt ihn wieder.

**Code:**
```tsx
useEffect(() => {
  if (!running) return;

  const interval = setInterval(() => {
    // Funktions-Update: liest aktuellen Wert, nicht den eingefroren Closure-Wert
    setElapsed((prev) => prev + 100);
  }, 100);

  // Cleanup läuft wenn running sich ändert oder Komponente unmounted
  return () => clearInterval(interval);
}, [running]);
```

**Gotchas / notes:**
- `setElapsed(elapsed + 100)` wäre ein Bug — `elapsed` im Interval-Callback ist eingefroren (Closure). Immer Funktions-Update `(prev => ...)` verwenden
- `useRef` statt `useState` für `startTime`/`startDate` — Wertänderung soll keinen Re-Render auslösen. `.current` direkt setzen, kein Setter nötig
- Cleanup-Funktion ist zwingend — ohne `clearInterval` laufen nach jedem Start/Stop mehr Intervals parallel
- `"use client"` zwingend für `useState`, `useEffect`, `useRef` und Event-Handler

---

## 2026-04-17 — Tag-Auswahl und dynamische Meta-Felder im Timer

**What we built:** Timer mit Tag-Dropdown und dynamischen Formularfeldern basierend auf `session-types.json`

**Key concept:** `session-types.json` wird im Server Component gelesen und als Prop an den Client Component übergeben — der Client kann keine Dateien lesen, bekommt die Daten aber sauber als Props.

**Code:**
```tsx
// Meta als Record<string, string> — alle Inputs als string, beim Speichern konvertieren
const [meta, setMeta] = useState<Record<string, string>>({});

// Ein Feld aktualisieren ohne die anderen zu verlieren:
setMeta((prev) => ({ ...prev, [field.key]: e.target.value }));

// Beim Stop: string → number für Zahlenfelder
parsedMeta[field.key] = field.type.startsWith('enum:') || field.type === 'number'
  ? parseFloat(val)
  : val;
```

**Gotchas / notes:**
- Meta als `string` speichern vereinfacht die Inputs — `<input type="number">` gibt immer einen string zurück, Konvertierung beim Speichern ist sauberer
- `[field.key]` in eckigen Klammern = computed property key — dynamischer Objektschlüssel zur Laufzeit
- `types[selectedTag]?.fields ?? []` — `?.` schützt falls Tag nicht in types, `?? []` gibt leeres Array statt undefined
- `router.refresh()` lädt nur die Server Components neu, kein Full-Page-Reload

---

## 2026-04-17 — Hintergrund-stabiler Timer + Pause/Resume

**What we built:** Timer der im Hintergrund-Tab korrekt weiterläuft, mit Pause/Resume und Interval-Tracking

**Problem vorher:** Zeit wurde akkumuliert — jeder Interval-Tick addierte 100ms:
```ts
// ❌ vorher: driftet wenn Tab gedrosselt wird
setElapsed((prev) => prev + 100);
```
Browser drosseln `setInterval` in inaktiven Tabs auf ~1 Sekunde. Nach 10 Minuten im Hintergrund wäre der Timer weit hinter der echten Zeit.

**Lösung nachher:** Immer gegen die echte Systemuhr rechnen:
```ts
// ✅ nachher: immer korrekt, egal wie oft der Interval feuert
setElapsed(Date.now() - startTimestamp.current! - totalPausedMs.current);
```
`Date.now()` gibt die echte Uhrzeit in ms. Selbst wenn der Interval nur alle 2 Sekunden feuert, zeigt der Timer immer die richtige Zeit.

**Pause/Resume:**
```ts
// Pause: Zeitpunkt merken, Interval schließen
pauseStartTimestamp.current = Date.now();
intervals.current[intervals.current.length - 1].end = nowTimeString();

// Resume: Pausendauer akkumulieren, neues Interval öffnen
totalPausedMs.current += Date.now() - pauseStartTimestamp.current!;
intervals.current.push({ start: nowTimeString(), end: '' });
```

**Status statt boolean:**
```ts
// ❌ vorher: running: boolean — kann nicht zwischen idle und paused unterscheiden
// ✅ nachher: drei Zustände
type TimerStatus = 'idle' | 'running' | 'paused';
```

**Gotchas / notes:**
- `startTimestamp` als `useRef` (nicht State) — Änderung soll keinen Re-Render auslösen
- `intervals.current[last].end = nowTimeString()` mutiert das Array direkt — bei refs ist das okay, kein `setState` nötig
- `!` nach `.current` = Non-null assertion — sagt TypeScript "dieser Wert ist hier garantiert nicht null"

---

## 2026-04-21 — Refactor: Spezifisches Feature zu generischem System

**Was wir gebaut haben:** Den hardcodierten Dehnen-Tracker in ein konfigurierbares, generisches Tracker-System umgebaut, das über eine JSON-Config-Datei gesteuert wird.

**Key concept:** Wenn eine Funktion mehrfach gebraucht wird oder persönliche Daten enthält, lohnt es sich, sie zu generalisieren — Konfiguration außerhalb des Codes zu halten statt sie hardcoded einzubauen.

---

### Schritt 1: Problem erkennen

Der alte Code hatte alles hardcoded:
- Komponenten `DehnenForm`, `DehnenHistory`, `DehnenReminder` kannten nur Dehnen-Felder
- Route `/dehnen` war fest verdrahtet
- Feldnamen wie `laenge_s_nbp` lagen direkt im Quellcode — damit war im Repo sichtbar, was getrackt wird

**Ziel:** Beliebige Tracker über eine externe Config-Datei definierbar machen, ohne Code zu ändern.

---

### Schritt 2: Config-Schema entwerfen

Erst überlegen, wie die Konfiguration aussehen soll — bevor man Code schreibt:

```json
{
  "trackers": [
    {
      "name": "my-tracker",
      "label": "My Tracker",
      "interval": "monthly",
      "available_from_day": 19,
      "fields": [
        { "key": "value_a", "label": "Value A", "type": "number" },
        { "key": "notes",   "label": "Notes",   "type": "text"   }
      ]
    }
  ]
}
```

Wichtig: `config/trackers.json` wird gitignored, `config/trackers.example.json` kommt ins Repo. So enthält das Repo keine persönlichen Daten.

---

### Schritt 3: TypeScript-Typen ableiten

Aus dem Config-Schema TypeScript-Interfaces ableiten:

```ts
export type TrackerFieldType = 'number' | 'text';

export interface TrackerField {
  key: string;
  label: string;
  type: TrackerFieldType;
}

export interface TrackerConfig {
  name: string;
  label: string;
  interval: 'daily' | 'monthly';
  available_from_day?: number; // optional
  fields: TrackerField[];
}

export interface TrackerEntry {
  id: string;
  period: string; // "YYYY-MM" oder "YYYY-MM-DD"
  fields: Record<string, number | string | null>;
}
```

`Record<string, number | string | null>` statt fester Felder — weil zur Compile-Zeit nicht bekannt ist, welche Felder ein Tracker hat.

---

### Schritt 4: Datenschicht generalisieren (`lib/trackers.ts`)

Die alten `getDehnenProgress()` / `saveDehnenProgress()` Funktionen wurden zu generischen Funktionen:

```ts
// Config lesen
export function getTrackerConfigs(): TrackerConfig[] {
  if (!fs.existsSync(CONFIG_PATH)) return [];
  return (JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as TrackersFile).trackers;
}

// Daten lesen — Dateiname dynamisch aus tracker name
export function readTrackerEntries(name: string): TrackerFile {
  const filePath = path.resolve(process.cwd(), `data/tracker-${name}.json`);
  if (!fs.existsSync(filePath)) return { entries: [] };
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TrackerFile;
}
```

Jeder Tracker bekommt seine eigene Datei: `data/tracker-{name}.json`. Das `data/`-Verzeichnis ist komplett gitignored.

---

### Schritt 5: API Route dynamisch machen

Statt `/api/dehnen-progress` gibt es jetzt `/api/tracker/[name]` — ein Next.js Dynamic Route Segment:

```ts
// app/api/tracker/[name]/route.ts
export async function POST(req, { params }) {
  const { name } = await params;
  const config = getTrackerConfig(name);
  if (!config) return Response.json({ message: 'Not found' }, { status: 404 });

  // Zod-Schema dynamisch aus der Config aufbauen
  const fieldSchema = Object.fromEntries(
    config.fields.map((f) => [
      f.key,
      f.type === 'number' ? z.number() : z.string().nullable(),
    ])
  );
  // ...
}
```

`Object.fromEntries` + `map` baut das Zod-Validierungsschema zur Laufzeit — basierend auf der Config, nicht auf hardcodierten Feldern.

---

### Schritt 6: Komponenten generisch machen

`DehnenForm` wurde zu `TrackerForm` — bekommt `config: TrackerConfig` als Prop und rendert die Felder dynamisch:

```tsx
{config.fields.map((f) => (
  <input
    key={f.key}
    type={f.type === 'number' ? 'number' : 'text'}
    // ...
  />
))}
```

Statt vier hardcodierter Inputs für `laenge_s_nbp` etc. — beliebig viele Felder aus der Config.

---

### Schritt 7: Reminder generalisieren

`DehnenReminder` kannte nur einen Tracker. `TrackerReminder` bekommt eine Liste aller Tracker bei denen der Eintrag fehlt:

```tsx
// In page.tsx: alle monatlichen Tracker prüfen
const missingTrackers = trackerConfigs
  .filter((t) => t.interval === 'monthly')
  .filter((t) => t.available_from_day == null || currentDay >= t.available_from_day)
  .filter((t) => !readTrackerEntries(t.name).entries.some((e) => e.period === currentMonth))
  .map((t) => ({ name: t.name, label: t.label }));
```

---

### Schritt 8: Dynamische Page-Route

`/app/dehnen/page.tsx` → `/app/tracker/[name]/page.tsx`:

```tsx
export default async function TrackerPage({ params }) {
  const { name } = await params;
  const config = getTrackerConfig(name);
  if (!config) notFound(); // 404 bei unbekanntem Tracker
  // ...
}
```

`notFound()` ist eine Next.js-Funktion die automatisch die 404-Seite zeigt.

---

**Gotchas / notes:**
- `config/trackers.json` gitignoren — sonst sind persönliche Tracker-Namen im Repo sichtbar
- `data/` komplett gitignoren, nicht nur einzelne Dateien — sonst vergisst man neue Tracker-Dateien
- Zod-Schema dynamisch aufbauen funktioniert, aber `result.data.fields` hat Typ `Record<string, unknown>` — ein Cast auf `Record<string, number | string | null>` ist nötig, da Zod den Typ nicht vollständig ableiten kann wenn das Schema zur Laufzeit gebaut wird
- Bestehende Daten vor dem Refactor sichern — leere JSON-Dateien verliert man nichts, aber bei echten Daten müsste man das alte Format manuell ins neue migrieren
