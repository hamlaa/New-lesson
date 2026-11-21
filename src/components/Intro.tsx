import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { party } from "@/data/party";
import { Plane } from "./Hero";
import { ScrubText, SplitHeading } from "./Text";

const d = (v: string) => ({ "--d": v }) as CSSProperties;

export function Intro() {
  const pillars = [
    { num: "01", title: "Philosophy", text: party.intro.philosophy },
    { num: "02", title: "Vision", text: party.intro.vision },
    { num: "03", title: "Mission", text: party.intro.mission },
  ];
  const phrases = party.intro.sloganMarquee.split("✦").map((s) => s.trim()).filter(Boolean);
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {[...phrases, ...phrases].map((p, i) => (
        <Fragment key={i}>
          <span className={i % 2 ? "serif" : undefined}>{p}</span>
          <span className="star">✦</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <section className="intro" id="about" aria-labelledby="intro-title">
      <div className="intro__deco" aria-hidden="true">
        <span className="deco-circle deco-circle--1" data-parallax="-0.12" />
        <span className="deco-ring deco-ring--1" data-parallax="0.1" />
        <span className="deco-dots" data-parallax="-0.06" />
        <svg className="deco-squiggle" viewBox="0 0 200 60" data-parallax="-0.18">
          <path d="M4 40c20-30 40-30 60 0s40 30 60 0 40-30 72-6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <Plane className="plane--intro" parallax="-0.3" fill="#69BDF5" fold="#4fa6e3" />
      </div>

      <div className="container">
        <p className="kicker" data-reveal><span className="kicker__line" aria-hidden="true" />{party.intro.kicker}</p>
        <SplitHeading className="intro__title" id="intro-title" text={party.intro.title} />

        <div className="intro__grid">
          <div>
            <ScrubText className="intro__statement" text={party.intro.statement} />
            <p className="intro__thai" lang="th" data-reveal>{party.intro.statementThai}</p>
          </div>

          <aside className="party-card" data-reveal="right" aria-label="Party card">
            <div className="party-card__top">
              <Image className="party-card__logo" src={party.logo} alt={`${party.partyName} party logo`} width={88} height={88} />
              <div>
                <p className="party-card__name">{party.partyName}</p>
                <p className="party-card__thai" lang="th">{party.partyNameThai}</p>
              </div>
            </div>
            <p className="party-card__slogan">{party.slogan}</p>
            <dl className="party-stats">
              <div><dt>Candidates</dt><dd data-count>{party.members.length}</dd></div>
              <div><dt>Policies</dt><dd data-count>{party.policies.length}</dd></div>
              <div><dt>Ballot No.</dt><dd>{party.ballotNumber}</dd></div>
            </dl>
          </aside>
        </div>

        <div className="pillars">
          {pillars.map((p, i) => (
            <article key={p.num} className={`pillar${i === 1 ? " pillar--offset" : ""}`} data-reveal style={d(`${i * 0.12}s`)}>
              <span className="pillar__num" aria-hidden="true">{p.num}</span>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__text">{p.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="marquee" role="img" aria-label={phrases.join(". ")}>
        <div className="marquee__track">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </section>
  );
}
