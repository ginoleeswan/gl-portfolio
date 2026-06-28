const SITE = "Gino Swanepoel";
const DEFAULT_DESC = "Developer & app maker. Showcasing Mythique, Glow, and Karma Kart.";

export function buildMeta(opts: { title?: string; description?: string; image?: string }) {
  return {
    title: opts.title ? `${opts.title} — ${SITE}` : SITE,
    description: opts.description ?? DEFAULT_DESC,
    ogImage: opts.image ?? "/og/default.png",
  };
}
