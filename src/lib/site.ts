import { party, type Member } from "@/data/party";

/** Public site address, e.g. https://newlesson.example.com (set NEXT_PUBLIC_SITE_URL). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/** true → tell search engines not to index (use on staging/test servers). */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "true";

export const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;

export const absoluteUrl = (path = "/") => new URL(path, `${SITE_URL}/`).toString();

export const pad = (n: number) => String(n).padStart(2, "0");

/** Removes the *accent* markers used in headings. */
export const plain = (value: string) => value.replace(/\*/g, "");

export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export const LAYOUTS = ["a", "b", "c", "d"] as const;
export const memberLayout = (m: Member, i: number) => m.layout ?? LAYOUTS[i % LAYOUTS.length];
export const memberAnchor = (i: number) => `member-${pad(i + 1)}`;
export const memberPath = (m: Member) => `/members/${m.slug}`;

export const findMember = (slug: string) => {
  const index = party.members.findIndex((m) => m.slug === slug);
  return index === -1 ? null : { member: party.members[index], index };
};

/** Social links that are real URLs (not "#"). */
export const realSocialUrls = () =>
  party.socials.map((s) => s.url).filter((u) => /^https?:\/\//.test(u));
