# Stopwatch App

Personal activity and work tracker. Reads session data from a Bash script and visualizes it in a Next.js web app.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Custom Trackers

Custom trackers let you periodically log any numeric or text values you want to track over time — e.g. body measurements, training metrics, or anything else.

### Setup

Copy the example config and create your own:

```bash
cp config/trackers.example.json config/trackers.json
```

`config/trackers.json` is gitignored — your tracker names and data stay private.

### Config format

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
        { "key": "value_b", "label": "Value B", "type": "number" },
        { "key": "notes",   "label": "Notes",   "type": "text"   }
      ]
    }
  ]
}
```

### Fields

| Field | Required | Description |
|---|---|---|
| `name` | yes | URL-safe identifier, e.g. `"my-tracker"` → `/tracker/my-tracker` |
| `label` | yes | Display name shown in the UI |
| `interval` | yes | `"monthly"` or `"daily"` |
| `available_from_day` | no | For monthly trackers: earliest day of the month to submit an entry. Omit to allow entries any time. |
| `fields` | yes | List of fields to record per entry |

### Field types

- `"number"` — renders a number input (supports decimals)
- `"text"` — renders a text input

### Accessing a tracker

Each tracker is available at `/tracker/{name}`. Links appear automatically in the top-right corner of the main page.

### Reminder

For monthly trackers, a reminder popup appears automatically on the main page once `available_from_day` is reached and no entry exists for the current month yet. The reminder links directly to the tracker page and can be dismissed.

If `available_from_day` is omitted, no reminder is shown.

### Data storage

Tracker data is saved to `data/tracker-{name}.json` and is gitignored. Back up the `data/` folder manually if needed.

---

## Mood Diary

A built-in mood diary is available at `/mood`. Log your mood on a scale from −10 to +10 with an optional note. Entries are visualized as a line chart over time.

Mood data is stored in `data/mood.json` (gitignored).
