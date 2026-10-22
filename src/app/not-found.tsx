import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Horns } from "@/components/icons";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-16 text-center sm:pt-24">
      <div className="card p-10">
        <span className="mx-auto mb-4 grid size-20 animate-float place-items-center rounded-full bg-linear-to-br from-blush-200 to-blush-300 text-blush-500 shadow-glow-pink">
          <Horns size={44} />
        </span>
        <p className="font-display text-7xl font-bold text-chrome">404</p>
        <h1 className="mt-3 text-2xl">Ой, демоница потеряла эту страницу</h1>
        <p className="mt-3 text-ink-soft">Возможно, её унесли в преисподнюю. Но на главной всё ещё уютно!</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Heart size={16} /> На главную
          </Link>
          <Link href="/gallery/" className="btn-ghost">
            В галерею
          </Link>
        </div>
      </div>
    </div>
  );
}
