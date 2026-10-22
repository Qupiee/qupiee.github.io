import type { DonationLink, SocialLink } from "./types";

export const site = {
  name: "Ai Missouri",
  shortName: "Missouri",
  title: "Ai Missouri — милая демоница-витубер на Twitch",
  description:
    "Официальный сайт Ai Missouri — витубера и стримера на Twitch. Милая демоница, которая любит уют, игры и свой чат. Соцсети, арты, смайлики, оверлеи и мерч.",
  tagline: "Милая демоница, которая любит уют, игры и свой чат",
  about: [
    "Привет! Я Ai Missouri — маленькая демоница, сбежавшая из преисподней туда, где есть пледы, какао и уютный чат.",
    "На стримах играю, болтаю и устраиваю тёплые вечера. Заглядывай — для тебя всегда найдётся место у камина ♡",
  ],
  traits: ["уют", "игры", "чат", "демонические рожки"],
  keywords: ["Ai Missouri", "витубер", "vtuber", "стример", "Twitch", "демоница", "арты", "мерч"],
} as const;

export const socials: SocialLink[] = [
  { id: "twitch", label: "Twitch", handle: "ai_missouri", url: "https://www.twitch.tv/ai_missouri", hint: "Стримы" },
  { id: "youtube", label: "YouTube", handle: "@Ai_Missouri", url: "https://www.youtube.com/@Ai_Missouri", hint: "Записи и нарезки" },
  { id: "telegram", label: "Telegram", handle: "Ai_Missouri", url: "https://t.me/Ai_Missouri", hint: "Анонсы и новости" },
  { id: "vk", label: "ВКонтакте", handle: "ai_missouri", url: "https://vk.ru/ai_missouri", hint: "Группа" },
  { id: "discord", label: "Discord", handle: "сервер сообщества", url: "https://discord.com/invite/YH2qumquMh", hint: "Общение с чатом" },
  { id: "boosty", label: "Boosty", handle: "ai_missouri", url: "https://boosty.to/ai_missouri", hint: "Эксклюзивы" },
];

export const twitch = socials[0];

export const donations: DonationLink[] = [
  { id: "donationalerts", label: "DonationAlerts", url: "https://www.donationalerts.com/r/ai_missouri", hint: "Донат с сообщением на стриме" },
  { id: "donatex", label: "DonateX", url: "https://donatex.gg/donate/ai_missouri", hint: "Донат с ответом от ИИ" },
  { id: "dalink", label: "DaLink", url: "https://dalink.to/ai_missouri", hint: "Донат вне стримов" },
  { id: "boosty", label: "Boosty", url: "https://boosty.to/ai_missouri/donate", hint: "Донат через Бусти" },
  { id: "fetta", label: "Fetta", url: "https://fetta.app/u/ai_missouri", hint: "Подарочки" },
];

export type NavItem = { href: string; label: string; description?: string };

/** Страницы раздела «Авторы» (выпадающее меню). */
export const authorsNav: NavItem[] = [
  { href: "/authors/model/", label: "Модель и оверлей", description: "Образы модели внутри рамок оверлея" },
  { href: "/authors/emotes/", label: "Смайлики и панели", description: "Эмоуты чата и панели описания канала" },
  { href: "/authors/screens/", label: "Заставки", description: "Экраны начала, перерыва и конца стрима" },
];

/** Главное меню. Страница донатов намеренно отсутствует. */
export const mainNav: (NavItem & { children?: NavItem[] })[] = [
  { href: "/", label: "Главная" },
  { href: "/authors/", label: "Авторы", children: authorsNav },
  { href: "/gallery/", label: "Галерея" },
  { href: "/merch/", label: "Мерч" },
];
