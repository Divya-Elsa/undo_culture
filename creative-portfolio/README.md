# Undo Culture — Creative Portfolio

Marketing site for Undo Culture, a creative design agency. Built with React and Vite.

## Pages

- **Home** (`/`) — hero, scrolling client marquee, intro, featured projects, and a story teaser
- **About** (`/about`)
- **Projects** (`/projects`)
- **Project detail** (`/projects/:slug`) — dynamic, one page per project
- **Contact** (`/contact`) — inquiry form, sends via EmailJS
- **Admin** (`/admin`) — password-protected dashboard for staff to add/edit/delete portfolio projects (title, category, description, cover + gallery images) without touching code

Routing is handled with a simple `window.location.pathname` check in `src/App.jsx` (no router library, no client-side navigation — every link is a full page load).

Project content is stored in Supabase (Postgres + Storage + Auth), not hardcoded — the public pages fetch live data.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Environment variables

Copy `.env.example` to `.env.local` (gitignored, never committed) and fill in:

- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` — from your EmailJS account, used by the contact form
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — from your Supabase project settings (API tab), used by both the public site and `/admin`

These are all publishable/public-safe keys (not secrets) — real access control for writes is enforced server-side by Postgres Row Level Security, not by hiding these values. Never put a Supabase `service_role` key in this codebase.

### Supabase setup (one-time)

Run in the Supabase SQL editor:

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type text not null,
  description text not null default '',
  cover_image_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  url text not null,
  position int not null default 0
);

alter table projects enable row level security;
alter table project_images enable row level security;

create policy "public read projects" on projects for select using (true);
create policy "auth write projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read project_images" on project_images for select using (true);
create policy "auth write project_images" on project_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

Then create a public **Storage** bucket named `project-images`, and add:

```sql
create policy "authenticated can upload project images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images');

create policy "authenticated can delete project images"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images');
```

Staff logins are created manually via **Authentication → Users → Add user** in the Supabase dashboard — there's no public sign-up.

## Fonts

- **Figtree** (headings) is loaded from Google Fonts in `index.html`.
- **Mark Pro** (body text) is a licensed commercial font, not included in this repo. Place the font file(s) in `public/fonts/` locally — that folder is gitignored so the licensed font is never pushed to this public repository. Without it, body text falls back to Arial.

## Structure

```
src/
  App.jsx              # public pages/components + routing
  Admin.jsx            # /admin login + project CRUD dashboard
  App.css              # all styling
  main.jsx             # entry point
  lib/
    supabaseClient.js   # Supabase client init (reads env vars)
public/
  fonts/       # local-only licensed fonts (gitignored)
  logo.png, icons.svg, favicon.svg
```
