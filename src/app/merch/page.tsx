import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Credits } from "@/components/ui/Credits";
import { JsonLd } from "@/components/seo/JsonLd";
import { MerchGallery } from "@/components/merch/MerchGallery";
import { merch, merchStatusLabel } from "@/content/merch";
import { site, socials } from "@/content/site";
import type { MerchStatus } from "@/content/types";
import { previews } from "@/content/previews";
import { getMedia, mediaUrl } from "@/lib/media";
import { resolvePreview } from "@/lib/preview";
import { SITE_URL, absoluteUrl } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Мерч",
  description: `Мерч ${site.name}: акриловые фигурки, брелоки, стикеры и другие милые вещи. Цены и наличие.`,
  path: "/merch/",
});

const statusStyle: Record<MerchStatus, string> = {
  available: "bg-azure-100 text-azure-700",
  preorder: "bg-blush-100 text-blush-500",
  soon: "bg-silver-200 text-ink-soft",
  "sold-out": "bg-silver-200 text-silver-500 line-through",
};

const schemaAvailability: Record<MerchStatus, string> = {
  available: "https://schema.org/InStock",
  preorder: "https://schema.org/PreOrder",
  soon: "https://schema.org/PreSale",
  "sold-out": "https://schema.org/SoldOut",
};

const price = (p: number | null) => (p === null ? "Цена появится позже" : `${p.toLocaleString("ru-RU")} ₽`);
const telegram = socials.find((s) => s.id === "telegram")!;

export default function MerchPage() {
  const items = merch.map((m) => ({
    ...m,
    gallery: m.images.map((src, i) => ({ media: getMedia(src, `${m.title}, фото ${i + 1}`), caption: m.title })),
    preview: resolvePreview(previews.merch, m.preview),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Мерч ${site.name}`,
    url: absoluteUrl("/merch/"),
    itemListElement: items.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: m.title,
        description: m.description.join(" "),
        image: m.gallery.map((g) => SITE_URL + mediaUrl(g.media)),
        brand: { "@type": "Brand", name: site.name },
        ...(m.price !== null && {
          offers: {
            "@type": "Offer",
            price: m.price,
            priceCurrency: "RUB",
            availability: schemaAvailability[m.status],
          },
        }),
      },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        title="Мерч"
        crumbs={[{ name: "Мерч", path: "/merch/" }]}
        lead={
          <>
            Милый штучки с Миссури. За всеми обновлениями вы можете следить в{" "}
            <a href={telegram.url} target="_blank" rel="noopener noreferrer" className="link">
              Телеграм-канале
            </a>
            .
          </>
        }
      />

      <ul className="mx-auto max-w-6xl space-y-8 px-4">
        {items.map((m) => (
          <li key={m.id} id={m.id} className="scroll-mt-28">
            <article className="card grid gap-6 p-4 sm:p-6 md:grid-cols-[1.1fr_1fr] md:gap-8" aria-labelledby={`${m.id}-title`}>
              <MerchGallery items={m.gallery} title={m.title} preview={m.preview} />

              {/* текст-легенда */}
              <div className="dotted flex flex-col bg-white/60 p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[m.status]}`}>
                    {merchStatusLabel[m.status]}
                  </span>
                </div>
                <h2 id={`${m.id}-title`} className="mt-3 text-2xl sm:text-3xl">
                  {m.title}
                </h2>
                <p className="mt-2 font-display text-2xl font-bold text-blush-500">{price(m.price)}</p>

                <div className="mt-4 space-y-3 text-ink-soft">
                  {m.description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                {m.details && (
                  <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-2xl bg-azure-50/80 p-4 text-sm">
                    {m.details.map((d) => (
                      <div key={d.label} className="contents">
                        <dt className="font-bold text-azure-700">{d.label}</dt>
                        <dd className="text-ink-soft">{d.value}</dd>
                      </div>
                    ))}
                    <dt className="font-bold text-azure-700">Статус</dt>
                    <dd className="text-ink-soft">{merchStatusLabel[m.status]}</dd>
                  </dl>
                )}

                {m.credits && (
                  <div className="mt-auto pt-5">
                    <Credits credits={m.credits} />
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
