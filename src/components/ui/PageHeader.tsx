import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Sparkle } from "@/components/icons";
import { breadcrumbLd, type Crumb } from "@/lib/seo";

type Props = {
  title: string;
  lead?: ReactNode;
  /** Цепочка хлебных крошек без «Главной» — она добавляется автоматически */
  crumbs: Crumb[];
  children?: ReactNode;
};

/** Заголовок внутренней страницы: хлебные крошки (+ JSON-LD), H1 и вводный текст. */
export function PageHeader({ title, lead, crumbs, children }: Props) {
  const all = [{ name: "Главная", path: "/" }, ...crumbs];
  return (
    <header className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 sm:pt-14">
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Хлебные крошки" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-blush-300">✦</span>}
              {i < all.length - 1 ? (
                <Link href={c.path} className="transition hover:text-azure-600">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="font-semibold text-azure-700">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="flex items-center gap-3 text-4xl sm:text-5xl">
        {title}
        <Sparkle size={26} className="shrink-0 animate-twinkle text-blush-300" />
      </h1>
      {lead && <div className="mt-4 max-w-2xl text-lg text-ink-soft">{lead}</div>}
      {children}
    </header>
  );
}
