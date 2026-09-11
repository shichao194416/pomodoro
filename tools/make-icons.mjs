/**
 * Generates the app icons as real PNG files.
 *
 * iOS ignores SVG for `apple-touch-icon`, so the icons have to be raster.
 * Rather than pulling in an image library, this renders the tomato
 * analytically and encodes the PNG with Node's built-in zlib.
 *
 *   node tools/make-icons.mjs
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');
const iconsDir = resolve(publicDir, 'icons');

/* ---------------------------------------------------------------- PNG encoder */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter type: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------- colour helpers */

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

/** src over dst, both [r,g,b,a] with a in 0..1 */
function over(dst, src) {
  const a = src[3] + dst[3] * (1 - src[3]);
  if (a <= 0) return [0, 0, 0, 0];
  const mix = (s, d) => (s * src[3] + d * dst[3] * (1 - src[3])) / a;
  return [mix(src[0], dst[0]), mix(src[1], dst[1]), mix(src[2], dst[2]), a];
}

const lerp = (a, b, t) => a + (b - a) * t;
const lerpRgb = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ----------------------------------------------------------- icon composition */

const BG_FROM = hexToRgb('#22333d');
const BG_TO = hexToRgb('#0b161c');
const TOMATO_FROM = hexToRgb('#ff6b5e');
const TOMATO_TO = hexToRgb('#c1121f');
const LEAF = hexToRgb('#2a9d8f');
const STEM = hexToRgb('#1d7a70');
const WHITE = [1, 1, 1];

const dist = (px, py, ax, ay) => Math.hypot(px - ax, py - ay);

/** Distance from a point to a line segment — used for round-capped strokes. */
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return dist(px, py, ax + t * dx, ay + t * dy);
}

/** Coverage test for a rotated ellipse (all coordinates normalised 0..1). */
function inEllipse(px, py, cx, cy, rx, ry, angle) {
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  const dx = px - cx;
  const dy = py - cy;
  const x = dx * cos - dy * sin;
  const y = dx * sin + dy * cos;
  return (x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1;
}

/**
 * Colour of the icon at normalised position (x, y).
 * `art` scales the artwork about the centre (1 = edge to edge, <1 = smaller,
 * which is what a maskable icon needs so the OS can crop freely).
 */
function colorAt(x, y, art) {
  const ax = 0.5 + (x - 0.5) * art;
  const ay = 0.5 + (y - 0.5) * art;

  // Background: diagonal gradient.
  let pixel = [...lerpRgb(BG_FROM, BG_TO, Math.min(1, (ax + ay) / 2)), 1];

  // Tomato body.
  const bodyCx = 0.5;
  const bodyCy = 0.6;
  const bodyR = 0.28;
  if (dist(ax, ay, bodyCx, bodyCy) <= bodyR) {
    const t = Math.min(1, Math.max(0, (ax - (bodyCx - bodyR) + (ay - (bodyCy - bodyR))) / (4 * bodyR)));
    pixel = over(pixel, [...lerpRgb(TOMATO_FROM, TOMATO_TO, t), 1]);

    // Soft gloss highlight.
    const gd = dist(ax, ay, 0.4, 0.49);
    if (gd <= 0.17) {
      pixel = over(pixel, [1, 1, 1, 0.2 * (1 - gd / 0.17) ** 2]);
    }
  }

  // Sepals: five leaves radiating out from the top of the tomato.
  for (let k = 0; k < 5; k += 1) {
    const angle = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    const cx = 0.5 + Math.cos(angle) * 0.082;
    const cy = 0.325 + Math.sin(angle) * 0.082;
    if (inEllipse(ax, ay, cx, cy, 0.082, 0.036, angle)) {
      pixel = over(pixel, [...LEAF, 1]);
    }
  }

  // Stem.
  if (distToSegment(ax, ay, 0.5, 0.335, 0.5, 0.215) <= 0.028) {
    pixel = over(pixel, [...STEM, 1]);
  }

  // Clock hands — this is what makes it read as a *timer*, not a fruit.
  const handW = 0.021;
  if (
    distToSegment(ax, ay, 0.5, 0.6, 0.5, 0.425) <= handW ||
    distToSegment(ax, ay, 0.5, 0.6, 0.632, 0.6) <= handW ||
    dist(ax, ay, 0.5, 0.6) <= 0.03
  ) {
    pixel = over(pixel, [...WHITE, 1]);
  }

  return pixel;
}

/** Renders one square icon with supersampled antialiasing. */
function renderIcon(size, art = 1) {
  const ss = 3; // sub-samples per axis
  const out = Buffer.alloc(size * size * 4);
  const samples = ss * ss;

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < ss; sy += 1) {
        for (let sx = 0; sx < ss; sx += 1) {
          const x = (px + (sx + 0.5) / ss) / size;
          const y = (py + (sy + 0.5) / ss) / size;
          const c = colorAt(x, y, art);
          r += c[0];
          g += c[1];
          b += c[2];
          a += c[3];
        }
      }
      const i = (py * size + px) * 4;
      out[i] = Math.round((r / samples) * 255);
      out[i + 1] = Math.round((g / samples) * 255);
      out[i + 2] = Math.round((b / samples) * 255);
      out[i + 3] = Math.round((a / samples) * 255);
    }
  }
  return out;
}

/* ------------------------------------------------------------------------ main */

mkdirSync(iconsDir, { recursive: true });

const targets = [
  { file: resolve(publicDir, 'apple-touch-icon.png'), size: 180, art: 1 },
  { file: resolve(iconsDir, 'icon-192.png'), size: 192, art: 1 },
  { file: resolve(iconsDir, 'icon-512.png'), size: 512, art: 1 },
  { file: resolve(iconsDir, 'maskable-512.png'), size: 512, art: 0.78 },
  { file: resolve(publicDir, 'favicon-32.png'), size: 32, art: 1.05 },
];

for (const { file, size, art } of targets) {
  const png = encodePNG(size, size, renderIcon(size, art));
  writeFileSync(file, png);
  console.log(`  ${String(size).padStart(4)}px  ${(png.length / 1024).toFixed(1).padStart(6)} KB  ${file}`);
}

console.log(`\nWrote ${targets.length} icons.`);
