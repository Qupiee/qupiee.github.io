import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, absoluteUrl } from "@/lib/env";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/support/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
