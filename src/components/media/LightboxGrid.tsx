"use client";

import { useLightbox, type LightboxItem } from "./Lightbox";
import { MediaView } from "./MediaView";
import { CreditLink } from "@/components/ui/CreditLink";
import { ZoomIn } from "@/components/icons";
import { aspectStyle } from "@/lib/preview";

type Props = {
  /** Формат каждой плитки берётся из item.preview (см. src/content/previews.ts) */
  items: LightboxItem[];
  /** Название блока (для скринридеров и заголовка просмотрщика) */
  label: string;
  /** Классы сетки, например "grid grid-cols-2 gap-4 sm:grid-cols-3" */
  gridClassName: string;
  /** Дополнительные классы плитки: фон, внутренние отступы */
  tileClassName?: string;
  /** sizes для srcset — ширина плитки в макете */
  sizes: string;
  /** Что показывать под плиткой */
  caption?: "credit" | "name" | "none";
};

/** Сетка изображений одного блока; клик открывает просмотр с перелистыванием внутри этого блока. */
export function LightboxGrid({ items, label, gridClassName, tileClassName = "", sizes, caption = "none" }: Props) {
  const { open, element } = useLightbox(items, label);

  return (
    <>
      <ul className={gridClassName} aria-label={label}>
        {items.map((item, i) => {
          const fit = item.preview?.fit ?? "cover";
          return (
            <li key={item.media.src + i} className="min-w-0">
              <figure className="group">
                <button
                  type="button"
                  onClick={() => open(i)}
                  style={aspectStyle(item.preview ?? {}, item.media)}
                  className={`relative block w-full overflow-hidden rounded-3xl shadow-soft ring-1 ring-white/80 transition duration-300 ease-(--ease-bounce) hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1 ${
                    fit === "contain" ? "bg-linear-to-br from-white to-azure-50" : "bg-white/60"
                  } ${tileClassName}`}
                  aria-label={`Открыть: ${item.caption ?? item.media.alt}`}
                >
                  <MediaView
                    media={item.media}
                    sizes={sizes}
                    fit={fit}
                    position={item.preview?.position}
                    className="size-full transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-azure-800/30 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span className="pointer-events-none absolute right-3 bottom-3 grid size-9 scale-75 place-items-center rounded-full bg-white/90 text-azure-600 opacity-0 shadow-soft transition group-hover:scale-100 group-hover:opacity-100">
                    <ZoomIn size={18} />
                  </span>
                </button>
                {caption !== "none" && (
                  <figcaption className="mt-2 truncate px-1 text-center text-sm text-ink-soft">
                    {caption === "name" && <span className="font-display font-bold text-azure-700">{item.caption}</span>}
                    {caption === "credit" && item.credit && (
                      <>
                        <span className="text-silver-500">автор: </span>
                        <CreditLink credit={item.credit} />
                      </>
                    )}
                  </figcaption>
                )}
              </figure>
            </li>
          );
        })}
      </ul>
      {element}
    </>
  );
}
