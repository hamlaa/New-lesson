import type { MetadataRoute } from "next";
import { absoluteUrl, NOINDEX, SITE_URL } from "@/lib/site";

/* → /robots.txt */
export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
