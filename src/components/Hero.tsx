import type { CSSProperties } from "react";
import { party } from "@/data/party";
import { HeroPlay } from "./HeroPlay";
import { HeroScene } from "./HeroScene";
import { SplitHeading } from "./Text";

const d = (v: string) => ({ "--d": v }) as CSSProperties;

/**
 * Hero: layered sea & sky illustration (HeroScene) with centred content:
 * headline → sub-headline → pill CTA → play button, plus an anchor link
 * at the bottom. All text is server-rendered for SEO.
 */
export function Hero() {
  const { hero } = party;
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <HeroScene />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__content">
        <SplitHeading as="h1" className="hero__title" id="hero-title" text={hero.headline} />
        <p className="hero__subtitle" data-reveal style={d(".35s")}>
          {hero.subheadline}
          <span className="hero__subtitle-th" lang="th">
            <span>{party.partyNameThai} · {party.schoolNameThai}</span>{" "}
            <span className="hero__slogan-th">{party.sloganThai}</span>
          </span>
        </p>
        <a className="hero__cta" href={hero.ctaLink} data-reveal style={d(".55s")}>
          {hero.ctaLabel}
        </a>
        <HeroPlay videoUrl={hero.videoUrl} label={hero.playLabel} fallbackHref="#team" />
      </div>

      <a className="hero__anchor" href={hero.anchorLink} data-reveal="fade" style={d("1s")}>
        {hero.anchorLabel}<span className="nav-split__cursor" aria-hidden="true"> _</span>
      </a>
    </section>
  );
}
