import type { MetadataRoute } from "next";
import { party } from "@/data/party";

/* → /manifest.webmanifest ("Add to Home Screen" on phones) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${party.partyName} — ${party.schoolName}`,
    short_name: party.partyName,
    description: party.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: party.theme.background,
    theme_color: party.theme.primary,
    lang: "th",
    icons: [{ src: party.logo, sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
