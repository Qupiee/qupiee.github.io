import Link from "next/link";
import { ChevronLeft, ChevronRight } from "@/components/icons";

type Props = {
  page: number;
  total: number;
  /** Режим ссылок (статические страницы) */
  hrefFor?: (n: number) => string;
  /** Режим кнопок (результаты поиска на клиенте) */
  onSelect?: (n: number) => void;
};

/** Номера страниц с многоточиями: 1 … 4 5 6 … 10 */
function range(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function Pagination({ page, total, hrefFor, onSelect }: Props) {
  if (total <= 1) return null;

  const item = (n: number, children: React.ReactNode, label: string, extra = "") => {
    const cls = `grid h-11 min-w-11 place-items-center rounded-full px-3 font-display text-sm font-bold transition duration-200 ease-(--ease-bounce) ${extra}`;
    if (hrefFor)
      return (
        <Link href={hrefFor(n)} aria-label={label} aria-current={n === page && label.startsWith("Страница") ? "page" : undefined} className={cls}>
          {children}
        </Link>
      );
    return (
      <button type="button" onClick={() => onSelect?.(n)} aria-label={label} className={cls}>
        {children}
      </button>
    );
  };

  const navCls = "bg-white/80 text-azure-600 shadow-soft hover:-translate-y-0.5 hover:bg-white";

  return (
    <nav aria-label="Страницы галереи" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 && item(page - 1, <ChevronLeft size={20} />, "Предыдущая страница", navCls)}
      {range(page, total).map((n, i) =>
        n === "…" ? (
          <span key={`e${i}`} className="px-1 text-silver-400">
            …
          </span>
        ) : (
          <span key={n}>
            {item(
              n,
              n,
              `Страница ${n}`,
              n === page
                ? "bg-linear-to-b from-azure-400 to-azure-600 text-white shadow-soft pointer-events-none"
                : "bg-white/70 text-ink-soft hover:-translate-y-0.5 hover:bg-white hover:text-azure-700",
            )}
          </span>
        ),
      )}
      {page < total && item(page + 1, <ChevronRight size={20} />, "Следующая страница", navCls)}
    </nav>
  );
}
