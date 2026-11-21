import Image from "next/image";
import type { CSSProperties } from "react";
import { party } from "@/data/party";
import { Icon } from "./Icon";
import { SplitHeading } from "./Text";

const d = (v: string) => ({ "--d": v }) as CSSProperties;

const Plane = ({ className, parallax, mouse, fill = "#fff", fold = "#d9eeff" }: {
  className: string; parallax: string; mouse?: string; fill?: string; fold?: string;
}) => (
  <svg className={`plane ${className}`} viewBox="0 0 64 64" data-parallax={parallax} data-mouse={mouse} aria-hidden="true">
    <path d="M60 6 4 28l20 7 7 21Z" fill={fill} />
    <path d="M60 6 24 35l7 21" fill={fold} />
  </svg>
);

export { Plane };

export function Hero() {
  const [cloudA, cloudB = cloudA] = party.cloudImages;
  const cue = party.hero.scrollLabel.toUpperCase();

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__scene" aria-hidden="true">
        <div className="hero__sky" data-parallax="0" data-mouse="8">
          <Image src={party.heroImage} alt="" fill preload fetchPriority="high" sizes="100vw" quality={75} />
        </div>
        <Image className="cloud cloud--a" src={cloudA} alt="" width={1200} height={480} sizes="75vw" data-parallax="0" data-mouse="18" />
        <Image className="cloud cloud--b" src={cloudB} alt="" width={900} height={360} sizes="60vw" data-parallax="0" data-mouse="26" />
        <div className="hero__wordmark" data-parallax="0" data-mouse="12">
          <span>
            {party.partyName.split(/\s+/).map((w, i) => (
              <span className="wm-word" key={i}>
                {w.split("").map((c, k) => <span className="wm-char" key={k}>{c}</span>)}{" "}
              </span>
            ))}
          </span>
        </div>
        <div className="hero__island" data-parallax="0" data-mouse="4">
          <Image src={party.heroForeground} alt="" fill sizes="100vw" />
        </div>
        <Image className="cloud cloud--c" src={cloudA} alt="" width={1200} height={480} sizes="90vw" data-parallax="0" data-mouse="40" />
        <Plane className="plane--1" parallax="0" mouse="30" />
        <Plane className="plane--2" parallax="0" mouse="22" />
        <span className="hero__glare" />
      </div>
      <div className="hero__flash" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__eyebrow" data-reveal style={d(".1s")}>
          <span className="chip chip--glass">
            <span lang="th">{party.schoolNameThai}</span>
            <span className="chip__dot" aria-hidden="true" />
            <span>{party.schoolName}</span>
          </span>
          <span className="hero__election">{party.hero.eyebrow}</span>
        </p>
        <SplitHeading as="h1" className="hero__title" id="hero-title" text={party.hero.headline} />
        <p className="hero__subtitle" data-reveal style={d(".55s")}>
          {party.hero.subtitle} <span lang="th" className="hero__subtitle-th">{party.sloganThai}</span>
        </p>
      </div>

      <a className="scroll-cue" href="#team" data-reveal="fade" style={d(".8s")} data-magnetic="0.4">
        <svg className="scroll-cue__ring" viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="cue-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
          <text>
            <textPath href="#cue-circle" textLength="285" lengthAdjust="spacing">{`${cue} • ${cue} • `}</textPath>
          </text>
        </svg>
        <span className="scroll-cue__arrow"><Icon name="arrowDown" /></span>
        <span className="scroll-cue__label">{party.hero.scrollLabel}</span>
      </a>

      <div className="ballot-badge" role="img" aria-label={`Ballot number ${party.ballotNumber}`}>
        <span className="ballot-badge__label" aria-hidden="true">Vote No.</span>
        <span className="ballot-badge__num" aria-hidden="true">{party.ballotNumber}</span>
      </div>
    </section>
  );
}
