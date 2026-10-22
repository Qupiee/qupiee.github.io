import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { AuthorsTabs } from "@/components/authors/AuthorsTabs";
import { LightboxGrid } from "@/components/media/LightboxGrid";
import { screenCredits, screens } from "@/content/screens";
import { previews } from "@/content/previews";
import { getMedia } from "@/lib/media";
import { resolvePreview } from "@/lib/preview";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Заставки стрима",
  description: "Загрузочные экраны стрима Ai Missouri (начало, перерыв и конец трансляции) и их авторы.",
  path: "/authors/screens/",
});

export default function ScreensPage() {
  return (
    <>
      <PageHeader
        title="Заставки"
        crumbs={[
          { name: "Авторы", path: "/authors/" },
          { name: "Заставки", path: "/authors/screens/" },
        ]}
        lead="То, что видит чат, пока Missouri заваривает какао перед стримом."
      >
        <AuthorsTabs current="/authors/screens/" />
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4">
        <Section id="screens" title="Загрузочные экраны" credits={screenCredits}>
          <LightboxGrid
            label="Заставки стрима"
            items={screens.map((s) => ({
              media: getMedia(s.src, `Заставка «${s.name}»`),
              caption: s.name,
              preview: resolvePreview(previews.screens, s.preview),
            }))}
            gridClassName="grid gap-4 md:grid-cols-2"
            sizes="(min-width: 768px) 540px, 100vw"
            caption="name"
          />
        </Section>
      </div>
    </>
  );
}
