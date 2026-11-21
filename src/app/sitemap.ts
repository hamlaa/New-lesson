import type { MetadataRoute } from "next";
import { party } from "@/data/party";
import { absoluteUrl, memberPath } from "@/lib/site";

/* → /sitemap.xml (pages + image sitemap, regenerated on every build) */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const img = (src?: string) => (src ? [absoluteUrl(src)] : []);
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: [...img(party.logo), ...img(party.heroImage), ...party.members.flatMap((m) => img(m.image))],
    },
    ...party.members.map((m) => ({
      url: absoluteUrl(memberPath(m)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: img(m.image),
    })),
  ];
}
