// Builds the landing page imagery in public/images/landing from the product
// photography already in public/images. No generated or stock images: every
// picture here is a crop, a colour grade or a re-composition of our own photos.
//
//  - Studio shots (white background) are mapped to pure white and multiplied
//    onto tinted grounds, so each piece keeps its real shadow.
//  - The Milanese scenes get a warm evening grade for the home bar page.
//  - Share images (og-*.jpg) are cropped to 1200 × 630.
//
// Run with: node scripts/landing-images.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = new URL('../public/images/', import.meta.url).pathname;
const OUT = new URL('../public/images/landing/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const piece = (name) => `${SRC}pieces/${name}.jpg`;
const scene = (name) => `${SRC}sets/${name}.jpg`;
const jpeg = (img, file) => img.jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(`${OUT}${file}`);

/**
 * A studio shot with its background (a soft top-to-bottom gradient) mapped to
 * pure white, trimmed to the piece and its shadow. Returns a PNG buffer.
 */
async function cutOut(file, { rotate = 0 } = {}) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => [0, 1, 2].map((c) => data[(y * w + x) * 3 + c]);
  const avg = (pts) => [0, 1, 2].map((c) => pts.reduce((n, p) => n + p[c], 0) / pts.length);
  const top = avg([px(4, 4), px(w - 5, 4), px(w >> 1, 4)]);
  const bottom = avg([px(4, h - 5), px(w - 5, h - 5)]);
  const out = Buffer.alloc(data.length);
  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);
    const bg = [0, 1, 2].map((c) => top[c] + (bottom[c] - top[c]) * t);
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 3; c++) {
        const i = (y * w + x) * 3 + c;
        out[i] = Math.min(255, Math.round((data[i] * 255) / bg[c]));
      }
    }
  }
  let img = sharp(out, { raw: { width: w, height: h, channels: 3 } });
  if (rotate) img = sharp(await img.png().toBuffer()).rotate(rotate, { background: '#ffffff' });
  const png = await img.png().toBuffer();
  return sharp(png).trim({ background: '#ffffff', threshold: 6 }).png().toBuffer();
}

/** Resize a cut-out to a height (or width) and report its size. */
async function sized(buf, { height, width }) {
  const out = await sharp(buf).resize({ height, width, fit: 'inside' }).png().toBuffer();
  const meta = await sharp(out).metadata();
  return { input: out, width: meta.width, height: meta.height };
}

/** Multiply cut-outs onto a flat tinted ground. Items: { buf, left, top }. */
function still(width, height, ground, items) {
  return sharp({ create: { width, height, channels: 3, background: ground } }).composite(
    items.map((it) => ({ input: it.input, left: Math.round(it.left), top: Math.round(it.top), blend: 'multiply' })),
  );
}

/** A single piece centred on a tinted square tile, sitting a little low like a product shot. */
async function tile(file, ground, out, { size = 1000, fill = 0.72 } = {}) {
  const cut = await cutOut(file);
  const s = await sized(cut, { height: Math.round(size * fill), width: Math.round(size * fill) });
  await jpeg(still(size, size, ground, [{ ...s, left: (size - s.width) / 2, top: size * 0.56 - s.height / 2 }]), out);
}

