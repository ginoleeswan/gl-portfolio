// Regenerate the social-share image: bun run scripts/generate-og.mjs
// The Schabo headline is rendered to vector outlines on tight per-line canvases
// (librsvg clips long paths on large canvases), then composited over the chrome.
import sharp from "sharp";
import opentype from "opentype.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const _b = readFileSync(`${ROOT}/public/fonts/schabo-condensed.otf`);
const font = opentype.parse(_b.buffer.slice(_b.byteOffset, _b.byteOffset + _b.byteLength));

const BONE = "#e9e7dd", ACID = "#4de852", VOID = "#0b0c11", STEEL = "#7f857a";
const W = 1200, H = 630;

// render a single headline line (one or more colored segments) to a tight PNG buffer
async function renderLine(segments, size) {
  const pad = 8, baseY = size * 0.95;
  let x = pad, paths = "";
  for (const s of segments) {
    const d = font.getPath(s.text, x, baseY, size).toPathData(2);
    paths += `<path d="${d}" fill="${s.color}"/>`;
    x += font.getAdvanceWidth(s.text, size);
  }
  const cw = Math.ceil(x + pad), ch = Math.ceil(size * 1.2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}">${paths}</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

const machineH = 470;
const machine = await sharp(`${ROOT}/public/hero-machine.webp`).resize({ height: machineH }).toBuffer();
const mW = (await sharp(machine).metadata()).width;
const machineLeft = W - mW - 32;
const maxTextW = machineLeft - 64 - 28;

let l1 = await renderLine([{ text: "BUILT TO", color: BONE }], 150);
let l2 = await renderLine([{ text: "BE ", color: BONE }, { text: "SHIPPED.", color: ACID }], 150);
let m1 = await sharp(l1).metadata(), m2 = await sharp(l2).metadata();
const scale = Math.min(1, maxTextW / Math.max(m1.width, m2.width));
if (scale < 1) {
  l1 = await sharp(l1).resize({ width: Math.round(m1.width * scale) }).toBuffer();
  l2 = await sharp(l2).resize({ width: Math.round(m2.width * scale) }).toBuffer();
  m1 = await sharp(l1).metadata(); m2 = await sharp(l2).metadata();
}

const x = 64, y1 = 150, y2 = y1 + Math.round(m1.height * 0.78);
const stripeY = y2 + m2.height - 6, nameY = stripeY + 50;

let grid = "";
for (let gx = 0; gx <= W; gx += 64) grid += `<line x1="${gx}" y1="0" x2="${gx}" y2="${H}" stroke="${ACID}" stroke-opacity="0.05"/>`;
for (let gy = 0; gy <= H; gy += 64) grid += `<line x1="0" y1="${gy}" x2="${W}" y2="${gy}" stroke="${ACID}" stroke-opacity="0.05"/>`;
let stripe = "";
for (let sx = x; sx < x + 330; sx += 30) stripe += `<rect x="${sx}" y="${stripeY}" width="18" height="10" fill="${ACID}"/>`;

const base = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>.m{font-family:ui-monospace,"Courier New",monospace;}</style>
  <rect width="${W}" height="${H}" fill="${VOID}"/>
  ${grid}
  <text x="${x + 2}" y="112" class="m" fill="${ACID}" font-size="20" letter-spacing="3">// PORTFOLIO</text>
  <text x="${x + 218}" y="112" class="m" fill="${STEEL}" font-size="20" letter-spacing="3">REV 2026.06</text>
  ${stripe}
  <text x="${x + 2}" y="${nameY}" class="m" fill="${BONE}" font-size="22" letter-spacing="2">GINO SWANEPOEL</text>
  <text x="${x + 2}" y="${nameY + 30}" class="m" fill="${STEEL}" font-size="16" letter-spacing="3">DESIGNER / DEVELOPER — 03 SHIPPED PRODUCTS</text>
  <text x="${W - 30}" y="600" class="m" fill="${STEEL}" font-size="15" letter-spacing="2" text-anchor="end">40.7440°N 73.9873°W</text>
</svg>`;

await sharp(Buffer.from(base))
  .composite([
    { input: machine, top: Math.round((H - machineH) / 2), left: machineLeft },
    { input: l1, top: y1, left: x },
    { input: l2, top: y2, left: x },
  ])
  .png().toFile(`${ROOT}/public/og/default.png`);
console.log(`wrote public/og/default.png (scale ${scale.toFixed(2)})`);
