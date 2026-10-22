/** Префикс пути для GitHub Pages ("/missouri-site"); пустой на Vercel и своём домене. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Origin сайта без завершающего слэша — для canonical, sitemap и Open Graph. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-missouri.site").replace(/\/$/, "");

/** На прототипе (GitHub Pages) индексацию стоит выключить, чтобы он не конкурировал с основным доменом. */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

/**
 * Добавляет basePath к пути статического файла из /public.
 * Ссылки next/link получают basePath автоматически, а <img>, <video> и fetch — нет.
 */
export const withBase = (p: string) => `${BASE_PATH}${p}`;

/** Абсолютный URL страницы или файла. */
export const absoluteUrl = (p = "/") => `${SITE_URL}${BASE_PATH}${p}`;
