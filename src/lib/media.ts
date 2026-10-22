import fs from "node:fs";
import path from "node:path";
import { withBase } from "./env";
import type { MediaPath } from "@/content/types";

/**
 * Серверный модуль (читает манифест на этапе сборки).
 * Превращает путь к исходнику ("gallery/art-01.png") в готовый к рендеру объект
 * со srcset, размерами и blur-плейсхолдером. Результат сериализуем —
 * его можно передавать в клиентские компоненты.
 */

type ManifestEntry =
  | { type: "image"; width: number; height: number; widths: number[]; animated: boolean; blur?: string }
  | { type: "video"; poster?: string };

export type ImageMedia = {
  kind: "image";
  src: string;
  srcSet: string;
  width: number;
  height: number;
  blur?: string;
  alt: string;
};

export type VideoMedia = {
  kind: "video";
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
};

export type Media = ImageMedia | VideoMedia;

const MANIFEST_PATH = path.join(process.cwd(), "src", "generated", "media-manifest.json");
let cache: Record<string, ManifestEntry> | null = null;

function manifest(): Record<string, ManifestEntry> {
  // в dev перечитываем, чтобы новые файлы подхватывались без перезапуска
  if (cache && process.env.NODE_ENV === "production") return cache;
  try {
    cache = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    console.warn("[media] манифест не найден — запустите `npm run media`");
    cache = {};
  }
  return cache!;
}

const stem = (p: string) => p.replace(/\.[^.]+$/, "");
const warned = new Set<string>();

function missing(rel: string, alt: string): ImageMedia {
  if (!warned.has(rel)) {
    warned.add(rel);
    console.warn(`[media] файл не найден в assets/media: ${rel} — показан плейсхолдер`);
  }
  const src = withBase("/placeholder.svg");
  return { kind: "image", src, srcSet: "", width: 1200, height: 1200, alt };
}

function image(rel: string, alt: string): ImageMedia | null {
  const entry = manifest()[rel];
  if (!entry || entry.type !== "image") return null;
  const base = stem(rel);
  const url = (w: number) => withBase(`/media/${base}-${w}.webp`);
  return {
    kind: "image",
    src: url(entry.widths.at(-1)!),
    srcSet: entry.widths.map((w) => `${url(w)} ${w}w`).join(", "),
    width: entry.width,
    height: entry.height,
    blur: entry.blur,
    alt,
  };
}

/**
 * @param size  размеры для видео (у видео их нельзя прочитать без ffprobe); по умолчанию 16:9
 */
export function getMedia(rel: MediaPath, alt: string, size = { width: 1920, height: 1080 }): Media {
  const entry = manifest()[rel];
  if (!entry) return missing(rel, alt);
  if (entry.type === "video") {
    const poster = entry.poster ? image(entry.poster, alt)?.src : undefined;
    return { kind: "video", src: withBase(`/media/${rel}`), poster, alt, ...size };
  }
  return image(rel, alt)!;
}

/** Ссылка на самый крупный файл — для Open Graph и JSON-LD. */
export function mediaUrl(m: Media) {
  return m.kind === "video" ? (m.poster ?? m.src) : m.src;
}
