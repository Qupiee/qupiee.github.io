import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { MediaView } from "@/components/media/MediaView";
import { ArrowRight } from "@/components/icons";
import { authorsNav } from "@/content/site";
import { modelLooks } from "@/content/model";
import { emotes } from "@/content/emotes";
import { screens } from "@/content/screens";
import { getMedia } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Авторы оформления",
  description: "Художники и дизайнеры, которые создали модель, оверлеи, смайлики, панели и заставки канала Ai Missouri.",
  path: "/authors/",
});

const covers = [modelLooks[0].src, emotes[0].src, screens[0].src];

export default function AuthorsPage() {
  return (
    <>
      <PageHeader
        title="Авторы"
        crumbs={[{ name: "Авторы", path: "/authors/" }]}
        lead="Всё оформление канала нарисовано талантливыми авторами. Здесь собраны их работы и ссылки на них."
      />
      <ul className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
        {authorsNav.map((n, i) => (
          <li key={n.href}>
            <Link
              href={n.href}
              className="card group flex h-full flex-col overflow-hidden transition duration-300 ease-(--ease-bounce) hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-video overflow-hidden bg-azure-50">
                <MediaView
                  media={getMedia(covers[i], n.label)}
                  sizes="(min-width: 768px) 360px, 100vw"
                  fit={i === 1 ? "contain" : "cover"}
                  className={`size-full transition duration-500 group-hover:scale-105 ${i === 1 ? "p-6" : ""}`}
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-3 p-5">
                <div>
                  <h2 className="text-xl">{n.label}</h2>
                  <p className="text-sm text-ink-soft">{n.description}</p>
                </div>
                <ArrowRight className="shrink-0 text-azure-300 transition group-hover:translate-x-1 group-hover:text-blush-400" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
