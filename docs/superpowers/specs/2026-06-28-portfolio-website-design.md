# Portfolio Website — Design Spec

**Date:** 2026-06-28
**Author:** Gino Swanepoel
**Status:** Approved (design)
**Repo:** `gl-portfolio` (new, standalone)

## Summary

A new personal portfolio website that showcases three apps — **Mythique**, **Glow**,
and **Karma Kart** — as case studies. It replaces the 2021 Create React App portfolio.
The site is **showcase-only**: the three apps keep their own repos and deployments; the
portfolio presents them with case studies and links. The build prioritizes performance,
SEO, and a few standout-but-tasteful modern web techniques.

## Goals

- Replace the outdated 2021 CRA/React 17 portfolio with a fast, modern site.
- Present three real apps as polished case studies with live-demo and GitHub links.
- Demonstrate current platform fluency through genuinely modern techniques.
- Make adding a future 4th+ project trivial (content-driven).

## Non-Goals (YAGNI)

- Not a monorepo. The three apps are **not** moved in; no shared packages.
- No CMS, no blog (RSS-ready structure only; can add later).
- No backend beyond a single live-data island and static hosting.
- No 3D beyond a single hero moment.

## Stack

| Concern        | Choice                                                          |
| -------------- | -------------------------------------------------------------- |
| Framework      | Astro 5.17 (Astro 6 upgrade path noted; runs on workerd)       |
| Interactivity  | React 19 islands (hydrated only where needed)                  |
| Styling        | Tailwind CSS v4 (Oxide engine, CSS-first `@theme` tokens)      |
| Content        | MDX Content Collections, Zod-typed frontmatter                 |
| 3D hero        | React Three Fiber (lazy, code-split, guarded)                  |
| Animation      | Native CSS scroll-driven animations + View Transitions API; Motion (React) sparingly |
| Live data      | Astro Server Island for GitHub stats                           |
| Language       | TypeScript (strict)                                            |
| Tooling        | ESLint + Prettier (mirrors the apps' conventions), Vitest      |
| Hosting        | Vercel (default URL initially; custom domain later) + Vercel Analytics |

**Why Astro over Next.js 16:** a showcase portfolio is content-heavy with pockets of
interactivity. Astro ships zero JS by default and drops in React islands exactly where
needed. Next.js's strengths (server actions, dynamic app behavior) aren't needed here and
would add JS for no benefit. Astro is also where the newest platform features are easiest
to use.

## Repository Structure

```
gl-portfolio/
├── src/
│   ├── pages/              # index.astro, projects/[slug].astro, about.astro, 404.astro
│   ├── content/
│   │   ├── projects/       # mythique.mdx, glow.mdx, karma-kart.mdx
│   │   └── config.ts       # Zod schema for project frontmatter
│   ├── components/
│   │   ├── astro/          # Nav, Footer, ProjectCard, TechBadge, SectionHeading
│   │   └── react/          # Hero3D (R3F), ThemeToggle, GitHubStats
│   ├── layouts/            # BaseLayout.astro (view transitions, meta, theme)
│   ├── styles/             # global.css (Tailwind v4 @theme tokens)
│   └── lib/                # github.ts (server island), seo.ts
├── public/                 # og images, app screenshots, resume.pdf
├── astro.config.mjs
├── package.json
└── docs/superpowers/specs/
```

## Pages & Flow

- **Home (`/`)** — 3D/WebGL hero island (name + tagline over an interactive R3F scene);
  featured-projects grid (3 cards); short intro; skills; contact CTA. Cards use
  shared-element View Transitions to morph into the case study on click.
- **Project case study (`/projects/[slug]`)** — generated from MDX: hero screenshot;
  problem/role/outcome narrative; tech-stack badge grid; screenshot gallery; CTAs for
  **Live demo** and **GitHub repo**.
- **About (`/about`)** — bio, journey, skills, resume download, socials.
- **404** — friendly fallback.
- Global nav + footer linking LinkedIn, GitHub, X, StackOverflow, email.

## Content Model

`src/content/config.ts` defines a Zod schema for the `projects` collection:

```ts
{
  title: string,
  slug: string,
  tagline: string,
  order: number,
  heroImage: string,
  gallery: string[],
  techStack: string[],      // rendered as TechBadge grid
  liveUrl: string,          // live web demo
  repoUrl: string,          // public GitHub repo
  role: string,
  year: string,
}
```

### Seed data (real, from app READMEs)

| App        | slug         | tagline                                       | techStack (badges)                                                              |
| ---------- | ------------ | --------------------------------------------- | ------------------------------------------------------------------------------ |
| Mythique   | `mythique`   | Superhero encyclopedia (iOS / Android / Web)  | Expo, expo-router 4, React Native, Reanimated 4, Supabase, TanStack Query      |
| Glow       | `glow`       | Relationship wellness app                     | React 19, Vite, Mantine v8, Supabase, OpenAI, Resend                           |
| Karma Kart | `karma-kart` | AI-powered ethical shopping assistant         | Expo SDK 55, expo-router 4, Zustand 5, Supabase, Gemini 2.5, RevenueCat, PostHog |

Each app has a live web demo and a public GitHub repo to link (`liveUrl`, `repoUrl` to be
filled with the actual URLs during implementation).

## Modern Techniques ("cool new tech")

- **React Three Fiber hero** — interactive WebGL moment. Lazy-hydrated (`client:visible`),
  code-split so it never blocks first paint. Fallback to a static gradient/poster when
  WebGL is unavailable or `prefers-reduced-motion` is set, and on small/mobile screens.
- **Native CSS scroll-driven animations** (`animation-timeline: view()`) for section
  reveals — zero main-thread JS.
- **View Transitions API** — cross-page transitions plus shared-element card → case-study
  morph.
- **Server Island `GitHubStats`** — live commits/stars across repos, cached, no rebuild
  required. Renders independently of the static page.
- **Tailwind v4** CSS-first `@theme` tokens; dark/light **ThemeToggle** as a tiny island.

## Error Handling

- `GitHubStats` server island fails gracefully: falls back to cached/last-known values or
  a static placeholder — never breaks the page.
- 3D hero guarded by WebGL-availability and `prefers-reduced-motion` checks, with a
  poster fallback.
- Missing/invalid MDX frontmatter fails the build (Zod schema) so content errors are
  caught before deploy.

## Testing

- Vitest unit tests for islands with logic: `GitHubStats` fetch/fallback, `Hero3D`
  capability-detection/fallback, `ThemeToggle` state.
- Astro content schema validation acts as a content-level test at build time.
- Manual Lighthouse pass targeting 95–100 on content pages.

## Personal Details (carried from 2021 site)

- **Name:** Gino Swanepoel (aka Gino Lee / MrGinoLee)
- **Email:** ginoleemusic@live.com
- **GitHub:** https://github.com/ginoleeswan
- **LinkedIn:** https://www.linkedin.com/in/ginoswanepoel/
- **X/Twitter:** https://twitter.com/MrGinoLee
- **StackOverflow:** https://stackoverflow.com/users/16642242/gino-swanepoel

## Deployment

- Vercel, default URL initially; custom domain added later.
- Vercel Analytics enabled.
- SEO: per-page meta, OG images, sitemap, RSS-ready structure.

## Open Items (resolve during implementation)

- Collect the actual `liveUrl` and `repoUrl` for each app.
- Gather/optimize screenshots for hero + galleries.
- Decide the specific 3D hero concept/visual.
- Confirm resume PDF to include.
