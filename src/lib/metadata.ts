import type { Metadata } from "next";
import { party } from "@/data/party";

/* Next.js replaces (does not merge) nested metadata objects, so every page
   spreads this base when it sets its own openGraph values. */
export const baseOpenGraph = {
  type: "website",
  locale: party.seo.locale,
  alternateLocale: ["en_US"],
  siteName: `${party.partyName} · ${party.schoolNameThai}`,
  title: party.seo.title,
  description: party.seo.description,
} satisfies NonNullable<Metadata["openGraph"]>;
