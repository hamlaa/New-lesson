import Image from "next/image";
import type { CSSProperties } from "react";
import { party } from "@/data/party";
import { Plane } from "./Hero";
import { Icon } from "./Icon";
import { PolicyGrid } from "./PolicyGrid";
import { Countdown } from "./motion/Countdown";
import { TeamReel } from "./TeamReel";
import { SplitHeading } from "./Text";

const d = (v: string) => ({ "--d": v }) as CSSProperties;

export function TeamHead() {
  return (
    <>
      <header className="team__head container">
        <div className="team__deco" aria-hidden="true">
          <span className="spark spark--3" data-parallax="-0.35">✦</span>
          <span className="deco-ring deco-ring--3" data-parallax="0.15" />
        </div>
        <p className="kicker" data-reveal><span className="kicker__line" aria-hidden="true" />{party.teamSection.kicker}</p>
        <div className="team__head-grid">
          <SplitHeading className="team__title" id="team-title" text={party.teamSection.title} />
          <p className="team__lead" data-reveal style={d(".2s")}>{party.teamSection.lead}</p>
        </div>
      </header>
      <TeamReel />
    </>
  );
}

export function Policies() {
  return (
    <section className="policies" id="policies" aria-labelledby="policies-title">
      <div className="policies__deco" aria-hidden="true">
        <span className="deco-ring deco-ring--2" data-parallax="0.12" />
        <span className="deco-circle deco-circle--2" data-parallax="-0.1" />
        <span className="spark spark--4" data-parallax="-0.3">✦</span>
        <span className="deco-blob deco-blob--2" data-parallax="0.2" />
      </div>
      <div className="container">
        <p className="kicker" data-reveal><span className="kicker__line" aria-hidden="true" />{party.policySection.kicker}</p>
        <div className="policies__head">
          <SplitHeading className="policies__title" id="policies-title" text={party.policySection.title} />
          <p className="policies__lead" data-reveal style={d(".2s")}>{party.policySection.lead}</p>
        </div>
        <PolicyGrid policies={party.policies} />
      </div>
    </section>
  );
}

export function Socials() {
  if (!party.socials.length) return null;
  return (
    <ul className="socials" aria-label="Social media" data-reveal style={d(".65s")}>
      {party.socials.map((s) => {
        const external = /^https?:\/\//.test(s.url);
        return (
          <li key={s.platform + s.label}>
            <a href={s.url || "#"} {...(external ? { target: "_blank", rel: "noopener noreferrer me" } : {})}>
              <span className="ico" aria-hidden="true"><Icon name={s.platform} /></span>
              <span>{s.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Closing({ ctaBase = "" }: { ctaBase?: string }) {
  const [cloudA, cloudB = cloudA] = party.cloudImages;
  const cta = party.closing.ctaLink.startsWith("#") ? `${ctaBase}${party.closing.ctaLink}` : party.closing.ctaLink;
  return (
    <section className="closing" id="vote" aria-labelledby="closing-title">
      <div className="closing__scene" aria-hidden="true">
        <span className="closing__sun" data-parallax="0.2" />
        <Image className="cloud cloud--d" src={cloudA} alt="" width={1200} height={480} sizes="80vw" data-parallax="0.25" />
        <Image className="cloud cloud--e" src={cloudB} alt="" width={900} height={360} sizes="60vw" data-parallax="-0.15" />
        <Image className="cloud cloud--f" src={cloudB} alt="" width={900} height={360} sizes="70vw" data-parallax="0.1" />
        <Plane className="plane--closing" parallax="-0.4" />
        <span className="closing__rays" />
        <span className="closing__ballot">{party.ballotNumber}</span>
      </div>
      <div className="container closing__inner">
        <p className="kicker kicker--center" data-reveal><span className="kicker__line" aria-hidden="true" />{party.closing.kicker}</p>
        <SplitHeading className="closing__title" id="closing-title" text={party.closing.headline} />
        <p className="closing__text" data-reveal style={d(".3s")}>{party.closing.text}</p>
        <div className="closing__cta" data-reveal style={d(".45s")}>
          {party.electionDateISO && (
            <Countdown dateISO={party.electionDateISO} label={party.closing.countdownLabel} doneText={party.closing.countdownDone} />
          )}
          <a className="btn btn--primary btn--xl" href={cta} data-magnetic="0.3" data-confetti data-cursor="Vote!">
            <span>{party.closing.ctaLabel}</span>
            <span className="btn__badge">No. {party.ballotNumber}</span>
          </a>
          <p className="closing__date">{party.electionDate}</p>
        </div>
        <div className="closing__brand" data-reveal style={d(".55s")}>
          <Image src={party.logo} alt="" width={64} height={64} />
          <div>
            <p className="closing__party">{party.partyName} <span lang="th">· {party.partyNameThai}</span></p>
            <p className="closing__school">{party.schoolName} · <span lang="th">{party.schoolNameThai}</span></p>
          </div>
        </div>
        <Socials />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>© {new Date().getFullYear()} {party.partyName} · {party.schoolName} · <span lang="th">{party.schoolNameThai}</span></p>
        <p className="site-footer__note">{party.footerNote}</p>
        <a className="site-footer__top" href="#top">Back to top <Icon name="arrowUp" /></a>
      </div>
    </footer>
  );
}
