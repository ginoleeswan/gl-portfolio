// Rasterizes public/favicon.svg into PNG sizes + a multi-size favicon.ico.
// Run with: node scripts/gen-favicon.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const pub = fileURLToPath(new URL("../public/", import.meta.url));
const svg = await readFile(pub + "favicon.svg");

// Render the PNGs browsers actually request.
const sizes = [16, 32, 48, 180];
const pngs = {};
for (const s of sizes) {
  pngs[s] = await sharp(svg, { density: 384 })
    .resize(s, s)
    .png()
    .toBuffer();
}

await writeFile(pub + "apple-touch-icon.png", pngs[180]);

// Pack 16/32/48 into a PNG-encoded .ico (header + dir entries + data).
const icoSizes = [16, 32, 48];
const count = icoSizes.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(count, 4);

const dir = Buffer.alloc(16 * count);
let offset = 6 + 16 * count;
const datas = [];
icoSizes.forEach((s, i) => {
  const data = pngs[s];
  const e = i * 16;
  dir.writeUInt8(s === 256 ? 0 : s, e + 0); // width
  dir.writeUInt8(s === 256 ? 0 : s, e + 1); // height
  dir.writeUInt8(0, e + 2); // palette
  dir.writeUInt8(0, e + 3); // reserved
  dir.writeUInt16LE(1, e + 4); // color planes
  dir.writeUInt16LE(32, e + 6); // bits per pixel
  dir.writeUInt32LE(data.length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += data.length;
  datas.push(data);
});

await writeFile(pub + "favicon.ico", Buffer.concat([header, dir, ...datas]));
console.log("Wrote favicon.ico, apple-touch-icon.png");
