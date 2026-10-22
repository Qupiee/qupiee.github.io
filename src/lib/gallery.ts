import data from "@/content/gallery.json";
import type { GalleryEntry } from "@/content/types";
import type { LightboxItem } from "@/components/media/Lightbox";
import { getMedia } from "./media";
import { PER_PAGE } from "./gallery-paths";
import { resolvePreview } from "./preview";
import { previews } from "@/content/previews";

export { PER_PAGE, pageHref } from "./gallery-paths";

const entries = data as GalleryEntry[];

export const totalPages = () => Math.max(1, Math.ceil(entries.length / PER_PAGE));


export type GalleryItem = LightboxItem & { author: string };

export function toItem(e: GalleryEntry, i: number): GalleryItem {
  const caption = e.title ?? `Арт для Ai Missouri №${i + 1}`;
  return {
    media: getMedia(e.src, `${caption}, автор ${e.author}`),
    caption,
    credit: { name: e.author, url: e.link ?? undefined },
    author: e.author,
    preview: resolvePreview(previews.gallery, e.preview),
  };
}

export const allItems = (): GalleryItem[] => entries.map(toItem);

export const pageItems = (page: number) => allItems().slice((page - 1) * PER_PAGE, page * PER_PAGE);

/** Уникальные авторы в порядке убывания количества работ */
export function authors() {
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.author, (counts.get(e.author) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}

export const totalArts = () => entries.length;
