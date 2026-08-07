# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint via Next.js
```

No test suite is configured.

## Architecture

Single-page Next.js 14 app (App Router) deployed to Vercel. The page is a DJ presskit for the duo **ANDO**.

**Data layer — `lib/data.ts`**
All content (hero copy, photo paths, event dates, live set URLs, social links, contact info) lives in a single exported `presskitData` object. Edit this file to update any site content without touching components. There is no CMS.

`events.list[].date` is a contract, not free text: `'DD.MM.YYYY'` with leading zeros. `Events.tsx` parses it to sort, so a malformed date sorts to the end instead of failing loudly.

**Page — `src/app/page.tsx`**
Static (no `async`, no fetch, no ISR). Renders four sections in order: `Hero → Events → LiveSets → Contact`. Contact absorbs what used to be the footer.

**Components — `src/components/`**
Four standalone components, all `'use client'` with Framer Motion. They receive their slice of `presskitData` as props.

- `Hero` — background image + scrim + grain. Its text renders visible from SSR on purpose: it is the LCP element, and gating it behind a Framer entrance animation pushed LCP past 2.5 s. Parallax stays.
- `Events` — background photo (`grayscale`) + scrim; rows sorted newest-first, paginated at 5 with a "ver todas" toggle.
- `LiveSets` — flat `bg-ando-navy`; `buildEmbedUrl` handles both SoundCloud and YouTube.
- `Contact` — two columns (info + photo), stacking info-first on mobile.

**Styling**
- Tailwind with custom tokens: `ando-navy` (`#111111`), `ando-cyan` (`#00d9ff`), `ando-text`, `ando-muted`
- Fonts: `font-orbitron` (headings/default) and `font-spaceGrotesk` (body copy) — both Google Fonts loaded via `next/font`
- Grain texture overlay on Hero via `.hero-grain` CSS class in `globals.css`

**Static assets**
Photos live in `public/photos/` and are used as-is (all ≤186 KB); `next/image` serves them as avif/webp. There are no videos — `public/videos/` was deleted with the galleries. Every `<Image fill>` must carry a `sizes` prop, and only the Hero image gets `priority`.
