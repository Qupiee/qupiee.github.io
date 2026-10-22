import Link from "next/link";
import { authorsNav } from "@/content/site";

/** Переключатель между страницами раздела «Авторы». На телефоне вкладки переносятся, на широких экранах — единая полоса. */
export function AuthorsTabs({ current }: { current: string }) {
  return (
    <nav aria-label="Страницы раздела «Авторы»" className="mt-6">
      <ul className="flex flex-wrap gap-2 sm:inline-flex sm:flex-nowrap sm:gap-1 sm:rounded-full sm:border sm:border-white/80 sm:bg-white/60 sm:p-1 sm:shadow-soft sm:backdrop-blur">
        {authorsNav.map((n) => {
          const active = n.href === current;
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-full px-4 py-2 font-display text-sm font-bold whitespace-nowrap transition ${
                  active
                    ? "bg-linear-to-b from-azure-400 to-azure-600 text-white shadow-soft"
                    : "border border-white/80 bg-white/70 text-ink-soft hover:bg-azure-50 hover:text-azure-700 sm:border-transparent sm:bg-transparent"
                }`}
              >
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
