/**
 * Генерирует временные изображения-плейсхолдеры в assets/media.
 * Существующие файлы НЕ перезаписываются (кроме запуска с флагом --force),
 * так что реальные арты, положенные поверх, в безопасности.
 *
 *   npm run placeholders
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets", "media");
const FORCE = process.argv.includes("--force");

const palettes = [
  ["#dfe7fb", "#9db8f7", "#f9a8c9"],
  ["#eef1f7", "#7898ea", "#f282b0"],
  ["#e3ebff", "#c7cfdd", "#f9a8c9"],
  ["#f6f8fb", "#a8c1ff", "#ffd0e4"],
];

const heart = (x, y, s, fill) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" d="M12 21s-7.5-4.6-9.8-9.2C.6 8.4 2.4 4.5 6.1 4.5c2.2 0 3.9 1.3 5 3 1.1-1.7 2.8-3 5-3 3.7 0 5.5 3.9 3.9 7.3C19.5 16.4 12 21 12 21z"/>`;
const sparkle = (x, y, s, fill) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z"/>`;

function decor(w, h, seed, accent) {
  let out = "";
  const rnd = mulberry(seed);
  for (let i = 0; i < 9; i++) {
    const s = (Math.min(w, h) / 24) * (0.08 + rnd() * 0.14);
    const fn = i % 3 === 0 ? heart : sparkle;
    out += fn(rnd() * w, rnd() * h, s, i % 2 ? "#ffffff" : accent);
  }
  return out;
}

function mulberry(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function card({ w, h, label, sub = "", seed = 1, transparent = false }) {
  const [c1, c2, accent] = palettes[seed % palettes.length];
  const fs1 = Math.round(Math.min(w, h) / 9);
  const bg = transparent
    ? `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2.2}" fill="url(#g)"/>`
    : `<rect width="${w}" height="${h}" fill="url(#g)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  ${bg}
  ${transparent ? "" : decor(w, h, seed, accent)}
  <text x="50%" y="${sub ? "46%" : "52%"}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
    font-size="${fs1}" font-weight="700" fill="#374d99" opacity="0.85">${label}</text>
  ${sub ? `<text x="50%" y="${50 + fs1 / h * 60}%" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(fs1 / 2.4)}" fill="#5a6688">${sub}</text>` : ""}
</svg>`;
}

/** Рамка оверлея 1920×1080 с прозрачным «окном» (координаты окна — в процентах). */
function overlay({ label, win, seed }) {
  const w = 1920;
  const h = 1080;
  const [, c2, accent] = palettes[seed % palettes.length];
  const x = (win.x / 100) * w;
  const y = (win.y / 100) * h;
  const ww = (win.w / 100) * w;
  const hh = (win.h / 100) * h;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f7"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <mask id="m"><rect width="${w}" height="${h}" fill="#fff"/><rect x="${x}" y="${y}" width="${ww}" height="${hh}" rx="36" fill="#000"/></mask>
  </defs>
  <g mask="url(#m)">
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${decor(w, h, seed * 7, accent)}
  </g>
  <rect x="${x - 6}" y="${y - 6}" width="${ww + 12}" height="${hh + 12}" rx="40" fill="none" stroke="#ffffff" stroke-width="12"/>
  <rect x="${x - 16}" y="${y - 16}" width="${ww + 32}" height="${hh + 32}" rx="48" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="14 12"/>
  <text x="${w - 40}" y="${h - 36}" text-anchor="end" font-family="Arial" font-size="44" font-weight="700" fill="#374d99">${label}</text>
</svg>`;
}

async function write(rel, svg, { format = "png" } = {}) {
  const file = path.join(SRC, rel);
  if (!FORCE) {
    try {
      await fs.access(file);
      return false;
    } catch {}
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  const img = sharp(Buffer.from(svg));
  await (format === "jpg" ? img.jpeg({ quality: 86 }) : img.png()).toFile(file);
  return true;
}

// Окна оверлеев должны совпадать с src/content/model.ts
const OVERLAY_WINDOWS = [
  { x: 3, y: 5, w: 70, h: 78 },
  { x: 8, y: 9, w: 84, h: 72 },
  { x: 27, y: 6, w: 70, h: 80 },
];

const jobs = [];
jobs.push(["hero/missouri.png", card({ w: 1200, h: 1600, label: "AI MISSOURI", sub: "главный арт 3:4", seed: 3 })]);

const shapes = [
  [1600, 1600],
  [1200, 1600],
  [1600, 1200],
  [1080, 1350],
  [1920, 1080],
];
for (let i = 1; i <= 42; i++) {
  const [w, h] = shapes[i % shapes.length];
  jobs.push([`gallery/art-${String(i).padStart(2, "0")}.png`, card({ w, h, label: `ART ${i}`, sub: `${w}×${h}`, seed: i })]);
}
for (let i = 1; i <= 3; i++) {
  jobs.push([`model/look-${i}.png`, card({ w: 1920, h: 1080, label: `MODEL LOOK ${i}`, sub: "референс 16:9", seed: i + 10 })]);
  jobs.push([`overlays/overlay-${i}.png`, overlay({ label: `OVERLAY ${i}`, win: OVERLAY_WINDOWS[i - 1], seed: i })]);
}
for (let i = 1; i <= 14; i++) {
  jobs.push([`emotes/emote-${String(i).padStart(2, "0")}.png`, card({ w: 512, h: 512, label: `:${i}:`, seed: i, transparent: true })]);
}
const panels = ["about", "rules", "schedule", "donate", "socials", "pc"];
panels.forEach((p, i) => jobs.push([`panels/${p}.png`, card({ w: 640, h: 320, label: p.toUpperCase(), sub: "панель 320×160", seed: i })]));
["start", "break", "end"].forEach((s, i) =>
  jobs.push([`screens/${s}.png`, card({ w: 1920, h: 1080, label: s.toUpperCase(), sub: "заставка 16:9", seed: i + 2 })]),
);
const merch = ["acrylic-stand", "keychain", "stickers", "plush", "hoodie", "mousepad"];
merch.forEach((m, i) => {
  for (let k = 1; k <= 3; k++) jobs.push([`merch/${m}/${k}.png`, card({ w: 1200, h: 1200, label: m.toUpperCase(), sub: `фото ${k}`, seed: i + k })]);
});

let created = 0;
for (const [rel, svg] of jobs) if (await write(rel, svg)) created++;

// OG-картинка для соцсетей кладётся сразу в public (нужен jpg 1200×630, не webp)
const og = path.join(ROOT, "public", "og.jpg");
try {
  if (FORCE) throw 0;
  await fs.access(og);
} catch {
  await sharp(Buffer.from(card({ w: 1200, h: 630, label: "AI MISSOURI", sub: "twitch.tv/ai_missouri", seed: 3 })))
    .jpeg({ quality: 88 })
    .toFile(og);
  created++;
}

console.log(`[placeholders] создано файлов: ${created}, пропущено (уже есть): ${jobs.length + 1 - created}`);
