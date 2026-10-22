import { GalleryPageView, galleryMetadata } from "@/components/gallery/GalleryPageView";

export const metadata = galleryMetadata(1);

export default function GalleryFirstPage() {
  return <GalleryPageView page={1} />;
}
