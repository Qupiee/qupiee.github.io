import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { AuthorsTabs } from "@/components/authors/AuthorsTabs";
import { LightboxGrid } from "@/components/media/LightboxGrid";
import { emoteCredits, emotes, panelCredits, panels } from "@/content/emotes";
import { previews } from "@/content/previews";
import { getMedia } from "@/lib/media";
import { resolvePreview } from "@/lib/preview";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Смайлики и панели",
  description: "Смайлики чата и панели описания Twitch-канала Ai Missouri с указанием авторов.",
  path: "/authors/emotes/",
});

export default function EmotesPage() {
  return (
    <>
      <PageHeader
        title="Смайлики и панели"
        crumbs={[
          { name: "Авторы", path: "/authors/" },
          { name: "Смайлики и панели", path: "/authors/emotes/" },
        ]}
        lead="Эмоуты, которыми общается чат, и панельки из описания канала на Twitch."
      >
        <AuthorsTabs current="/authors/emotes/" />
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <Section
          id="emotes"
          title="Смайлики чата"
          description="Нажми на смайлик, чтобы увидеть его в большом размере."
          credits={emoteCredits}
        >
          <LightboxGrid
            label="Смайлики чата"
            items={emotes.map((e) => ({
              media: getMedia(e.src, `Смайлик ${e.name}`),
              caption: e.name,
              preview: resolvePreview(previews.emotes, e.preview),
            }))}
            gridClassName="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-7"
            tileClassName="p-3"
            sizes="112px"
            caption="name"
          />
        </Section>

        <Section id="panels" title="Панели канала" description="Панели из раздела «О канале» на Twitch." credits={panelCredits}>
          <LightboxGrid
            label="Панели канала"
            items={panels.map((p) => ({
              media: getMedia(p.src, `Панель «${p.name}»`),
              caption: p.name,
              preview: resolvePreview(previews.panels, p.preview),
            }))}
            gridClassName="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3"
            sizes="320px"
            caption="name"
          />
        </Section>
      </div>
    </>
  );
}
