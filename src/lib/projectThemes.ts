// Per-project theming derived from each app's REAL brand palette.
// The global site stays acid/void; each project poster + dossier adopts its app's vibe.

export type Accent = "myth" | "glow" | "karma";

export interface ProjectTheme {
  /** radial gradient stops: from (light corner) -> mid -> to (deep corner) */
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  name: string; // big Anton wordmark
  body: string; // tagline / paragraph
  chrome: string; // small mono labels
  accent: string; // binary, "open dossier", links
  glyph: string; // kana, decorative
  logo: string; // app logo fill
  /** true when the card reads as a light surface (dark text) */
  light: boolean;
}

export const PROJECT_THEMES: Record<Accent, ProjectTheme> = {
  // Mythique — deep teal-navy + cream + gold (premium / mythic superhero)
  myth: {
    bgFrom: "#1c333c",
    bgMid: "#0d1d25",
    bgTo: "#081016",
    name: "#efe6d6",
    body: "#aebcc2",
    chrome: "#8fa1a8",
    accent: "#f3c969",
    glyph: "#8b93f0",
    logo: "#efe6d6",
    light: false,
  },
  // Glow — golden-hour -> ember terracotta (warm / romantic)
  glow: {
    bgFrom: "#f1bf72",
    bgMid: "#e29a3f",
    bgTo: "#a85a26",
    name: "#2a201b",
    body: "#4b3a2f",
    chrome: "#6b4a31",
    accent: "#8c2f12",
    glyph: "#c9714a",
    logo: "#2a201b",
    light: true,
  },
  // Karma Kart — slate-blue -> midnight navy + planet-green (ethical / grounded)
  karma: {
    bgFrom: "#3a5a79",
    bgMid: "#1e2c3a",
    bgTo: "#0d1520",
    name: "#f2ede4",
    body: "#aebccb",
    chrome: "#8ea2b5",
    accent: "#a4c251",
    glyph: "#7f9cb5",
    logo: "#f2ede4",
    light: false,
  },
};
