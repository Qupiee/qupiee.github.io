import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brand, ChevronLeft, Gift, Heart } from "@/components/icons";
import { donations, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

// Страница не показывается в меню и не индексируется — на неё ведёт кнопка на главной.
export const metadata: Metadata = pageMetadata({
  title: "Поддержать",
  description: `Способы поддержать ${site.name}: DonationAlerts, DonateX, DaLink, Boosty, Fetta.`,
  path: "/support/",
  noindex: true,
});

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:pt-16">
      <Link href="/" className="btn-ghost mb-8 px-4 py-2">
        <ChevronLeft size={18} /> На главную
      </Link>

      <div className="card relative overflow-hidden p-8 text-center sm:p-12">
        <Heart size={160} className="pointer-events-none absolute -top-10 -right-10 rotate-12 text-blush-100" />
        <span className="relative mx-auto mb-5 grid size-20 animate-float place-items-center rounded-full bg-linear-to-br from-blush-200 to-blush-300 text-white shadow-glow-pink">
          <Heart size={40} />
        </span>
        <h1 className="relative text-4xl sm:text-5xl">Спасибо за поддержку!</h1>
        <div className="relative mx-auto mt-5 max-w-xl space-y-3 text-lg text-ink-soft">
          <p>Спасибо за вашу поддержку, это очень важно для меня ♡</p>
          <p>
            Каждый донат помогает мне оставаться сытой, чтобы радовать вас. Но даже просто сидеть в чате - уже огромная поддержка ♡
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {donations.map((d, i) => (
          <li key={d.id} className={i === donations.length - 1 && donations.length % 2 ? "sm:col-span-2" : ""}>
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex items-center gap-4 p-5 transition duration-300 ease-(--ease-bounce) hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-blush-100 to-blush-200 text-blush-500 transition group-hover:from-blush-300 group-hover:to-blush-400 group-hover:text-white">
                {d.id === "boosty" ? <Brand name="boosty" size={22} /> : <Gift size={22} />}
              </span>
              <span className="min-w-0">
                <span className="block font-display font-bold text-azure-800">{d.label}</span>
                <span className="block text-sm text-ink-soft">{d.hint}</span>
              </span>
              <ArrowRight className="ml-auto shrink-0 text-azure-300 transition group-hover:translate-x-1 group-hover:text-blush-400" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
