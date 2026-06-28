# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, modern, showcase-only portfolio site presenting three apps (Mythique, Glow, Karma Kart) as case studies.

**Architecture:** Statically-generated Astro site, zero-JS by default, with React 19 islands hydrated only where interactivity is needed. Project case studies live as MDX content collections. One live-data Server Island (GitHub stats). A React Three Fiber hero is the single 3D moment, lazily hydrated with a guarded fallback.

**Tech Stack:** Astro 7 (latest stable; scaffolded by `create-astro`), React 19, Tailwind CSS v4 (Vite plugin, CSS-first `@theme`), MDX content collections (glob loader), React Three Fiber, TypeScript (strict), Vitest, ESLint + Prettier, Vercel adapter + Analytics.

> **Astro 7 API notes (apply throughout):** content collections use a `glob()` loader and live in `src/content.config.ts`; render entries with `render(entry)` from `astro:content` (not `entry.render()`); view transitions use `<ClientRouter />` from `astro:transitions`. Tasks 4 and 10 carry inline reminders.

## Global Constraints

- TypeScript `strict: true` everywhere.
- Tailwind v4 via `@tailwindcss/vite` plugin — NOT the deprecated `@astrojs/tailwind` integration. Design tokens live in CSS under `@theme`, not a `tailwind.config.js`.
- React islands hydrate only with explicit `client:*` directives; default to static.
- Every island with branching logic gets a Vitest unit test (TDD).
- Email used on the site: `ginoleemusic@live.com`.
- Social links: GitHub `https://github.com/ginoleeswan`, LinkedIn `https://www.linkedin.com/in/ginoswanepoel/`, X `https://twitter.com/MrGinoLee`, StackOverflow `https://stackoverflow.com/users/16642242/gino-swanepoel`.
- Name displayed: "Gino Swanepoel".
- Commit after every task. Work on `main` (fresh repo).
- Hero3D and GitHubStats must degrade gracefully and never break page render.

---

### Task 1: Scaffold Astro project and tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `vitest.config.ts`, `.prettierrc.json`, `eslint.config.js`
- Note: repo and `.gitignore` already exist at project root.

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build`; React, Vercel adapter, Tailwind v4, Vitest, ESLint, Prettier all wired. `src/styles/global.css` exports Tailwind layer + `@theme` token block consumed by all later UI tasks.

- [ ] **Step 1: Scaffold Astro into the existing repo dir**

Run from `gl-portfolio/`:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
```
Expected: project files created in the current directory (do not overwrite `.git` / `docs/`).

- [ ] **Step 2: Add integrations**

```bash
npx astro add react --yes
npx astro add vercel --yes
npx astro add mdx --yes
npx astro add tailwind --yes
```
Expected: `@astrojs/react`, `@astrojs/vercel`, `@astrojs/mdx`, `@tailwindcss/vite` installed; `astro.config.mjs` updated with the React + MDX integrations, Vercel adapter, and the Tailwind Vite plugin.

- [ ] **Step 3: Add dev tooling**

```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom \
  eslint prettier prettier-plugin-astro eslint-plugin-astro typescript-eslint
```

- [ ] **Step 4: Create `src/styles/global.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: oklch(0.16 0.02 265);
  --color-fg: oklch(0.97 0.01 265);
  --color-accent: oklch(0.72 0.17 305);
  --color-muted: oklch(0.65 0.02 265);
  --font-display: "Sora", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
}

:root { color-scheme: dark; }
html { scroll-behavior: smooth; }
body { background: var(--color-bg); color: var(--color-fg); font-family: var(--font-body); }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});
```
Also create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
Install the React Vite plugin used only by Vitest:
```bash
npm i -D @vitejs/plugin-react
```

- [ ] **Step 6: Add scripts to `package.json`**

Ensure the `scripts` block contains:
```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "typecheck": "astro check && tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "lint": "eslint .",
  "format": "prettier --write \"src/**/*.{ts,tsx,astro,css,md,mdx,json}\""
}
```
Add `.prettierrc.json`:
```json
{ "plugins": ["prettier-plugin-astro"], "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }] }
```

- [ ] **Step 7: Verify build and dev server**

