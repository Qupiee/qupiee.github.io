import type { CSSProperties } from "react";
import type { Preview } from "@/content/types";
import type { Media } from "./media";

/** Готовые настройки превью: все поля заполнены. Модуль без доступа к ФС — годится и для клиента. */
export type ResolvedPreview = Required<Preview>;

const DEFAULTS: ResolvedPreview = { aspect: "1/1", fit: "cover", position: "center" };

/** Настройки раздела + переопределение конкретной картинки. */
export function resolvePreview(section: Preview, override?: Preview): ResolvedPreview {
  return { ...DEFAULTS, ...section, ...override };
}

/** Стиль контейнера плитки: соотношение сторон ("auto" — как у самого изображения). */
export function aspectStyle(p: Pick<Preview, "aspect">, media: Pick<Media, "width" | "height">): CSSProperties {
  const ratio = !p.aspect || p.aspect === "auto" ? `${media.width} / ${media.height}` : p.aspect.replace("/", " / ");
  return { aspectRatio: ratio };
}
