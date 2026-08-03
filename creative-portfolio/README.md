# Undo Culture — Creative Portfolio

Marketing site for Undo Culture, a creative design agency. Built with React and Vite.

## Pages

- **Home** (`/`) — hero, scrolling client marquee, intro, featured projects, and a story teaser
- **About** (`/about`)
- **Projects** (`/projects`)
- **Project detail** (`/project/between-buns`)
- **Contact** (`/contact`) — inquiry form

Routing is handled with a simple `window.location.pathname` check in `src/App.jsx` (no router library).

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Fonts

- **Figtree** (headings) is loaded from Google Fonts in `index.html`.
- **Mark Pro** (body text) is a licensed commercial font, not included in this repo. Place the font file(s) in `public/fonts/` locally — that folder is gitignored so the licensed font is never pushed to this public repository. Without it, body text falls back to Arial.

## Structure

```
src/
  App.jsx      # all pages/components
  App.css      # all styling
  main.jsx     # entry point
public/
  fonts/       # local-only licensed fonts (gitignored)
  logo.png, icons.svg, favicon.svg
```