Run:
```bash
npm run build
```
Expected: build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + React + Tailwind v4 + Vitest tooling"
```

---

### Task 2: Base layout, theme tokens, view transitions

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/lib/seo.ts`
- Modify: `src/styles/global.css` (add scroll-driven reveal utility)

**Interfaces:**
- Produces: `BaseLayout` Astro component with props `{ title: string; description: string; image?: string }`; imports `global.css`; enables `<ClientRouter />` (view transitions). `seo.ts` exports `buildMeta(opts)` returning `{ title, description, ogImage }`. Consumed by every page.

- [ ] **Step 1: Create `src/lib/seo.ts`**

```ts
const SITE = "Gino Swanepoel";
const DEFAULT_DESC = "Developer & app maker. Showcasing Mythique, Glow, and Karma Kart.";

export function buildMeta(opts: { title?: string; description?: string; image?: string }) {
  return {
    title: opts.title ? `${opts.title} — ${SITE}` : SITE,
    description: opts.description ?? DEFAULT_DESC,
    ogImage: opts.image ?? "/og/default.png",
  };
}
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import { ClientRouter } from "astro:transitions";
import "../styles/global.css";
import { buildMeta } from "../lib/seo";
const { title, description, image } = Astro.props;
const meta = buildMeta({ title, description, image });
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:image" content={meta.ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Add scroll-driven reveal utility to `global.css`**

Append:
```css
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal {
  animation: reveal-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
@media (prefers-reduced-motion: reduce) { .reveal { animation: none; opacity: 1; } }
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: base layout with view transitions, SEO meta, scroll-reveal utility"
```

---

### Task 3: Navigation and footer

**Files:**
- Create: `src/components/astro/Nav.astro`, `src/components/astro/Footer.astro`, `src/lib/social.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `Nav` and `Footer` Astro components (no props). `social.ts` exports `SOCIALS: { label: string; href: string }[]` and `EMAIL` constant, consumed by Footer and Contact CTA.

- [ ] **Step 1: Create `src/lib/social.ts`**

```ts
export const EMAIL = "ginoleemusic@live.com";
export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/ginoleeswan" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ginoswanepoel/" },
  { label: "X", href: "https://twitter.com/MrGinoLee" },
  { label: "StackOverflow", href: "https://stackoverflow.com/users/16642242/gino-swanepoel" },
];
```

- [ ] **Step 2: Create `src/components/astro/Nav.astro`**

```astro
---
const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];
---
<nav class="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur">
  <a href="/" class="font-[var(--font-display)] text-lg font-bold">Gino Swanepoel</a>
  <ul class="flex gap-6 text-sm">
    {links.map((l) => <li><a href={l.href} class="hover:text-[var(--color-accent)]">{l.label}</a></li>)}
  </ul>
</nav>
```

- [ ] **Step 3: Create `src/components/astro/Footer.astro`**

```astro
---
import { SOCIALS, EMAIL } from "../../lib/social";
---
<footer class="mt-32 border-t border-white/10 px-6 py-12 text-sm text-[var(--color-muted)]">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <span>© {new Date().getFullYear()} Gino Swanepoel</span>
    <ul class="flex gap-5">
      {SOCIALS.map((s) => <li><a href={s.href} target="_blank" rel="noopener" class="hover:text-[var(--color-accent)]">{s.label}</a></li>)}
      <li><a href={`mailto:${EMAIL}`} class="hover:text-[var(--color-accent)]">Email</a></li>
    </ul>
  </div>
</footer>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: nav and footer with social links"
```

---

### Task 4: Project content collection + seed MDX

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/mythique.mdx`, `src/content/projects/glow.mdx`, `src/content/projects/karma-kart.mdx`

**Interfaces:**
- Produces: a `projects` collection with this exact schema, consumed by Tasks 5–7:
```ts
{ title: string; slug: string; tagline: string; order: number; year: string; role: string;
  heroImage: string; gallery: string[]; techStack: string[]; liveUrl: string; repoUrl: string }
```

> ASTRO 7 NOTE: This project runs Astro 7. Content collections REQUIRE a `loader`
> (the legacy `type: "content"` API is removed). The config file lives at
> `src/content.config.ts` (NOT `src/content/config.ts`). Entries are keyed by `id`
> (derived from filename), but each file also carries an explicit `slug` frontmatter
> field that later tasks use via `project.data.slug`.

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    order: z.number(),
    year: z.string(),
    role: z.string(),
    heroImage: z.string(),
    gallery: z.array(z.string()).default([]),
    techStack: z.array(z.string()),
    liveUrl: z.string().url(),
    repoUrl: z.string().url(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Create `src/content/projects/mythique.mdx`**

```mdx
---
title: Mythique
slug: mythique
tagline: Superhero encyclopedia for iOS, Android, and Web
order: 1
year: "2025"
role: Solo developer
heroImage: /projects/mythique/hero.png
gallery: []
techStack: ["Expo", "expo-router 4", "React Native", "Reanimated 4", "Supabase", "TanStack Query"]
liveUrl: "https://example.com/mythique"
repoUrl: "https://github.com/ginoleeswan/mythique"
---

## The problem
Fans wanted a single, beautiful place to explore superhero lore across universes.

## What I built
A cross-platform encyclopedia with file-based navigation, fluid Reanimated transitions,
and a Supabase backend, sourcing data from SuperheroAPI and ComicVine.

## Outcome
One codebase shipping to iOS, Android, and Web from Expo.
```

> NOTE: replace `liveUrl`/`repoUrl` with the real URLs and add real screenshots before deploy (see plan "Open Items").

- [ ] **Step 3: Create `src/content/projects/glow.mdx`**

```mdx
---
title: Glow
slug: glow
tagline: Relationship wellness app that turns intention into action
order: 2
year: "2025"
role: Solo developer
heroImage: /projects/glow/hero.png
gallery: []
techStack: ["React 19", "Vite", "Mantine v8", "Supabase", "OpenAI", "Resend"]
liveUrl: "https://example.com/glow"
repoUrl: "https://github.com/ginoleeswan/glow"
---

## The problem
People care, but scattered intentions rarely become meaningful action.

## What I built
A web app that bundles AI-personalized messages, smart gift suggestions, and memory cues
into a single unit of care — built on React 19, Mantine v8, and Supabase with RLS.

## Outcome
A polished, real-time relationship wellness experience with AI-generated thoughtfulness.
```

- [ ] **Step 4: Create `src/content/projects/karma-kart.mdx`**

```mdx
---
title: Karma Kart
slug: karma-kart
tagline: AI-powered ethical shopping assistant
order: 3
year: "2025"
role: Solo developer
heroImage: /projects/karma-kart/hero.png
gallery: []
techStack: ["Expo SDK 55", "expo-router 4", "Zustand 5", "Supabase", "Gemini 2.5", "RevenueCat", "PostHog"]
liveUrl: "https://example.com/karma-kart"
repoUrl: "https://github.com/ginoleeswan/karma-kart"
---

## The problem
Shoppers want to align purchases with their values but lack the data at point of sale.

## What I built
A barcode-scanning app that computes a personalized Karma Score for a product's parent
company across eight values, enriched by Gemini 2.5 and Open Food Facts data.

## Outcome
Conscience-driven shopping on iOS, Android, and Web, monetized with RevenueCat.
```

- [ ] **Step 5: Verify schema validates**

Run: `npm run build`
Expected: build succeeds (Zod schema accepts all three files). If a URL field fails, that's the expected guardrail — fix the frontmatter. (With the glob loader, Astro generates each entry's `id` from the filename, e.g. `mythique`.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: projects content collection with seeded case studies"
```

---

### Task 5: ProjectCard and TechBadge components

**Files:**
- Create: `src/components/astro/TechBadge.astro`, `src/components/astro/ProjectCard.astro`

**Interfaces:**
- Consumes: a project entry from the `projects` collection (Task 4).
- Produces: `TechBadge` (props `{ name: string }`); `ProjectCard` (props `{ project }` where `project` is a `CollectionEntry<"projects">`). `ProjectCard` sets `style={`view-transition-name: card-${slug}`}` on its root for shared-element transitions (Task 7).

- [ ] **Step 1: Create `src/components/astro/TechBadge.astro`**

```astro
---
const { name } = Astro.props;
---
<span class="rounded-full border border-white/15 px-3 py-1 text-xs text-[var(--color-muted)]">{name}</span>
```

- [ ] **Step 2: Create `src/components/astro/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from "astro:content";
import TechBadge from "./TechBadge.astro";
const { project } = Astro.props as { project: CollectionEntry<"projects"> };
const { title, tagline, slug, techStack } = project.data;
---
<a
  href={`/projects/${slug}`}
  class="reveal group block rounded-2xl border border-white/10 p-6 transition hover:border-[var(--color-accent)]"
  style={`view-transition-name: card-${slug}`}
>
  <h3 class="font-[var(--font-display)] text-2xl font-bold">{title}</h3>
  <p class="mt-2 text-[var(--color-muted)]">{tagline}</p>
  <div class="mt-4 flex flex-wrap gap-2">
    {techStack.slice(0, 4).map((t) => <TechBadge name={t} />)}
  </div>
</a>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: ProjectCard and TechBadge components"
```

---

### Task 6: ThemeToggle island (TDD)

**Files:**
- Create: `src/components/react/ThemeToggle.tsx`, `src/components/react/ThemeToggle.test.tsx`

**Interfaces:**
- Produces: default-exported `ThemeToggle` React component. Exports pure helper `nextTheme(current: "dark" | "light"): "dark" | "light"`. Reads/writes `document.documentElement.dataset.theme` and `localStorage["theme"]`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle, { nextTheme } from "./ThemeToggle";

test("nextTheme flips the value", () => {
  expect(nextTheme("dark")).toBe("light");
  expect(nextTheme("light")).toBe("dark");
});

test("clicking toggles the documentElement theme", () => {
  document.documentElement.dataset.theme = "dark";
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole("button"));
  expect(document.documentElement.dataset.theme).toBe("light");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/react/ThemeToggle.test.tsx`
Expected: FAIL — module not found / `ThemeToggle` undefined.

- [ ] **Step 3: Write minimal implementation**

```tsx
import { useState } from "react";

export function nextTheme(current: "dark" | "light"): "dark" | "light" {
  return current === "dark" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (typeof document !== "undefined" && (document.documentElement.dataset.theme as "dark" | "light")) || "dark",
  );
  function toggle() {
    const t = nextTheme(theme);
    setTheme(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch {}
  }
  return (
    <button aria-label="Toggle theme" onClick={toggle} class="rounded-full border border-white/15 px-3 py-1 text-xs">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
```
> Note: in `.tsx` use `className`, not `class`. Replace `class=` with `className=` above.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/react/ThemeToggle.test.tsx`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: ThemeToggle island with tested toggle logic"
```

---

### Task 7: GitHubStats server island (TDD)

**Files:**
- Create: `src/lib/github.ts`, `src/lib/github.test.ts`, `src/components/react/GitHubStats.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `fetchGitHubStats(user: string, fetchImpl?: typeof fetch): Promise<{ publicRepos: number; followers: number } | null>` (returns `null` on any failure). `GitHubStats` React component rendered as a server island via `server:defer` in pages.

- [ ] **Step 1: Write the failing test**

```ts
import { fetchGitHubStats } from "./github";

test("returns parsed stats on success", async () => {
  const fakeFetch = (async () =>
    ({ ok: true, json: async () => ({ public_repos: 12, followers: 5 }) })) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toEqual({ publicRepos: 12, followers: 5 });
});

test("returns null on non-ok response", async () => {
  const fakeFetch = (async () => ({ ok: false })) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toBeNull();
});

test("returns null when fetch throws", async () => {
  const fakeFetch = (async () => { throw new Error("network"); }) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/github.test.ts`
Expected: FAIL — `fetchGitHubStats` not defined.

- [ ] **Step 3: Write minimal implementation**

```ts
export async function fetchGitHubStats(user: string, fetchImpl: typeof fetch = fetch) {
  try {
    const res = await fetchImpl(`https://api.github.com/users/${user}`);
    if (!res.ok) return null;
    const data = await res.json();
    return { publicRepos: data.public_repos as number, followers: data.followers as number };
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/github.test.ts`
Expected: PASS (all three tests).

- [ ] **Step 5: Create the island component**

```tsx
import { useEffect, useState } from "react";
import { fetchGitHubStats } from "../../lib/github";

export default function GitHubStats({ user = "ginoleeswan" }: { user?: string }) {
  const [stats, setStats] = useState<{ publicRepos: number; followers: number } | null>(null);
  useEffect(() => { fetchGitHubStats(user).then(setStats); }, [user]);
  if (!stats) return <span className="text-[var(--color-muted)]">GitHub: @{user}</span>;
  return (
    <span className="text-[var(--color-muted)]">
      {stats.publicRepos} public repos · {stats.followers} followers
    </span>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: GitHubStats island with tested fetch + null fallback"
```

---

### Task 8: Hero3D island with guarded fallback (TDD)

**Files:**
- Create: `src/lib/capabilities.ts`, `src/lib/capabilities.test.ts`, `src/components/react/Hero3D.tsx`
- Install: `three`, `@react-three/fiber`, `@react-three/drei`

**Interfaces:**
- Produces: `shouldRender3D(opts: { webgl: boolean; reducedMotion: boolean; width: number }): boolean` — true only when `webgl && !reducedMotion && width >= 768`. `Hero3D` default export renders the R3F canvas when capable, else a static poster `<div>`.

- [ ] **Step 1: Install 3D deps**

```bash
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

- [ ] **Step 2: Write the failing test**

```ts
import { shouldRender3D } from "./capabilities";

test("renders 3D only when capable, motion allowed, and wide enough", () => {
  expect(shouldRender3D({ webgl: true, reducedMotion: false, width: 1200 })).toBe(true);
  expect(shouldRender3D({ webgl: false, reducedMotion: false, width: 1200 })).toBe(false);
  expect(shouldRender3D({ webgl: true, reducedMotion: true, width: 1200 })).toBe(false);
  expect(shouldRender3D({ webgl: true, reducedMotion: false, width: 500 })).toBe(false);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/capabilities.test.ts`
Expected: FAIL — `shouldRender3D` not defined.

- [ ] **Step 4: Write minimal implementation**

```ts
export function shouldRender3D(opts: { webgl: boolean; reducedMotion: boolean; width: number }): boolean {
  return opts.webgl && !opts.reducedMotion && opts.width >= 768;
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/capabilities.test.ts`
Expected: PASS.

- [ ] **Step 6: Create `Hero3D.tsx`**

```tsx
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { shouldRender3D, detectWebGL } from "../../lib/capabilities";

function Scene() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#b06fff" roughness={0.2} metalness={0.6} />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  const [render3D, setRender3D] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRender3D(shouldRender3D({ webgl: detectWebGL(), reducedMotion, width: window.innerWidth }));
  }, []);

  if (!render3D) {
    return <div className="h-[420px] w-full rounded-3xl bg-gradient-to-br from-[var(--color-accent)] to-transparent opacity-40" aria-hidden="true" />;
  }
  return (
    <div className="h-[420px] w-full">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Scene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 7: Verify tests pass and build succeeds**

Run: `npm run test && npm run build`
Expected: all tests PASS; build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: Hero3D island with tested capability-gated fallback"
```

---

### Task 9: Home page

**Files:**
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2), `Nav`/`Footer` (Task 3), `ProjectCard` (Task 5), `ThemeToggle` (Task 6), `GitHubStats` (Task 7), `Hero3D` (Task 8), `projects` collection (Task 4), `SOCIALS`/`EMAIL` (Task 3).
- Produces: the `/` route.

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import Nav from "../components/astro/Nav.astro";
import Footer from "../components/astro/Footer.astro";
import ProjectCard from "../components/astro/ProjectCard.astro";
import Hero3D from "../components/react/Hero3D.tsx";
import GitHubStats from "../components/react/GitHubStats.tsx";
import ThemeToggle from "../components/react/ThemeToggle.tsx";
import { EMAIL } from "../lib/social";

const projects = (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="" description="Developer & app maker.">
  <Nav />
  <main class="mx-auto max-w-5xl px-6">
    <section class="grid items-center gap-8 py-16 md:grid-cols-2">
      <div>
        <h1 class="font-[var(--font-display)] text-5xl font-extrabold leading-tight">Gino Swanepoel</h1>
        <p class="mt-4 text-lg text-[var(--color-muted)]">I design and build cross-platform apps. Here are three of them.</p>
        <div class="mt-6 flex items-center gap-4">
          <a href="#work" class="rounded-full bg-[var(--color-accent)] px-5 py-2 font-medium text-black">See my work</a>
          <ThemeToggle client:idle />
        </div>
        <p class="mt-4 text-sm"><GitHubStats client:visible server:defer /></p>
      </div>
      <Hero3D client:visible />
    </section>

    <section id="work" class="py-16">
      <h2 class="reveal mb-8 font-[var(--font-display)] text-3xl font-bold">Selected work</h2>
      <div class="grid gap-6 md:grid-cols-3">
        {projects.map((project) => <ProjectCard project={project} />)}
      </div>
    </section>

    <section id="contact" class="reveal py-16">
      <h2 class="font-[var(--font-display)] text-3xl font-bold">Let's talk</h2>
      <p class="mt-3 text-[var(--color-muted)]">Have an idea or a role in mind?</p>
      <a href={`mailto:${EMAIL}`} class="mt-4 inline-block rounded-full border border-[var(--color-accent)] px-5 py-2">{EMAIL}</a>
    </section>
  </main>
  <Footer />
</BaseLayout>
```
> Note: `server:defer` makes `GitHubStats` a server island; `client:visible` hydrates it for the `useEffect` fetch. If the combination errors during build, drop `server:defer` and keep `client:visible` (client-only island) — the fallback still applies.

- [ ] **Step 2: Verify build and visually check**

Run: `npm run build && npm run preview`
Expected: build succeeds; `/` renders hero, three project cards, contact section.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: home page with hero, work grid, contact"
```

---

### Task 10: Project case study route

**Files:**
- Create: `src/pages/projects/[slug].astro`

**Interfaces:**
- Consumes: `projects` collection (Task 4), `BaseLayout`, `Nav`, `Footer`, `TechBadge`.
- Produces: `/projects/<slug>` static routes via `getStaticPaths`. The hero element sets `view-transition-name: card-${slug}` to match `ProjectCard` for the shared-element morph.

- [ ] **Step 1: Create `src/pages/projects/[slug].astro`**

> ASTRO 7 NOTE: render via `render(project)` imported from `astro:content` —
> the `project.render()` method is removed in Astro 6+.

```astro
---
import { getCollection, render, type CollectionEntry } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import Nav from "../../components/astro/Nav.astro";
import Footer from "../../components/astro/Footer.astro";
import TechBadge from "../../components/astro/TechBadge.astro";

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((project) => ({ params: { slug: project.data.slug }, props: { project } }));
}

const { project } = Astro.props as { project: CollectionEntry<"projects"> };
const { title, tagline, techStack, liveUrl, repoUrl, slug, role, year } = project.data;
const { Content } = await render(project);
---
<BaseLayout title={title} description={tagline}>
  <Nav />
  <main class="mx-auto max-w-3xl px-6 py-16">
    <header style={`view-transition-name: card-${slug}`} class="rounded-2xl border border-white/10 p-8">
      <p class="text-sm text-[var(--color-muted)]">{year} · {role}</p>
      <h1 class="mt-2 font-[var(--font-display)] text-4xl font-extrabold">{title}</h1>
      <p class="mt-3 text-lg text-[var(--color-muted)]">{tagline}</p>
      <div class="mt-5 flex flex-wrap gap-2">{techStack.map((t) => <TechBadge name={t} />)}</div>
      <div class="mt-6 flex gap-4">
        <a href={liveUrl} target="_blank" rel="noopener" class="rounded-full bg-[var(--color-accent)] px-5 py-2 text-black">Live demo</a>
        <a href={repoUrl} target="_blank" rel="noopener" class="rounded-full border border-white/15 px-5 py-2">GitHub</a>
      </div>
    </header>
    <article class="prose prose-invert mt-10 max-w-none"><Content /></article>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verify build generates all three routes**

Run: `npm run build`
Expected: build output lists `/projects/mythique`, `/projects/glow`, `/projects/karma-kart`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: project case study route with shared-element transition"
```

---

### Task 11: About page and 404

**Files:**
- Create: `src/pages/about.astro`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `Nav`, `Footer`, `SOCIALS` (Task 3).

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Nav from "../components/astro/Nav.astro";
import Footer from "../components/astro/Footer.astro";
import { SOCIALS } from "../lib/social";
---
<BaseLayout title="About" description="About Gino Swanepoel.">
  <Nav />
  <main class="mx-auto max-w-2xl px-6 py-16">
    <h1 class="font-[var(--font-display)] text-4xl font-extrabold">About</h1>
    <p class="mt-6 text-[var(--color-muted)]">
      I'm Gino Swanepoel — a developer who designs and ships cross-platform apps end to end,
      from React Three Fiber interfaces to Supabase backends.
    </p>
    <h2 class="mt-10 text-xl font-bold">Find me</h2>
    <ul class="mt-3 flex flex-wrap gap-4">
      {SOCIALS.map((s) => <li><a href={s.href} target="_blank" rel="noopener" class="underline hover:text-[var(--color-accent)]">{s.label}</a></li>)}
    </ul>
    <a href="/resume.pdf" class="mt-8 inline-block rounded-full border border-white/15 px-5 py-2">Download résumé</a>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Nav from "../components/astro/Nav.astro";
---
<BaseLayout title="Not found" description="Page not found.">
  <Nav />
  <main class="mx-auto max-w-2xl px-6 py-32 text-center">
    <h1 class="font-[var(--font-display)] text-6xl font-extrabold">404</h1>
    <p class="mt-4 text-[var(--color-muted)]">That page wandered off.</p>
    <a href="/" class="mt-6 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2 text-black">Go home</a>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds; `/about` and 404 produced.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: about and 404 pages"
```

---

### Task 12: Sitemap, fonts, final verification, deploy config

**Files:**
- Modify: `astro.config.mjs` (add `site`, `@astrojs/sitemap`), `src/layouts/BaseLayout.astro` (font preconnect + Analytics)
- Create: none beyond integration

**Interfaces:**
- Produces: production-ready build with sitemap, fonts, Vercel adapter + Analytics.

- [ ] **Step 1: Add sitemap + fonts**

```bash
npx astro add sitemap --yes
```
In `astro.config.mjs`, set `site: "https://gl-portfolio.vercel.app"` (update when the custom domain is chosen).
In `BaseLayout.astro` `<head>`, add Google Fonts for Sora + Inter:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Sora:wght@600;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Add Vercel Analytics**

```bash
npm i @vercel/analytics
```
Create `src/components/react/Analytics.tsx`:
```tsx
import { Analytics } from "@vercel/analytics/react";
export default function VercelAnalytics() { return <Analytics />; }
```
Render `<VercelAnalytics client:idle />` once in `BaseLayout.astro` before `</body>`.

- [ ] **Step 3: Full verification**

Run:
```bash
npm run typecheck && npm run test && npm run build
```
Expected: typecheck clean, all tests PASS, build succeeds with sitemap + all routes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: sitemap, fonts, Vercel analytics; production build verified"
```

- [ ] **Step 5: Deploy (manual, when ready)**

Create a GitHub repo and push, then import into Vercel (framework auto-detected as Astro). No env vars required. Confirm the deployed URL renders all routes and Lighthouse ≥ 95 on `/`.

---

## Open Items (pre-deploy, not blocking the build)

- Replace placeholder `liveUrl`/`repoUrl` in the three MDX files with real URLs.
- Add real hero/gallery screenshots under `public/projects/<slug>/` and populate `gallery`.
- Add `public/resume.pdf` (or remove the résumé link).
- Finalize the 3D hero concept/visual in `Hero3D.tsx`.
- Set the real `site` URL / custom domain in `astro.config.mjs`.

## Self-Review Notes

- **Spec coverage:** stack (T1), base layout + view transitions (T2), nav/footer/socials (T3), content model + seed (T4), cards/badges (T5), theme toggle (T6), GitHub server island (T7), 3D hero + fallback (T8), home (T9), case studies + shared-element morph (T10), about/404 (T11), SEO/sitemap/fonts/analytics/deploy (T12). All spec sections mapped.
- **Scroll-driven animations:** delivered via `.reveal` utility (T2) applied across pages.
- **Error handling:** GitHubStats null fallback (T7), Hero3D capability gate (T8), Zod schema guard (T4) — all tested or build-enforced.
