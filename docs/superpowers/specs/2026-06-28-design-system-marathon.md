# Design System — Marathon Brutalist

**Date:** 2026-06-28
**Status:** Approved (direction locked with user)
**Applies to:** gl-portfolio (re-skin of the completed structural build, Tasks 1–12)
**Explorations:** `docs/design-explorations/` (dir4-marathon = hero, dir5-duotone-posters = work)

## Concept

"Graphic Realism" in the spirit of Bungie's Marathon (2025) + The Designers Republic +
acid screenprint posters. A stark monochrome technical frame (void/acid/bone) that
explodes into saturated duotone at each project. Aggressively labeled, utilitarian,
high-contrast, textured. Committed to dark; no light mode.

Intensity: **bold but controlled** — visible grain + halftone, acid does the heavy
lifting, vermilion used surgically (CTAs, live/alert states).

## Tokens (global.css `@theme`)

```css
--color-void:   #0a0b0a;  /* page background */
--color-panel:  #121410;  /* raised blocks */
--color-bone:   #e9e7dd;  /* primary text / light fills */
--color-acid:   #c6f53f;  /* signature accent */
--color-flare:  #ff4a1c;  /* surgical accent: CTAs, live, alerts */
--color-steel:  #7f857a;  /* muted mono labels */
--color-line:   #2a2d26;  /* hairline rules */
/* per-project duotone */
--color-myth:   #1b4dff;  /* Mythique — electric blue */
--color-glow:   #ff2d87;  /* Glow — hot magenta */
--color-karma:  #c6f53f;  /* Karma Kart — acid (text in void) */
```

Each project entry carries an `accent` field (myth/glow/karma) driving its poster +
dossier theming. Add `accent` to the content collection schema.

## Type

| Role | Face | Usage |
|------|------|-------|
| Display | **Anton** (400) | giant wordmarks, project names, big statements (condensed, uppercase) |
| Sub / nav | **Archivo** (700–900) | nav, brand, sub-headers, tags |
| Utility / body | **Space Mono** (400/700) | all technical chrome, labels, coordinates, captions, body copy |

Load via Google Fonts; replace the current Sora/Inter links. Type scale anchored on
big condensed display (clamp ~64–120px) vs small mono (11–13px) — the contrast is the
signature. Tracking: mono labels `.12–.16em` uppercase.

## Signature system ("technical chrome")

- Registration crosshairs in the four viewport corners (acid).
- Annotation strip: `(N°00x)`, `// SECTION`, `REV 2026.06`, coordinates `40.7440°N 73.9873°W`, ID codes, status `● SYSTEM ONLINE`.
- Katakana per project (ミスティク / グロウ / カルマ), binary columns, barcode blocks.
- Riso grain overlay (SVG feTurbulence, fixed, low opacity, overlay blend).
- Halftone dot texture (radial-gradient dots, masked) on imagery panels.
- Hairline acid rules; mostly zero border-radius.

## Components (re-skin existing)

- **BaseLayout** — void bg, fixed grain overlay, corner crosshairs, fonts. Drop the
  light/dark theming (remove ThemeToggle usage; retire the island or hide it).
- **Nav** — mono uppercase, acid active item, brand in Archivo 900.
- **Footer** — mono, coordinates + IDs + socials + email; barcode motif.
- **TechBadge** — acid-outline mono pill (current shape, new styling).
- **ProjectCard → Specimen Poster** — full duotone card per `accent`: halftone, grain,
  katakana, binary, ID/platform chrome, Anton name, "OPEN DOSSIER ↗", view-transition
  name `card-${slug}` (already present, keep).
- **Hero** — dithered duotone **photo of Gino** (user-supplied, processed to halftone)
  + the re-skinned **Hero3D** island (dithered/wireframe object, acid-on-void) as the
  wow centerpiece, beside the Anton wordmark "BUILT TO BE SHIPPED." and chrome.
- **GitHubStats** — render as a mono live readout `● 12 REPOS · 5 FOLLOWERS` (logic
  unchanged from Task 7).

## Pages

- **Home** — hero (photo + 3D + wordmark + chrome) → work as 3 specimen posters →
  about teaser → contact (flare CTA). Scroll-driven reveals.
- **Project dossier (`/projects/[slug]`)** — full-bleed duotone header in the project's
  accent (halftone, katakana, big Anton name, platform tags, Live/GitHub CTAs), body as
  a "dossier" with mono section labels; shared-element morph from the poster.
- **About** — operator file: mono bio, technical chrome, socials as a data table,
  résumé as `DOWNLOAD ↗`.
- **404** — `SIGNAL LOST` brutalist treatment, flare home CTA.

## Motion

- Native CSS scroll-driven reveals (existing `.reveal`, restyled — translate + clip).
- View Transitions shared-element morph (poster → dossier), already wired.
- Hero: 3D object idle rotation; subtle grain shimmer; wordmark entrance on load.
- Hover: poster lift + flare on "OPEN DOSSIER"; respect `prefers-reduced-motion`.

## Assets / open items

- Gino to supply a hero photo (Nano Banana); process to duotone halftone.
- Real app screenshots for dossiers, treated as duotone/halftone in each accent.
- Anton/Archivo/Space Mono swapped into the font links + `@theme`.

## Quality floor

Responsive to mobile (posters stack, chrome simplifies), visible keyboard focus (acid
outline), reduced-motion honored, contrast checked (bone on void, void on acid).
