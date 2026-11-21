import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import { party } from "@/data/party";
import { baseOpenGraph } from "@/lib/metadata";
import { GOOGLE_VERIFICATION, NOINDEX, SITE_URL } from "@/lib/site";
import "lenis/dist/lenis.css";
import "@/styles/style.css";
import "@/styles/responsive.css";
import "@/styles/pages.css";
import "@/styles/motion.css";
import { Loader } from "@/components/motion/Loader";
import { PageTransition } from "@/components/motion/PageTransition";
import { Pointer } from "@/components/motion/Pointer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/* Self-hosted fonts: preloaded, no layout shift, no Google Fonts request */
const display = localFont({
  src: "../fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-italic-latin.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});
const thai = localFont({
  src: "../fonts/noto-sans-thai-thai.woff2",
  variable: "--font-noto-thai",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: party.seo.title, template: party.seo.titleTemplate },
  description: party.seo.description,
  keywords: party.seo.keywords,
  applicationName: party.partyName,
  authors: [{ name: `${party.partyName} — ${party.schoolName}` }],
  creator: party.partyName,
  publisher: party.partyName,
  category: "education",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: baseOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: party.seo.title,
    description: party.seo.description,
  },
  robots: NOINDEX
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      },
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: party.theme.primary,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* Colours from src/data/party.ts → CSS variables */
const themeVars = {
  "--c-primary": party.theme.primary,
  "--c-secondary": party.theme.secondary,
  "--c-bg": party.theme.background,
  "--c-text": party.theme.text,
  "--c-accent": party.theme.accent,
} as CSSProperties;

/* Enables animations only when JS runs. Holds the page behind the intro loader
   (unless reduced motion is on). Failsafes: show everything if JS never starts. */
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)r.classList.add('is-loading');setTimeout(function(){if(!r.classList.contains('ready')){r.classList.add('reveal-all');r.classList.remove('is-loading')}},3000);setTimeout(function(){r.classList.remove('is-loading')},7000)})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${thai.variable}`}
      style={themeVars}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="scroll-progress" aria-hidden="true"><span /></div>
        <SmoothScroll />
        <Loader />
        {children}
        <PageTransition />
        <Pointer />
      </body>
    </html>
  );
}
