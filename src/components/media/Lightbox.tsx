"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { Media } from "@/lib/media";
import type { Credit } from "@/content/types";
import type { ResolvedPreview } from "@/lib/preview";
import { MediaView } from "./MediaView";
import { ChevronLeft, ChevronRight, Close } from "@/components/icons";
import { CreditLink } from "@/components/ui/CreditLink";

export type LightboxItem = {
  media: Media;
  caption?: string;
  credit?: Credit;
  /** Формат превью в сетке (на сам полноэкранный просмотр не влияет) */
  preview?: ResolvedPreview;
};

type Props = {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number | null) => void;
  /** Подпись блока, например «Галерея артов» — для скринридеров */
  label: string;
};

/**
 * Полноэкранный просмотр с перелистыванием в пределах своего блока.
 * Клавиатура: ← → Esc. На тач-экранах — свайп влево/вправо, свайп вниз закрывает.
 */
export function Lightbox({ items, index, onChange, label }: Props) {
  const open = index !== null;
  const count = items.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + count) % count);
    },
    [index, count, onChange],
  );
  const close = useCallback(() => onChange(null), [onChange]);

  // клавиатура, блокировка прокрутки, возврат фокуса
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = "";
      prevFocus?.focus?.();
    };
  }, [open, go, close]);

  // предзагрузка соседних изображений и прокрутка ленты миниатюр к активной
  useEffect(() => {
    if (index === null) return;
    for (const d of [1, -1]) {
      const m = items[(index + d + count) % count]?.media;
      if (m?.kind === "image") {
        const img = new Image();
        img.sizes = "100vw";
        img.srcset = m.srcSet;
        img.src = m.src;
      }
    }
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-i="${index}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index, items, count]);

  if (!open || typeof document === "undefined") return null;
  const item = items[index];

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!swipe.current) return;
    setDragX(e.clientX - swipe.current.x);
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!swipe.current) return;
    const dx = e.clientX - swipe.current.x;
    const dy = e.clientY - swipe.current.y;
    swipe.current = null;
    setDragX(0);
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && count > 1) go(dx < 0 ? 1 : -1);
    else if (dy > 100 && Math.abs(dy) > Math.abs(dx)) close();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${label}: просмотр, ${index + 1} из ${count}`}
      className="fixed inset-0 z-100 flex animate-fade-in flex-col bg-ink/85 text-white backdrop-blur-md"
    >
      {/* верхняя панель */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <span className="rounded-full bg-white/10 px-3 py-1 font-display text-sm font-bold tabular-nums">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-blush-400"
          aria-label="Закрыть просмотр"
        >
          <Close />
        </button>
      </div>

      {/* сцена */}
      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onClick={(e) => e.target === e.currentTarget && close()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current = null;
          setDragX(0);
        }}
      >
        <div
          key={index}
          className="flex h-full max-h-full w-full animate-pop-in items-center justify-center"
          style={{ transform: dragX ? `translateX(${dragX}px)` : undefined, transition: dragX ? "none" : undefined }}
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <MediaView
            media={item.media}
            sizes="100vw"
            fit="contain"
            priority
            controls
            className="h-auto max-h-full w-auto max-w-full rounded-2xl shadow-2xl"
          />
        </div>

        {count > 1 && (
          <>
            <NavButton side="left" onClick={() => go(-1)} />
            <NavButton side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      {/* подпись и миниатюры */}
      <div className="space-y-3 px-4 pt-3 pb-4 sm:px-6">
        {(item.caption || item.credit) && (
          <p className="text-center text-sm sm:text-base">
            {item.caption && <span className="font-display font-bold">{item.caption}</span>}
            {item.caption && item.credit && <span className="mx-2 text-blush-300">♡</span>}
            {item.credit && (
              <span className="text-white/80">
                автор: <CreditLink credit={item.credit} tone="light" />
              </span>
            )}
          </p>
        )}
        {count > 1 && (
          <div ref={thumbsRef} className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none]">
            {items.map((it, i) => (
              <button
                key={i}
                data-i={i}
                type="button"
                onClick={() => onChange(i)}
                aria-label={`Показать ${i + 1}`}
                aria-current={i === index}
                className={`relative size-14 shrink-0 overflow-hidden rounded-xl border-2 transition sm:size-16 ${
                  i === index ? "border-blush-300 opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                }`}
              >
                {it.media.kind === "image" ? (
                  <MediaView media={it.media} sizes="64px" className="size-full" />
                ) : (
                  <span className="grid size-full place-items-center bg-azure-700 text-xs">видео</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Предыдущее изображение" : "Следующее изображение"}
      className={`absolute top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 transition hover:scale-110 hover:bg-blush-400 sm:grid ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      {side === "left" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

/** Хук для блока с картинками: состояние открытого индекса + готовый элемент просмотрщика. */
export function useLightbox(items: LightboxItem[], label: string) {
  const [index, setIndex] = useState<number | null>(null);
  return {
    open: setIndex,
    element: <Lightbox items={items} index={index} onChange={setIndex} label={label} />,
  };
}
