import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MediaView } from "@/components/media/MediaView";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, Brand, Heart, Sparkle } from "@/components/icons";
import { site, socials, twitch } from "@/content/site";
import { heroArt, homeCards } from "@/content/home";
import { previews } from "@/content/previews";
import { getMedia } from "@/lib/media";
import { aspectStyle, resolvePreview } from "@/lib/preview";
import { pageMetadata, personLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ path: "/" });


export default function HomePage() {
  const hero = getMedia(heroArt.src, `${site.name} — арт витубера`);
  const heroPreview = resolvePreview(previews.hero, heroArt.preview);
  const cards = homeCards.map((c) => {
    const media = getMedia(c.src, c.title);
    const preview = resolvePreview(previews.homeCards, c.preview);
    return { ...c, media, preview, ratio: aspectStyle(preview, media).aspectRatio };
  });

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...personLd() }} />

      {/* ---------- первый экран ---------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 sm:pt-16 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div className="animate-pop-in">
          <p className="chip mb-5">
            <Sparkle size={14} className="text-blush-400" /> витубер · стримерша на Twitch
          </p>
          <h1 className="text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="text-chrome">{site.name}</span>
          </h1>
          <p className="mt-5 text-xl font-semibold text-azure-700">{site.tagline} ♡</p>
          <div className="mt-4 space-y-3 text-lg text-ink-soft">
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {/* <ul className="mt-6 flex flex-wrap gap-2" aria-label="Что любит Missouri">
            {site.traits.map((t) => (
              <li key={t} className="chip bg-blush-100/70 border-blush-200 text-blush-500">
                <Heart size={12} /> {t}
              </li>
            ))}
          </ul> */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={twitch.url} target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-3 text-base">
              <Brand name="twitch" size={18} /> Смотреть на Twitch
            </a>
            <Link href="/support/" className="btn-pink px-6 py-3 text-base">
              <Heart size={18} /> Поддержать
            </Link>
          </div>
        </div>

        {/* арт: формат задаётся в previews.hero */}
        <div className="relative mx-auto w-full max-w-md">
          <Sparkle size={40} className="absolute -top-4 -left-4 z-10 animate-twinkle text-blush-300" />
          <Sparkle size={26} className="absolute top-1/3 -right-2 z-10 sm:-right-5 animate-twinkle text-azure-300 [animation-delay:1s]" />
          <Heart size={30} className="absolute -bottom-3 left-8 z-10 animate-float text-blush-300" />
          <div className="animate-float rounded-5xl bg-linear-to-br from-white via-azure-100 to-blush-100 p-3 shadow-lift [animation-duration:8s]">
            <div
              style={aspectStyle(heroPreview, hero)}
              className="dotted overflow-hidden rounded-[1.4rem] border-white bg-linear-to-br from-white to-azure-50 p-0"
            >
              <MediaView
                media={hero}
                priority
                sizes="(min-width: 768px) 448px, 92vw"
                fit={heroPreview.fit}
                position={heroPreview.position}
                className="size-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- соцсети ---------- */}
      <section aria-labelledby="socials-title" className="mx-auto mt-20 max-w-6xl px-4">
        <h2 id="socials-title" className="mb-6 text-3xl">
          Где меня найти
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="card group flex items-center gap-3 p-3 transition duration-300 ease-(--ease-bounce) hover:-translate-y-1 hover:shadow-lift sm:gap-4 sm:p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-azure-100 to-azure-200 text-azure-600 transition group-hover:from-blush-100 group-hover:to-blush-200 group-hover:text-blush-500 sm:size-14">
                  <Brand name={s.id} size={24} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-bold text-azure-800">{s.label}</span>
                  <span className="block truncate text-sm text-ink-soft">{s.hint}</span>
                </span>
                <ArrowRight className="ml-auto hidden shrink-0 text-azure-300 transition group-hover:translate-x-1 group-hover:text-blush-400 sm:block" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- разделы сайта ---------- */}
      <section aria-labelledby="explore-title" className="mx-auto mt-20 max-w-6xl px-4">
        <h2 id="explore-title" className="mb-6 text-3xl">
          Загляни в уголок Missouri
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((e, i) => (
            <li key={e.href} className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
              <Link
                href={e.href}
                className="card group flex h-full flex-col overflow-hidden transition duration-300 ease-(--ease-bounce) hover:-translate-y-1 hover:shadow-lift"
              >
                {/* формат: previews.homeCards; крупная первая карточка на lg растягивается по высоте */}
                <div
                  style={{ "--ar": e.ratio } as CSSProperties}
                  className={`relative aspect-(--ar) overflow-hidden bg-linear-to-br from-white to-azure-50 ${
                    i === 0 ? "lg:aspect-auto lg:min-h-64 lg:flex-1" : ""
                  }`}
                >
                  <MediaView
                    media={e.media}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    fit={e.preview.fit}
                    position={e.preview.position}
                    className={`absolute inset-0 size-full transition duration-500 group-hover:scale-105 ${
                      e.preview.fit === "contain" ? "p-4" : ""
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <h3 className="text-lg">{e.title}</h3>
                    <p className="text-sm text-ink-soft">{e.text}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-azure-50 text-azure-600 transition group-hover:bg-blush-300 group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="card relative overflow-hidden bg-linear-to-br from-white/80 to-blush-100/80 p-8 text-center sm:p-12">
          <Heart size={120} className="pointer-events-none absolute -right-6 -bottom-8 rotate-12 text-blush-200/60" />
          <Sparkle size={60} className="pointer-events-none absolute top-6 left-6 text-azure-200" />
          <h2 className="relative text-3xl">Хочешь поддержать стримы?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-ink-soft">
            Каждый донат это большой вклад в поддержку меня. Спасибо!
          </p>
          <Link href="/support/" className="btn-pink relative mt-6 px-7 py-3 text-base">
            <Heart size={18} /> Способы поддержки
          </Link>
        </div>
      </section>
    </>
  );
}
