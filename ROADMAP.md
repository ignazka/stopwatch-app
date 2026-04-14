# Stopwatch App – Roadmap & Projektidee

## Hintergrund

Aus dem Shell-Scripting-Projekt (`stopwatch/`) soll eine vollständige App entstehen
mit Dashboard, iPhone-Support und später Apple Watch.

## Stack & Voraussetzungen

- **Vorhandenes Wissen:** TypeScript, React, Next.js, PostgreSQL
- **Datenbasis:** JSON-Logs aus dem Bash-Stopwatch-Script
- **Ziel:** Daten nutzbar machen – visualisieren, von unterwegs bedienen

---

## Architektur

```
Bash Script (Mac)
  └── sessions.json  ←→  Next.js App (API Routes lesen/schreiben JSON)
                              ├── Dashboard (Statistiken, Charts)
                              └── PWA → iPhone Home Screen

Apple Watch  ←  (Stufe 4, nativ Swift oder Expo)
```

---

## Stufenplan

### Stufe 1 – Next.js Dashboard (sofort machbar)

- Neues Repo: `stopwatch-app`
- Next.js + TypeScript + Tailwind
- `sessions.json` einlesen und anzeigen
- Statistiken: Gesamtzeit pro Tag/Woche, häufigste Tags, längste Sessions
- Charts z.B. mit `recharts` oder `chart.js`

### Stufe 2 – PWA auf iPhone

- `manifest.json` + Service Worker zu Next.js hinzufügen
- App auf iPhone Home Screen installierbar
- Timer starten/stoppen über das Web-Interface
- Kein App Store, kein Developer Account nötig

### Stufe 3 – Datensync Mac ↔ App (optional)

- Optionen: iCloud Drive (JSON liegt in iCloud-Ordner), lokales Netzwerk, oder
  kleines Backend (z.B. SQLite statt JSON, Postgres später)
- Solange nur Lesen gebraucht wird: JSON aus iCloud Drive reicht

### Stufe 4 – Apple Watch / Native App (eigenes Lernprojekt)

- Optionen:
  - **Expo / React Native** – nutzt vorhandenes React-Wissen, Watch-Support begrenzt
  - **Swift / SwiftUI + watchOS** – nativ, voller Watch-Support, neue Sprache
- Xcode nötig, kostenloses Apple-ID-Deployment reicht für persönliche Nutzung
  (App läuft 7 Tage, dann 30-Sekunden-Redeploy in Xcode)
- Developer Account (99 USD/Jahr) nur nötig für App Store oder iCloud-Sync

---

## Offene Entscheidungen

- [ ] JSON-Daten direkt nutzen oder Migration zu SQLite/Postgres?
- [ ] Expo oder Swift für Watch?
- [ ] iCloud Drive als Sync-Lösung ausreichend?

---

## Nächster Schritt

Neues GitHub-Repo `stopwatch-app` erstellen, dann:

```
npx create-next-app@latest stopwatch-app --typescript --tailwind --app
```
