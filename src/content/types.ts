import type { BrandIcon } from "@/components/icons/brand-icons";

/** Автор (художник, риггер, дизайнер) с гиперссылкой на одну соцсеть. */
export type Credit = {
  name: string;
  url?: string;
  /** Чем занимался автор: «Арт модели», «Риг», «Оверлей»… */
  role?: string;
};

export type SocialLink = {
  id: BrandIcon;
  label: string;
  handle: string;
  url: string;
  /** Короткий призыв на карточке */
  hint: string;
};

export type DonationLink = {
  id: string;
  label: string;
  url: string;
  hint: string;
};

/** Путь к исходнику относительно assets/media, например "gallery/art-01.png". */
export type MediaPath = string;

/**
 * Как изображение показывается в превью (плитке, миниатюре, окне оверлея).
 * Общие настройки разделов — в src/content/previews.ts; у любой записи можно переопределить их полем `preview`.
 */
export type Preview = {
  /**
   * Соотношение сторон плитки «ширина/высота»: "16/9", "4/3", "1/1", "3/4", "5/8"…
   * "auto" — как у самого изображения (плитки в ряду будут разной высоты).
   */
  aspect?: string;
  /** "cover" — заполнить плитку и обрезать лишнее; "contain" — показать изображение целиком, с полями */
  fit?: "cover" | "contain";
  /**
   * Какая часть видна при обрезке (только для "cover"), как CSS object-position:
   * "center", "top", "bottom", "left", "right", "50% 20%" (20% — ближе к верху)…
   */
  position?: string;
};

/** Запись галереи артов (src/content/gallery.json). */
export type GalleryEntry = {
  src: MediaPath;
  author: string;
  link: string | null;
  /** Описание для alt и подписи в просмотрщике (необязательно). */
  title?: string;
  /** Переопределение превью только для этого арта */
  preview?: Preview;
};

export type ModelLook = {
  id: string;
  name: string;
  src: MediaPath;
  /** Переопределение превью только для этого образа (сетка, миниатюра и окно оверлея) */
  preview?: Preview;
};

export type Overlay = {
  id: string;
  name: string;
  src: MediaPath;
  /** Прозрачное «окно» в рамке, в процентах от размеров оверлея 16:9. */
  window: { x: number; y: number; w: number; h: number };
};

export type NamedMedia = {
  name: string;
  src: MediaPath;
  /** Переопределение превью только для этой картинки */
  preview?: Preview;
};

export type MerchStatus = "available" | "preorder" | "soon" | "sold-out";

export type MerchItem = {
  id: string;
  title: string;
  /** Цена в рублях; null — цена ещё не объявлена */
  price: number | null;
  status: MerchStatus;
  /** Абзацы текста-легенды */
  description: string[];
  details?: { label: string; value: string }[];
  images: MediaPath[];
  credits?: Credit[];
  /** Переопределение превью для фото этой позиции */
  preview?: Preview;
};
