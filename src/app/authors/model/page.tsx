import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { AuthorsTabs } from "@/components/authors/AuthorsTabs";
import { OverlayStage } from "@/components/authors/OverlayStage";
import { LightboxGrid } from "@/components/media/LightboxGrid";
import { modelCredits, modelLooks, overlayCredits, overlays } from "@/content/model";
import { previews } from "@/content/previews";
import { getMedia } from "@/lib/media";
import { resolvePreview } from "@/lib/preview";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Модель и оверлей",
  description: "Референсы модели Ai Missouri и оверлеи стрима: авторы и примерка образов внутри рамок.",
  path: "/authors/model/",
});

export default function ModelPage() {
  const looks = modelLooks.map((l) => ({
    id: l.id,
    name: l.name,
    media: getMedia(l.src, `Референс модели: ${l.name}`),
    grid: resolvePreview(previews.modelLooks, l.preview),
    stage: resolvePreview(previews.modelStage, l.preview),
    picker: resolvePreview(previews.modelPicker, l.preview),
  }));
  const frames = overlays.map((o) => ({
    id: o.id,
    name: o.name,
    window: o.window,
    media: getMedia(o.src, `Оверлей «${o.name}»`),
    preview: resolvePreview(previews.overlays),
  }));

  return (
    <>
      <PageHeader
        title="Модель и оверлей"
        crumbs={[
          { name: "Авторы", path: "/authors/" },
          { name: "Модель и оверлей", path: "/authors/model/" },
        ]}
        lead="Примерь любой образ Missouri в любую рамку стрима: выбери оверлей и образ ниже."
      >
        <AuthorsTabs current="/authors/model/" />
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <Section
          id="stage"
          title="Примерочная"
          description="Образ модели внутри рамки оверлея. Нажми на сцену, чтобы рассмотреть референс поближе."
          credits={[...modelCredits, ...overlayCredits]}
        >
          <OverlayStage looks={looks} overlays={frames} />
        </Section>

        <Section id="looks" title="Референсы модели" credits={modelCredits}>
          <LightboxGrid
            label="Референсы модели"
            items={looks.map((l) => ({ media: l.media, caption: l.name, preview: l.grid }))}
            gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            caption="name"
          />
        </Section>

        <Section id="overlays" title="Оверлеи" credits={overlayCredits}>
          <LightboxGrid
            label="Оверлеи"
            items={frames.map((f) => ({ media: f.media, caption: f.name, preview: f.preview }))}
            gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            tileClassName="bg-[repeating-conic-gradient(var(--color-silver-100)_0_25%,white_0_50%)] bg-size-[24px_24px]"
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            caption="name"
          />
        </Section>
      </div>
    </>
  );
}
