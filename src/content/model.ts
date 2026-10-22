import type { Credit, ModelLook, Overlay } from "./types";

/** Образы (референсы) модели. Новый образ — новая запись + файл в assets/media/model. */
export const modelLooks: ModelLook[] = [
  { id: "classic", name: "Классический образ", src: "model/look-1.png" },
  { id: "cozy", name: "Чиби образ", src: "model/look-2.png" },
  { id: "festive", name: "Референс лист", src: "model/look-3.png" },
];

/**
 * Оверлеи. window — прозрачная область рамки в процентах (x, y — левый верхний угол),
 * в неё на сайте подставляется выбранный образ модели.
 */
export const overlays: Overlay[] = [
  { id: "game", name: "Игровой", src: "overlays/overlay-1.png", window: { x: 3, y: 5, w: 70, h: 78 } },
  { id: "chatting", name: "Общение", src: "overlays/overlay-2.png", window: { x: 8, y: 9, w: 84, h: 72 } },
  { id: "wide", name: "Широкий", src: "overlays/overlay-3.png", window: { x: 27, y: 6, w: 70, h: 80 } },
];

export const modelCredits: Credit[] = [
  { name: "Художник модели", url: "https://example.com/model-artist", role: "Арт модели" },
  { name: "Риггер", url: "https://example.com/rigger", role: "Риг" },
];

export const overlayCredits: Credit[] = [{ name: "Дизайнер оверлея", url: "https://example.com/overlay", role: "Оверлей" }];
