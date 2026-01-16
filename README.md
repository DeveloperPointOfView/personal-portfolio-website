# Vikrant Nandan Portfolio

Personal portfolio built with React, Vite, and Tailwind CSS. Content is editable from an in-app Admin Panel and persisted to `localStorage` with an audit log for transparency.

## Features

- Admin Panel at `/admin` for editing skills, experiences, projects, and contact info.
- Section controls for visibility and copy (eyebrow/title/subtitle) per section (experience, projects, contact).
- Section controls for visibility and copy (eyebrow/title/subtitle) per section (experience, certifications, projects, contact).
- Optional LinkedIn newsletter CTA/link managed via the Admin Panel.
- Automatic years-of-experience calculation based on experience entries.
- Audit log with export and snapshot support; changes persisted locally.

## Project Structure

- `src/components`: UI components (Header, Hero, About, Experience, Certifications, Projects, Contact, Footer, AdminPanel).
- `src/context/DataContext.jsx`: Central data store, normalization, years calculation, audit logging, section visibility/copy data.
- `src/data.js`: Default content for all sections.
- `src/App.jsx`: App shell and routing.

## Getting Started

1. Install dependencies:

    ```bash
    npm install
    ```

2. Run the development server:

    ```bash
    npm run dev
    ```

3. Build for production:

    ```bash
    npm run build
    ```

4. Preview production build locally:

    ```bash
    npm run preview
    ```

## Admin Panel Usage

- Navigate to `/admin`.
- Use the Sections tab to toggle visibility or edit copy for experience, projects, and contact sections.
- Edits to experiences/projects/skills/contact are saved to `localStorage` and logged in the audit trail with timestamps and snapshot data.
- Years of experience in stats are derived automatically from experience entries; no manual edits needed.

## Development Notes

- Tailwind v4 is used via `@tailwindcss/postcss`; styles live in `src/index.css` and component-level markup.
- Existing VS Code task: "Run Dev Server" starts `npm run dev` in the background.

## Deployment

- The production build outputs to `dist/` via `npm run build`.
- Serve the `dist/` directory with any static file host (e.g., Vercel, Netlify, GitHub Pages with SPA rewrites).
- Containerized option: build and serve with Docker + nginx, and expose securely via ngrok using `docker compose` (see below).

## Docker + ngrok

1. Create your env file for ngrok:

    ```bash
    cp .env.example .env
    # Add NGROK_AUTHTOKEN=...
    ```

2. Build and start the stack (static site + ngrok tunnel):

    ```bash
    docker compose up --build
    ```

3. App is served at <http://localhost:8080>.
4. Ngrok inspector is at <http://localhost:4040>; the public URL is shown in the compose logs and on the inspector home page.

Notes

- `Dockerfile` uses a multi-stage build (Node -> nginx) with SPA-friendly routing.
- `docker-compose.yml` runs the site plus an `ngrok/ngrok` sidecar.
- To use a reserved/vanity hostname (e.g., `complexional-debra-futuristically.ngrok-free.dev`), set `NGROK_DOMAIN` in `.env` and ensure that hostname is reserved in your ngrok account. The compose command will pass `--hostname` automatically when `NGROK_DOMAIN` is set.
- Stop everything with `docker compose down`.

## Shared data (Supabase)

This app can sync Admin edits for all visitors using Supabase. The client reads/writes data to multiple tables for portfolio content, contact submissions, and analytics.

### Setup

1) **Portfolio Data Table** - Stores main portfolio content:

    ```sql
    create table portfolio_data (
      id text primary key,
      payload jsonb,
      updated_at timestamptz default now()
    );
    ```

2) **Contact Submissions Table** - Stores contact form submissions:

    ```sql
    create table contact_submissions (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      email text not null,
      message text not null,
      submitted_at timestamptz default now()
    );
    ```

3) **Analytics Table** - Tracks page views and interactions:

    ```sql
    create table analytics (
      id uuid primary key default gen_random_uuid(),
      event_type text not null,
      page text,
      data jsonb,
      user_agent text,
      timestamp timestamptz default now()
    );
    ```

4) **Enable RLS** and add policies:

    ```sql
    -- Portfolio data: allow anon to read/write default row
    alter table portfolio_data enable row level security;
    create policy "anon_rw_default_row" on portfolio_data
      for all using (id = 'default');

    -- Contact submissions: allow anon to insert, admin to read
    alter table contact_submissions enable row level security;
    create policy "anon_insert_submissions" on contact_submissions
      for insert with check (true);
    create policy "admin_read_submissions" on contact_submissions
      for select using (true);

    -- Analytics: allow anon to insert
    alter table analytics enable row level security;
    create policy "anon_insert_analytics" on analytics
      for insert with check (true);
    create policy "admin_read_analytics" on analytics
      for select using (true);
    ```

5) In `.env` set:

    ```
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    ```

6) Rebuild: `npm install` (to get `@supabase/supabase-js`), then `npm run build` or `npm run dev`.

### Behavior

- When Supabase env vars are present, portfolio data reads/writes go to Supabase first, then cache locally as fallback.
- Contact form submissions are saved to Supabase if `contactForm.saveToSupabase` is enabled in admin settings.
- Page views and project clicks are automatically tracked to the analytics table.
- If Supabase is unreachable, it falls back to the local cache (IndexedDB/localStorage) for portfolio data.

## New Features

### 🎨 Theme Toggle

- Dark/Light mode support with user toggle button in header
- Admin can enable/disable user theme switching
- Theme preference persisted in localStorage

### 📝 Blog Section

- Full blog/articles management from admin panel
- Add, edit, remove articles with rich content
- Tag filtering and article modals
- Published/draft status control
- Images and metadata support

### 📧 Contact Form with Backend

- Form submissions saved to Supabase
- View all submissions in admin panel
- Enable/disable form functionality
- Toast notifications for user feedback

### 🖼️ Project Images

- Add image URLs to projects
- Automatic image display with hover effects
- Fallback to gradient placeholder if no image

### 📊 Analytics Dashboard

- Track page views automatically
- Monitor project clicks
- View 30-day analytics in admin panel
- Supabase-powered event tracking

### ✨ Animations

- Smooth scroll behavior (admin toggleable)
- Fade-in animations on scroll using Framer Motion
- Intersection Observer for performance
- Stagger animations for lists

### 🔔 Toast Notifications

- Real-time feedback for admin actions
- Success/error/loading states
- Beautiful toast UI with react-hot-toast

### ⚙️ Admin Features Tab

- Centralized settings for all new features
- Theme and animation controls
- Blog management interface
- Contact form configuration
- Analytics dashboard
- View contact submissions

All features are fully configurable through the admin panel without code changes!

## Troubleshooting

- Clear `localStorage` in the browser to reset content to defaults.
- If the dev server port is busy, pass `--host`/`--port` flags to `npm run dev` as needed.
# personal-portfolio-website
