import Link from "next/link";
import type { CSSProperties } from "react";
import { party, type Member } from "@/data/party";
import { memberAnchor, memberLayout, memberPath } from "@/lib/site";
import { Icon } from "./Icon";
import { MemberPhoto } from "./MemberPhoto";

const s = (n: number) => ({ "--s": n }) as CSSProperties;

/** One full-screen member section. Used on the home page and on /members/[slug]. */
export function MemberSection({
  member: m,
  index,
  heading = "h3",
  profileLink = true,
  eager = false,
}: {
  member: Member;
  index: number;
  heading?: "h1" | "h2" | "h3";
  profileLink?: boolean;
  eager?: boolean;
}) {
  const Heading = heading;
  const id = memberAnchor(index);
  const layout = memberLayout(m, index);
  const [first, ...rest] = m.name.trim().split(/\s+/);
  const last = rest.join(" ");
  const roles = (m.responsibilities ?? []).filter(Boolean);

  return (
    <article className={`member member--${layout}`} id={id} aria-labelledby={`${id}-name`} data-member={index}>
      <div className="member__bg" aria-hidden="true">
        <span className="member__panel" />
        <span className="member__lines" />
        <span className="member__shape" data-parallax="-0.14" />
        <span className="member__num" data-parallax="0.24">{m.number}</span>
        <span className="member__ghost" data-parallax-x="0.32">{m.nickname || first}</span>
      </div>
      <div className="member__inner">
        <figure className="member__portrait" data-parallax="0.05">
          <MemberPhoto src={m.image} name={m.name} nickname={m.nickname} eager={eager} />
          <div className="member__badge" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <defs><path id={`badge-path-${index}`} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
              <text>
                <textPath href={`#badge-path-${index}`} textLength="236" lengthAdjust="spacing">
                  {`${party.partyName} • CANDIDATE • `}
                </textPath>
              </text>
            </svg>
            <span className="member__badge-num">{m.number}</span>
          </div>
        </figure>
        <div className="member__content">
          <div className="member__head">
            <p className="member__meta" data-stagger style={s(0)}>
              <span className="member__lesson">Lesson {m.number}</span>
              <span className="member__position">{m.position}</span>
            </p>
            <Heading className="member__name" id={`${id}-name`} data-stagger style={s(1)}>
              <span className="first">{first}</span>
              {last ? <> <span className="last">{last}</span></> : null}
            </Heading>
            {(m.nameThai || m.positionThai) && (
              <p className="member__thai" lang="th" data-stagger style={s(2)}>
                {m.nameThai}
                {m.nameThai && m.positionThai ? " · " : ""}
                {m.positionThai}
              </p>
            )}
            {m.nickname && (
              <p className="member__nick" data-stagger style={s(3)}>
                <small>Nickname</small>
                <span>{m.nickname}</span>
              </p>
            )}
          </div>
          <div className="member__body">
            {m.description && <p className="member__desc" data-stagger style={s(4)}>{m.description}</p>}
            {roles.length > 0 && (
              <div className="member__roles" data-stagger style={s(5)}>
                <p className="member__roles-title">Role &amp; Responsibilities</p>
                <ul>{roles.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
            {m.slogan && (
              <blockquote className="member__slogan" data-stagger style={s(6)}>
                <p>{m.slogan}</p>
              </blockquote>
            )}
            {profileLink && (
              <Link className="member__more" href={memberPath(m)} data-stagger style={s(7)}>
                Full profile of {m.nickname || first} <Icon name="arrow" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