/** Warm, low-light grade with a soft vignette: the Milanese scene after dark. */
async function evening(file, out, { width, height, crop } = {}) {
  let img = sharp(file);
  if (crop) img = img.extract(crop);
  if (width || height) img = img.resize({ width, height, fit: 'cover' });
  const base = await img.modulate({ brightness: 0.66, saturation: 0.9 }).linear([1.04, 0.95, 0.8], [6, 2, 0]).gamma(1.12).toBuffer();
  const meta = await sharp(base).metadata();
  const vignette = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><defs><radialGradient id="v" cx="50%" cy="58%" r="75%"><stop offset="45%" stop-color="#fff"/><stop offset="100%" stop-color="#3a2c22"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`,
  );
  await jpeg(sharp(base).composite([{ input: vignette, blend: 'multiply' }]), out);
}

const GROUND = {
  stone: '#e6e3dc',
  sand: '#ebe1d4',
  chalk: '#eeebe4',
  sage: '#e2e5dc',
  clay: '#eddccf',
};

// ── Coffee gifts ───────────────────────────────────────────────────────────
// The pour: the kettle tilted over the dripper, on a warm sand ground.
{
  const kettle = await sized(await cutOut(piece('gooseneck-kettle'), { rotate: -24 }), { height: 900 });
  const dripper = await sized(await cutOut(piece('glass-pour-over-dripper')), { height: 980 });
  const W = 1400;
  const H = 1750;
  await jpeg(
    still(W, H, GROUND.sand, [
      { ...dripper, left: 150, top: H - dripper.height - 170 },
      { ...kettle, left: W - kettle.width - 40, top: 210 },
    ]),
    'coffee-pour.jpg',
  );
}
await tile(piece('gooseneck-kettle'), GROUND.stone, 'coffee-kettle.jpg');
await tile(piece('hario-hand-grinder'), GROUND.clay, 'coffee-grinder.jpg');
await tile(piece('glass-pour-over-dripper'), GROUND.chalk, 'coffee-dripper.jpg');
await tile(piece('handleless-cups'), GROUND.sage, 'coffee-cups.jpg', { fill: 0.76 });

// ── Housewarming ───────────────────────────────────────────────────────────
// A kitchen counter: board in front, cups and dripper behind it.
{
  const board = await sized(await cutOut(piece('acacia-serving-board-2')), { width: 1500 });
  const cups = await sized(await cutOut(piece('handleless-cups')), { height: 640 });
  const dripper = await sized(await cutOut(piece('glass-pour-over-dripper')), { height: 560 });
  const W = 2000;
  const H = 1250;
  await jpeg(
    still(W, H, GROUND.chalk, [
      { ...cups, left: 380, top: 120 },
      { ...dripper, left: 1080, top: 210 },
      { ...board, left: (W - board.width) / 2, top: H - board.height - 70 },
    ]),
    'home-counter.jpg',
  );
}

// ── Home bar ───────────────────────────────────────────────────────────────
await evening(scene('milanese/set'), 'bar-evening.jpg');
await evening(scene('milanese/mirror'), 'bar-evening-tall.jpg');
await evening(piece('crystal-decanter-set'), 'bar-decanter.jpg', { width: 1200, height: 1500 });
await evening(piece('boston-shaker-tins'), 'bar-shaker.jpg', { width: 1200, height: 1500 });
await evening(piece('ceramic-candle-holders'), 'bar-candles.jpg', { width: 1200, height: 1500 });
await evening(piece('travertine-table-lamp'), 'bar-lamp.jpg', { width: 1200, height: 1500 });
// Detail of the console top from the set photo, for the "laid out" band.
await evening(scene('milanese/set'), 'bar-console.jpg', { crop: { left: 180, top: 920, width: 1960, height: 640 } });

// ── Kris Kindle: one gift tag per piece under €50 ────────────────────────
await tile(piece('acacia-serving-board'), GROUND.sand, 'kk-board.jpg', { size: 900, fill: 0.8 });
await tile(piece('glass-pour-over-dripper'), GROUND.sage, 'kk-dripper.jpg', { size: 900, fill: 0.74 });
for (const [name, file, top] of [
  ['ceramic-candle-holders', 'kk-candles.jpg', 400],
  ['boston-shaker-tins', 'kk-shaker.jpg', 300],
  ['blown-glass-vase', 'kk-vase.jpg', 260],
]) {
  await jpeg(sharp(piece(name)).extract({ left: 0, top, width: 1600, height: 1600 }).resize(900, 900), file);
}

// ── Share images, 1200 × 630 ─────────────────────────────────────────────
const og = (file, out, position = 'centre') => jpeg(sharp(file).resize(1200, 630, { fit: 'cover', position }), out);
await jpeg(sharp(`${OUT}coffee-pour.jpg`).resize(1200, 630, { fit: 'contain', background: GROUND.sand }), 'og-coffee-gifts.jpg');
await og(`${OUT}bar-evening.jpg`, 'og-home-bar.jpg', 'south');
await og(scene('milanese/mirror'), 'og-housewarming.jpg', 'centre');
{
  const tags = ['kk-candles', 'kk-shaker', 'kk-board', 'kk-dripper', 'kk-vase'];
  const tiles = await Promise.all(tags.map((t) => sharp(`${OUT}${t}.jpg`).resize(216, 216).toBuffer()));
  await jpeg(
    sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f5f3ee' } }).composite(
      tiles.map((input, i) => ({ input, left: 30 + i * 230, top: 207 })),
    ),
    'og-kris-kindle.jpg',
  );
}
// ── Riad Corner: a drawn zellige tile (8-point stars), and its share image ─
// Brand olive, chalk and clay, with the set's brass. Used as a repeating
// background on /riad-waitlist and rasterised for the share image.
const ZELLIGE_SHAPES = `
  <rect width="120" height="120" fill="#59634d"/>
  <g transform="translate(60 60)">
    <rect x="-31" y="-31" width="62" height="62" fill="#f5f3ee"/>
    <rect x="-31" y="-31" width="62" height="62" fill="#f5f3ee" transform="rotate(45)"/>
    <rect x="-19" y="-19" width="38" height="38" fill="#b96e50"/>
    <rect x="-19" y="-19" width="38" height="38" fill="#b96e50" transform="rotate(45)"/>
    <circle r="8" fill="#f5f3ee"/>
  </g>
  <g fill="#b89660">
    <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)"/>
    <rect x="-9" y="-9" width="18" height="18" transform="translate(120 0) rotate(45)"/>
    <rect x="-9" y="-9" width="18" height="18" transform="translate(0 120) rotate(45)"/>
    <rect x="-9" y="-9" width="18" height="18" transform="translate(120 120) rotate(45)"/>
  </g>`;
writeFileSync(`${OUT}zellige.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">${ZELLIGE_SHAPES}</svg>\n`);
await jpeg(
  sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="z" width="120" height="120" patternUnits="userSpaceOnUse">${ZELLIGE_SHAPES}</pattern></defs><rect width="1200" height="630" fill="url(#z)"/><path d="M420 630 V300 a180 180 0 0 1 360 0 V630 Z" fill="#59634d"/><path d="M450 630 V305 a150 150 0 0 1 300 0 V630 Z" fill="#48503d"/></svg>`,
    ),
  ),
  'og-riad-waitlist.jpg',
);

console.log('Landing images written to public/images/landing');
