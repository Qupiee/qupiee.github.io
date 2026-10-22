import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { GalleryBrowser } from "./GalleryBrowser";
import { authors, pageHref, pageItems, totalArts, totalPages } from "@/lib/gallery";
import { mediaUrl } from "@/lib/media";
import { SITE_URL, absoluteUrl } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export function galleryMetadata(page: number): Metadata {
  const suffix = page > 1 ? ` — страница ${page}` : "";
  return pageMetadata({
    title: `Галерея артов${suffix}`,
    description: `Арты, нарисованные для ${site.name} разными художниками: ${totalArts()} работ с указанием авторов${suffix}.`,
    path: pageHref(page),
  });
}

export function GalleryPageView({ page }: { page: number }) {
  const items = pageItems(page);
  const total = totalPages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `Галерея артов ${site.name}`,
    url: absoluteUrl(pageHref(page)),
    about: { "@id": absoluteUrl("/#person") },
    associatedMedia: items.map((i) => ({
      "@type": "ImageObject",
      contentUrl: SITE_URL + mediaUrl(i.media),
      name: i.caption,
      creator: { "@type": "Person", name: i.credit?.name, url: i.credit?.url },
      creditText: i.credit?.name,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Галерея"
        crumbs={[
          { name: "Галерея", path: "/gallery/" },
          ...(page > 1 ? [{ name: `Страница ${page}`, path: pageHref(page) }] : []),
        ]}
        lead={
          <>
            Коллекция артов Миссури. Нажми на арт, чтобы открыть его целиком.{" "}
            <span className="text-azure-600">
              Страница {page} из {total}
            </span>
          </>
        }
      />
      <div className="mx-auto max-w-6xl px-4">
        <GalleryBrowser items={items} page={page} totalPages={total} authors={authors()} />
      </div>
    </>
  );
}
