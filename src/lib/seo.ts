import type { Metadata } from "next";
import { site, socials } from "@/content/site";
import { ALLOW_INDEXING, absoluteUrl } from "./env";

export const OG_IMAGE = { url: absoluteUrl("/og.jpg"), width: 1200, height: 630, alt: site.name };

type PageSeo = {
  /** Заголовок страницы; к нему добавится « · Ai Missouri» через шаблон в layout */
  title?: string;
  description?: string;
  /** Путь страницы с завершающим слэшем: "/gallery/" */
  path: string;
  /** Абсолютный URL картинки для превью в соцсетях */
  image?: { url: string; width?: number; height?: number; alt?: string };
  noindex?: boolean;
};

export function pageMetadata({ title, description = site.description, path, image, noindex }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const images = [image ?? OG_IMAGE];
  const fullTitle = title ? `${title} · ${site.name}` : site.title;
  const index = ALLOW_INDEXING && !noindex;
  return {
    title: title ?? { absolute: site.title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: site.name,
      url,
      title: fullTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((i) => i.url) },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/* ---------- JSON-LD (schema.org) ---------- */

export const personLd = () => ({
  "@type": "Person",
  "@id": absoluteUrl("/#person"),
  name: site.name,
  alternateName: ["ai_missouri", "Missouri"],
  description: site.tagline,
  jobTitle: "VTuber, стример",
  url: absoluteUrl("/"),
  image: absoluteUrl("/og.jpg"),
  sameAs: socials.map((s) => s.url),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: site.name,
  url: absoluteUrl("/"),
  inLanguage: "ru-RU",
  publisher: { "@id": absoluteUrl("/#person") },
});

export type Crumb = { name: string; path: string };

export const breadcrumbLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});
