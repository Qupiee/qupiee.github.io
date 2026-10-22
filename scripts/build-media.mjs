/**
 * Конвейер медиа: assets/media/**  →  public/media/**  +  src/generated/media-manifest.json
 *
 * - Статичные и анимированные изображения (png, jpg, webp, gif) конвертируются в WebP
 *   в наборе фиксированных ширин, заданных пресетом раздела (первая папка в пути).
 * - Видео (webm, mp4) копируются как есть. Постер ищется рядом: <имя>.poster.(png|jpg|webp).
 * - Для каждого изображения считается размытое превью (blur placeholder) для плавной загрузки.
 * - Сборка инкрементальная: неизменённые файлы не пересчитываются, устаревшие удаляются.
 *
 *   npm run media
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets", "media");
const OUT = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "generated", "media-manifest.json");

/**
 * Пресеты: ширины генерируемых файлов (px), качество и нужен ли blur-плейсхолдер.
 * Ширины больше исходника не генерируются (без апскейла).
 */
const PRESETS = {
  hero: { widths: [480, 768, 1080, 1440], quality: 84, blur: true },
  gallery: { widths: [320, 480, 768, 1280, 1920], quality: 82, blur: true },
  model: { widths: [480, 960, 1440, 1920], quality: 84, blur: true },
  overlays: { widths: [960, 1920], quality: 90, blur: false },
  emotes: { widths: [112, 224, 448], quality: 92, blur: false },
  panels: { widths: [320, 640], quality: 88, blur: false },
  screens: { widths: [640, 1280, 1920], quality: 82, blur: true },
  merch: { widths: [320, 640, 1024, 1600], quality: 84, blur: true },
  default: { widths: [640, 1280], quality: 82, blur: true },
};

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".webm", ".mp4"]);

const toPosix = (p) => p.split(path.sep).join("/");

async function walk(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readJson(p, fallback) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return fallback;
  }
}

function presetFor(rel) {
  return PRESETS[rel.split("/")[0]] ?? PRESETS.default;
}

/** "gallery/art-01.png" → "gallery/art-01" */
const stem = (rel) => rel.slice(0, rel.length - path.extname(rel).length);

async function processImage(rel, file, prev, stat) {
  const preset = presetFor(rel);
  const signature = `${stat.size}-${Math.round(stat.mtimeMs)}-${preset.widths.join(",")}-${preset.quality}`;
  const base = stem(rel);

  if (prev?.signature === signature) {
    const outputs = prev.widths.map((w) => `${base}-${w}.webp`);
    if ((await Promise.all(outputs.map((o) => exists(path.join(OUT, o))))).every(Boolean)) {
      return { entry: prev, outputs, cached: true };
    }
  }

  const ext = path.extname(rel).toLowerCase();
  const animated = ext === ".gif" || ext === ".webp";
  const meta = await sharp(file, { animated }).metadata();
  const width = meta.width;
  // у анимаций metadata.height — высота всей «ленты» кадров
  const height = meta.pageHeight ?? meta.height;
  const isAnimated = (meta.pages ?? 1) > 1;

  let widths = preset.widths.filter((w) => w < width);
  widths.push(Math.min(width, preset.widths.at(-1)));
  widths = [...new Set(widths)].sort((a, b) => a - b);

  const outputs = [];
  for (const w of widths) {
    const outRel = `${base}-${w}.webp`;
    const outFile = path.join(OUT, outRel);
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await sharp(file, { animated: isAnimated })
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: preset.quality, alphaQuality: 100, effort: 5 })
      .toFile(outFile);
    outputs.push(outRel);
  }

  let blur;
  if (preset.blur) {
    const buf = await sharp(file, { pages: 1 }).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    blur = `data:image/webp;base64,${buf.toString("base64")}`;
  }

  return {
    entry: { type: "image", width, height, widths, animated: isAnimated, blur, signature },
    outputs,
    cached: false,
  };
}

async function processVideo(rel, file, allRel) {
  const outFile = path.join(OUT, rel);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  const [srcStat, outStat] = await Promise.all([fs.stat(file), fs.stat(outFile).catch(() => null)]);
  if (!outStat || outStat.size !== srcStat.size || outStat.mtimeMs < srcStat.mtimeMs) {
    await fs.copyFile(file, outFile);
  }
  const base = stem(rel);
  const poster = allRel.find((r) => stem(r) === `${base}.poster` && IMAGE_EXT.has(path.extname(r).toLowerCase()));
  return { entry: { type: "video", poster }, outputs: [rel] };
}

async function pool(items, size, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx]);
      }
    }),
  );
  return results;
}

async function main() {
  const started = Date.now();
  const prevManifest = await readJson(MANIFEST, {});
  const files = await walk(SRC);
  const allRel = files.map((f) => toPosix(path.relative(SRC, f)));

  const manifest = {};
  const expected = new Set();
  let built = 0;
  let cached = 0;
  const skipped = [];

  await pool(files, 4, async (file) => {
    const rel = toPosix(path.relative(SRC, file));
    const ext = path.extname(rel).toLowerCase();
    try {
      let res;
      if (IMAGE_EXT.has(ext)) res = await processImage(rel, file, prevManifest[rel], await fs.stat(file));
      else if (VIDEO_EXT.has(ext)) res = await processVideo(rel, file, allRel);
      else {
        skipped.push(rel);
        return;
      }
      manifest[rel] = res.entry;
      res.outputs.forEach((o) => expected.add(o));
      if (res.cached) cached++;
      else built++;
    } catch (err) {
      console.error(`[media] ошибка обработки ${rel}:`, err.message);
      process.exitCode = 1;
    }
  });

  // удаляем результаты, исходники которых больше не существуют
  let removed = 0;
  for (const f of await walk(OUT)) {
    const rel = toPosix(path.relative(OUT, f));
    if (!expected.has(rel)) {
      await fs.rm(f);
      removed++;
    }
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  if (skipped.length) console.warn(`[media] пропущены неподдерживаемые файлы: ${skipped.join(", ")}`);
  console.log(
    `[media] готово за ${((Date.now() - started) / 1000).toFixed(1)}с: обработано ${built}, из кэша ${cached}, удалено устаревших ${removed}`,
  );
}

await main();
