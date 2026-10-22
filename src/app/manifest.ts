import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { withBase } from "@/lib/env";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "ru",
    start_url: withBase("/"),
    display: "standalone",
    background_color: "#eef1f7",
    theme_color: "#eef1f7",
    icons: [{ src: withBase("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
