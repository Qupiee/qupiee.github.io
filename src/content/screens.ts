import type { Credit, NamedMedia } from "./types";

/**
 * Заставки стрима (16:9). Поддерживаются изображения и видео (.webm/.mp4).
 * Для видео можно положить рядом постер: screens/start.poster.png
 */
export const screens: NamedMedia[] = [
  { name: "Начало стрима", src: "screens/start.png" },
  { name: "Перерыв", src: "screens/break.png" },
  { name: "Конец стрима", src: "screens/end.png" },
];

export const screenCredits: Credit[] = [{ name: "Автор заставок", url: "https://example.com/screens", role: "Заставки" }];
