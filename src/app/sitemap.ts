import type { MetadataRoute } from "next";
import { authorsNav } from "@/content/site";
import { pageHref, totalPages } from "@/lib/gallery";
import { ALLOW_INDEXING, absoluteUrl } from "@/lib/env";

export const dynamic = "force-static";

// Страница /support/ намеренно не включена (noindex, доступна только по кнопке).
export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];
  const lastModified = new Date();
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/gallery/", 0.9, "weekly"),
    ...Array.from({ length: totalPages() - 1 }, (_, i) => entry(pageHref(i + 2), 0.6, "weekly")),
    entry("/merch/", 0.8),
    entry("/authors/", 0.7),
    ...authorsNav.map((n) => entry(n.href, 0.7)),
  ];
}
