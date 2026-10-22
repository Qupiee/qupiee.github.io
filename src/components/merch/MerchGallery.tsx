"use client";

import { useState } from "react";
import { MediaView } from "@/components/media/MediaView";
import { useLightbox, type LightboxItem } from "@/components/media/Lightbox";
import { ZoomIn } from "@/components/icons";
import { aspectStyle, type ResolvedPreview } from "@/lib/preview";

/** Мини-галерея единицы мерча: крупное фото (формат — previews.merch) + миниатюры; клик по фото — полноэкранный просмотр. */
export function MerchGallery({ items, title, preview }: { items: LightboxItem[]; title: string; preview: ResolvedPreview }) {
  const [active, setActive] = useState(0);
  const { open, element } = useLightbox(items, title);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => open(active)}
        style={aspectStyle(preview, items[0].media)}
        className="group relative block w-full overflow-hidden rounded-3xl bg-linear-to-br from-white to-azure-50 shadow-soft ring-1 ring-white"
        aria-label={`Открыть фото «${title}» в полном размере`}
      >
        {items.map((it, i) => (
          <MediaView
            key={it.media.src}
            media={it.media}
            sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 100vw"
            fit={preview.fit}
            position={preview.position}
            className={`absolute inset-0 size-full transition duration-500 group-hover:scale-[1.03] ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-white/90 text-azure-600 shadow-soft transition group-hover:bg-blush-300 group-hover:text-white">
          <ZoomIn size={18} />
        </span>
      </button>

      {items.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label={`Фото: ${title}`}>
          {items.map((it, i) => (
            <button
              key={it.media.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Фото ${i + 1}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`size-16 overflow-hidden rounded-2xl ring-2 transition duration-200 ease-(--ease-bounce) sm:size-20 ${
                i === active ? "ring-blush-300" : "opacity-70 ring-transparent hover:-translate-y-0.5 hover:opacity-100"
              }`}
            >
              <MediaView media={it.media} sizes="80px" position={preview.position} className="size-full" />
            </button>
          ))}
        </div>
      )}
      {element}
    </div>
  );
}
