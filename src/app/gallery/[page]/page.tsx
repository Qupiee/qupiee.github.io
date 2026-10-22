import { notFound } from "next/navigation";
import { GalleryPageView, galleryMetadata } from "@/components/gallery/GalleryPageView";
import { totalPages } from "@/lib/gallery";

// Все страницы генерируются при сборке; неизвестные номера → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  // страница 1 живёт по адресу /gallery/, чтобы не было дубля
  return Array.from({ length: totalPages() - 1 }, (_, i) => ({ page: String(i + 2) }));
}

function parse(raw: string) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 2 || n > totalPages()) notFound();
  return n;
}

export async function generateMetadata({ params }: PageProps<"/gallery/[page]">) {
  return galleryMetadata(parse((await params).page));
}

export default async function GalleryPage({ params }: PageProps<"/gallery/[page]">) {
  return <GalleryPageView page={parse((await params).page)} />;
}
