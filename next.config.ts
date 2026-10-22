import type { NextConfig } from "next";

/**
 * Сайт полностью статический (SSG): один и тот же билд работает
 * и на GitHub Pages (прототип), и на Vercel Hobby.
 *
 * NEXT_PUBLIC_BASE_PATH — префикс для GitHub Pages (например, "/missouri-site").
 * На Vercel и на собственном домене оставляется пустым.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  // Изображения оптимизируются заранее скриптом scripts/build-media.mjs,
  // поэтому встроенная оптимизация next/image не используется.
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
