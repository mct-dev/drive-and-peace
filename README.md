# Drive + Peace

A private, local-first, mobile-first PWA for honest daily reflection and gentle coaching.

Drive + Peace is not a productivity tracker. It is a small mirror — helping you stay honest, track goals, notice drift, and choose one small action per day. No streaks, no badges, no gamification.

## What this is

- A personal growth diary inspired by daily 1% improvement
- Original prompts, layout, and voice — not a copy of any existing diary
- Built around presence without self-erasure: drive and peace together

## Live app

**Production:** https://mct-dev.github.io/drive-and-peace/

Deployed automatically on every push to `main` via GitHub Actions (publishes to the `gh-pages` branch).

**One-time setup:** Settings → Pages → Source: **Deploy from a branch** → `gh-pages` / `(root)`. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## How to run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Other commands

```bash
npm run build      # Production build + typecheck
npm run typecheck  # TypeScript only
npm run test       # Unit tests
npm run preview    # Preview production build
```

## How data is stored

All data lives in a single versioned JSON object in `localStorage` under the key `drive-peace-data`:

- Profile (why, vision, legacy)
- Goals and goal version history
- Daily entries
- Weekly reviews
- Coach messages

On first load, the app seeds default profile text and three active goals. Corrupted storage is reset gracefully.

## Export / import

In **Settings**:

1. **Export JSON** — downloads a full backup file
2. **Import JSON** — replaces all data after confirmation (validates format first)
3. **Reset all data** — restores defaults after confirmation

Export regularly if you care about keeping your data.

## Intentionally not included (MVP)

- Backend or cloud sync
- Authentication
- Real LLM API (coach uses local pattern matching)
- Analytics or network requests
- Paid services or external databases
- Streaks, badges, or gamification
- Complicated charts or dashboards

## Future roadmap

- Real LLM coach provider via `CoachProvider` interface
- Optional encrypted cloud backup (user-controlled)
- Richer insights without turning into a hustle tracker
- Offline PWA polish and install prompts
- Gentle reminders (local notifications only)

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Vitest for unit tests
- vite-plugin-pwa for installability

## Privacy

This MVP stores data only in your browser. No accounts, no servers, no analytics.
