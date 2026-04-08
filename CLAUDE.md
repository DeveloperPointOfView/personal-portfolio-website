# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build (output: dist/)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

Docker + ngrok (optional, for public URL):
```bash
cp .env.example .env   # Fill in NGROK_AUTHTOKEN
docker compose up --build
```

## Architecture

**Stack:** React 19 + Vite + Tailwind v4 (via `@tailwindcss/postcss`) + Framer Motion + React Router v7

**Routing:** Two routes only — `/` (portfolio) and `/admin` (admin panel, protected by hardcoded password `admin123` in `src/App.jsx`).

### Data Flow

All portfolio content originates from `src/data.js` (defaults) and is managed through a single source of truth:

- **`src/context/DataContext.jsx`** — central store. On mount, calls `db.loadData()` which tries Supabase → IndexedDB → localStorage (in that priority order). `normalizeData()` merges saved data with defaults, ensuring no fields are missing. `updateData()` normalizes then persists and appends to audit log. `resetData()` reverts to `src/data.js` defaults.
- **`src/services/db.js`** — persistence layer: tries remote (Supabase), falls back to IndexedDB, then localStorage.
- **`src/services/remote.js`** — wraps Supabase portfolio data reads/writes to the `portfolio_data` table (single row with `id='default'`).
- **`src/services/supabase.js`** — direct Supabase helpers for contact submissions and analytics tracking.
- **`src/context/ThemeContext.jsx`** — dark/light theme, toggled by user, controlled by admin settings under `data.theme`.

### Admin Panel

- Access at `/admin` (password: `admin123`)
- Edits call `updateData()` from `DataContext`, which normalizes, persists, and logs to audit trail.
- `src/services/audit.js` — audit log stored in localStorage; supports export and snapshots.
- Section visibility and per-section copy (eyebrow/title/subtitle) are stored under `data.sectionVisibility` and `data.sectionCopy`.

### Key Data Shape

`data.js` exports `personalData` with top-level keys: `name`, `role`, `heroTagline`, `avatar`, `about` (with `stats`), `skills`, `experience`, `certifications`, `projects`, `contact`, `cta`, `newsletterUrl`, `newsletterReasons`, `sectionVisibility`, `sectionCopy`, `theme`, `blog`, `contactForm`.

## Environment Variables

Create `.env` from `.env.example`. Supabase integration is **optional** — if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are absent, the app falls back entirely to local storage with no remote features.

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
NGROK_AUTHTOKEN=       # Only needed for Docker + ngrok
NGROK_DOMAIN=          # Optional vanity hostname
```

## Tailwind v4 Notes

Tailwind v4 is configured via `@tailwindcss/postcss` (not the classic `tailwind.config.js` plugin approach). Theme tokens and custom styles live in `src/index.css`. Component styles use Tailwind utility classes inline in JSX.
