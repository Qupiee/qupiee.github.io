"use client";

import { useState } from "react";
import type { Media } from "@/lib/media";
import type { Overlay } from "@/content/types";
import { MediaView } from "@/components/media/MediaView";
import { useLightbox } from "@/components/media/Lightbox";
import { ZoomIn } from "@/components/icons";
import { aspectStyle, type ResolvedPreview } from "@/lib/preview";

/** grid / stage / picker — превью образа в сетке, в окне оверлея и в миниатюре (src/content/previews.ts) */
type Look = { id: string; name: string; media: Media; grid: ResolvedPreview; stage: ResolvedPreview; picker: ResolvedPreview };
type Frame = Pick<Overlay, "id" | "name" | "window"> & { media: Media; preview: ResolvedPreview };

/**
 * Сцена 16:9: выбранный образ модели показывается внутри прозрачного «окна» выбранного оверлея.
 * Клик по сцене открывает полноразмерные референсы с перелистыванием.
 */
export function OverlayStage({ looks, overlays }: { looks: Look[]; overlays: Frame[] }) {
  const [lookIdx, setLookIdx] = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const { open, element } = useLightbox(
    looks.map((l) => ({ media: l.media, caption: l.name, preview: l.grid })),
    "Референсы модели",
  );

  const frame = overlays[frameIdx];
  const { x, y, w, h } = frame.window;

  return (
    <div className="space-y-5">
      {/* сцена */}
      <button
        type="button"
        onClick={() => open(lookIdx)}
        className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-azure-50 shadow-lift ring-1 ring-white"
        aria-label={`Открыть референс «${looks[lookIdx].name}» в полном размере`}
      >
        {/* образы модели — все в DOM, видимый плавно проявляется */}
        <div
          className="absolute overflow-hidden rounded-[2%] transition-all duration-500 ease-(--ease-bounce)"
          style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
        >
          {looks.map((l, i) => (
            <MediaView
              key={l.id}
              media={l.media}
              sizes="(min-width: 1152px) 800px, 80vw"
              fit={l.stage.fit}
              position={l.stage.position}
              className={`absolute inset-0 size-full transition duration-500 ${
                i === lookIdx ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
            />
          ))}
        </div>
        {/* рамки оверлея поверх */}
        {overlays.map((o, i) => (
          <MediaView
            key={o.id}
            media={o.media}
            sizes="(min-width: 1152px) 1100px, 100vw"
            fit="contain"
            priority={i === 0}
            className={`pointer-events-none absolute inset-0 size-full transition-opacity duration-500 ${
              i === frameIdx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-azure-700 shadow-soft transition group-hover:bg-blush-300 group-hover:text-white">
          <ZoomIn size={14} /> полный размер
        </span>
      </button>

      <div className="grid gap-5 md:grid-cols-2">
        <Picker
          label="Оверлей"
          items={overlays.map((o) => ({ ...o, thumb: o.preview }))}
          active={frameIdx}
          onSelect={setFrameIdx}
        />
        <Picker label="Образ модели" items={looks.map((l) => ({ ...l, thumb: l.picker }))} active={lookIdx} onSelect={setLookIdx} />
      </div>
      {element}
    </div>
  );
}

function Picker({
  label,
  items,
  active,
  onSelect,
}: {
  label: string;
  items: { id: string; name: string; media: Media; thumb: ResolvedPreview }[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    // min-w-0: у fieldset по умолчанию min-inline-size: min-content — без этого лента миниатюр распирает блок
    <fieldset className="dotted min-w-0 p-4">
      <legend className="px-2 font-display text-sm font-bold text-azure-700">{label}</legend>
      <div className="grid grid-cols-3 gap-2 p-1 sm:gap-3" role="radiogroup" aria-label={label}>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            role="radio"
            aria-checked={i === active}
            onClick={() => onSelect(i)}
            className={`min-w-0 rounded-2xl p-1 text-left sm:p-1.5 transition duration-300 ease-(--ease-bounce) ${
              i === active ? "bg-white shadow-soft ring-2 ring-blush-300" : "hover:-translate-y-0.5 hover:bg-white/70"
            }`}
          >
            <span style={aspectStyle(it.thumb, it.media)} className="block overflow-hidden rounded-xl bg-linear-to-br from-white to-azure-100">
              <MediaView media={it.media} sizes="160px" fit={it.thumb.fit} position={it.thumb.position} className="size-full" />
            </span>
            <span className="mt-1.5 block truncate px-1 text-xs font-bold text-azure-800">{it.name}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
