"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LightboxGrid } from "@/components/media/LightboxGrid";
import { Pagination } from "@/components/ui/Pagination";
import { Close, Search } from "@/components/icons";
import { PER_PAGE, pageHref } from "@/lib/gallery-paths";
import { withBase } from "@/lib/env";
import type { GalleryItem } from "@/lib/gallery";

type Props = {
  items: GalleryItem[];
  page: number;
  totalPages: number;
  authors: { name: string; count: number }[];
};

const GRID = "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5";
const SIZES = "(min-width: 1152px) 210px, (min-width: 1024px) 18vw, (min-width: 640px) 31vw, 48vw";

/**
 * Без поиска показывает статическую страницу галереи (её HTML уже отрендерен при сборке).
 * При поиске по автору подгружает индекс всех артов и листает результаты на клиенте.
 * Запрос хранится в адресе (?author=…), поэтому ссылкой на подборку можно поделиться.
 */
export function GalleryBrowser({ items, page, totalPages, authors }: Props) {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState<GalleryItem[] | null>(null);
  const [resultPage, setResultPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // восстановление запроса из адреса
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("author");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- адрес доступен только в браузере
    if (q) setQuery(q);
  }, []);

  const q = query.trim().toLowerCase();

  // ленивая загрузка индекса при первом поиске
  useEffect(() => {
    if (!q || all) return;
    let cancelled = false;
    fetch(withBase("/gallery-index.json"))
      .then((r) => r.json())
      .then((data: GalleryItem[]) => !cancelled && setAll(data))
      .catch(() => !cancelled && setAll([]));
    return () => {
      cancelled = true;
    };
  }, [q, all]);

  // синхронизация адреса
  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("author", query.trim());
    else url.searchParams.delete("author");
    window.history.replaceState(window.history.state, "", url);
  }, [q, query]);

  const results = useMemo(() => (q && all ? all.filter((i) => i.author.toLowerCase().includes(q)) : null), [q, all]);
  const resultPages = results ? Math.max(1, Math.ceil(results.length / PER_PAGE)) : 1;
  const shown = results ? results.slice((resultPage - 1) * PER_PAGE, resultPage * PER_PAGE) : items;

  const update = (v: string) => {
    setQuery(v);
    setResultPage(1);
  };
  const selectResultPage = (n: number) => {
    setResultPage(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="scroll-mt-28 space-y-8">
      {/* поиск по автору */}
      <div className="card space-y-4 p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Поиск по автору</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-azure-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => update(e.target.value)}
            placeholder="Найти арты автора…"
            list="gallery-authors"
            autoComplete="off"
            className="h-12 w-full rounded-full border-2 border-azure-100 bg-white pr-12 pl-12 font-semibold text-ink transition outline-none placeholder:font-normal placeholder:text-silver-400 focus:border-blush-300 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => update("")}
              aria-label="Сбросить поиск"
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition hover:bg-blush-100 hover:text-blush-500"
            >
              <Close size={18} />
            </button>
          )}
          <datalist id="gallery-authors">
            {authors.map((a) => (
              <option key={a.name} value={a.name} />
            ))}
          </datalist>
        </label>
        <ul className="flex flex-wrap gap-2" aria-label="Быстрый выбор автора">
          {authors.map((a) => {
            const active = q === a.name.toLowerCase();
            return (
              <li key={a.name}>
                <button
                  type="button"
                  onClick={() => update(active ? "" : a.name)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                    active
                      ? "border-blush-300 bg-blush-300 text-white"
                      : "border-azure-100 bg-white/80 text-azure-700 hover:border-blush-200 hover:bg-blush-100"
                  }`}
                >
                  {a.name} <span className={active ? "text-white/80" : "text-silver-400"}>{a.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {results && (
        <p className="text-center text-ink-soft" aria-live="polite">
          {results.length ? (
            <>
              Найдено артов: <b className="text-azure-700">{results.length}</b>
            </>
          ) : (
            "У этого автора пока нет артов в галерее ♡"
          )}
        </p>
      )}
      {q && !all && <p className="text-center text-ink-soft">Ищу…</p>}

      {shown.length > 0 && (
        <LightboxGrid
          key={results ? `q-${q}-${resultPage}` : `p-${page}`}
          label="Галерея артов"
          items={shown}
          gridClassName={GRID}
          sizes={SIZES}
          caption="credit"
        />
      )}

      {results ? (
        <Pagination page={resultPage} total={resultPages} onSelect={selectResultPage} />
      ) : (
        <Pagination page={page} total={totalPages} hrefFor={pageHref} />
      )}
    </div>
  );
}
