import type { MediaPath, Preview } from "./types";
import gallery from "./gallery.json";
import { modelLooks } from "./model";
import { emotes } from "./emotes";
import { screens } from "./screens";
import { merch } from "./merch";

/** Главный арт на первом экране. Формат — previews.hero (можно переопределить полем preview). */
export const heroArt: { src: MediaPath; preview?: Preview } = {
  src: "hero/missouri.png",
};

export type HomeCard = {
  href: string;
  title: string;
  text: string;
  /** Картинка карточки; по умолчанию берётся первая из соответствующего раздела */
  src: MediaPath;
  /** Переопределение формата превью только для этой карточки (общий формат — previews.homeCards) */
  preview?: Preview;
};

/** Карточки-переходы в разделы сайта («Загляни в уголок Missouri»). Первая — крупная. */
export const homeCards: HomeCard[] = [
  { href: "/gallery/", title: "Галерея артов", text: "Работы, нарисованные для Missouri", src: gallery[0].src },
  {
    href: "/authors/model/",
    title: "Модель и оверлей",
    text: "Образы модели в рамках стрима",
    src: modelLooks[0].src,
    preview: { position: "top" },
  },
  {
    href: "/authors/emotes/",
    title: "Смайлики и панели",
    text: "Эмоуты чата и панели канала",
    src: emotes[0].src,
    preview: { fit: "contain" },
  },
  { href: "/authors/screens/", title: "Заставки", text: "Начало, перерыв и конец стрима", src: screens[0].src },
  { href: "/merch/", title: "Мерч", text: "Фигурки, брелоки и другие милости", src: merch[0].images[0] },
];
