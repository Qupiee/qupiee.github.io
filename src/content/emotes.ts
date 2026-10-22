import type { Credit, NamedMedia } from "./types";

/** Смайлики чата. name — код эмоута в чате Twitch. */
export const emotes: NamedMedia[] = Array.from({ length: 14 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { name: `aimiss${n}`, src: `emotes/emote-${n}.png` };
});

export const emoteCredits: Credit[] = [
  { name: "Художник смайликов", url: "https://example.com/emotes-1", role: "Смайлики" },
  { name: "Художник смайликов", url: "https://example.com/emotes-2", role: "Анимированные смайлики" },
];

/** Панели описания канала на Twitch (320 px в ширину). */
export const panels: NamedMedia[] = [
  { name: "Обо мне", src: "panels/about.png" },
  { name: "Правила чата", src: "panels/rules.png" },
  { name: "Смайлики", src: "panels/schedule.png" },
  { name: "Поддержка", src: "panels/donate.png" },
  { name: "Фетта", src: "panels/socials.png" },
  { name: "Компьютер", src: "panels/pc.png" },
];

export const panelCredits: Credit[] = [{ name: "Художник панелей", url: "https://example.com/panels", role: "Панели" }];
