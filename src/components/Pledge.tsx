import type { CSSProperties } from "react";
import { party } from "@/data/party";
import { pad } from "@/lib/site";
import { Rich } from "./Text";

/**
 * "The council pledge" — giant pinned typography.
 * Lines slide in from alternating sides and fill with colour while scrolling
 * (see Cinematics). Without motion they are simply shown filled.
 */
export function Pledge() {
  const { pledge } = party;
  return (
    <section className="pledge" aria-labelledby="pledge-title">
      <div className="pledge__scene" aria-hidden="true">
        <span className="pledge__orb pledge__orb--1" />
        <span className="pledge__orb pledge__orb--2" />
        <span className="pledge__grid" />
        <span className="pledge__star pledge__star--1">✦</span>
        <span className="pledge__star pledge__star--2">✦</span>
        <span className="pledge__star pledge__star--3">✦</span>
      </div>
      <div className="pledge__inner">
        <h2 className="pledge__kicker" id="pledge-title">
          <span className="kicker__line" aria-hidden="true" />
          {pledge.kicker}
        </h2>
        <ol className="pledge__lines">
          {pledge.lines.map((l, i) => (
            <li className="pledge__line" key={l.text} style={{ "--i": i } as CSSProperties}>
              <span className="pledge__num" aria-hidden="true">{pad(i + 1)}</span>
              <span className="pledge__text"><Rich text={l.text} /></span>
              <span className="pledge__thai" lang="th">{l.thai}</span>
            </li>
          ))}
        </ol>
        <p className="pledge__vote" aria-hidden="true">
          <span>Vote</span> <b>{party.ballotNumber}</b>
        </p>
      </div>
    </section>
  );
}
