import type { CSSProperties } from "react";
import type { Media } from "@/lib/media";

type Props = {
  media: Media;
  /** Атрибут sizes — какую ширину картинка занимает в макете (для выбора файла из srcset) */
  sizes: string;
  className?: string;
  fit?: "cover" | "contain";
  /** Какая часть видна при обрезке (CSS object-position), например "top" или "50% 20%" */
  position?: string;
  /** Для картинок первого экрана: без lazy-загрузки и с высоким приоритетом */
  priority?: boolean;
  /** Для видео в просмотрщике — показать элементы управления */
  controls?: boolean;
  draggable?: boolean;
};

/**
 * Единый способ вывода картинок и видео на сайте.
 * Размеры (width/height) всегда заданы — браузер заранее резервирует место и вёрстка не прыгает.
 */
export function MediaView({ media, sizes, className = "", fit = "cover", position, priority, controls, draggable = false }: Props) {
  const objectFit = fit === "cover" ? "object-cover" : "object-contain";

  if (media.kind === "video") {
    return (
      <video
        className={`${objectFit} ${className}`}
        style={position ? { objectPosition: position } : undefined}
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        aria-label={media.alt}
        autoPlay
        muted={!controls}
        loop
        playsInline
        controls={controls}
        preload={priority ? "auto" : "metadata"}
      />
    );
  }

  const style: CSSProperties = {
    ...(position && { objectPosition: position }),
    ...(media.blur &&
      fit === "cover" && { backgroundImage: `url(${media.blur})`, backgroundSize: "cover", backgroundPosition: "center" }),
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element -- изображения оптимизируются заранее скриптом
    <img
      className={`${objectFit} ${className}`}
      src={media.src}
      srcSet={media.srcSet || undefined}
      sizes={media.srcSet ? sizes : undefined}
      width={media.width}
      height={media.height}
      alt={media.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={draggable}
      style={style}
    />
  );
}
