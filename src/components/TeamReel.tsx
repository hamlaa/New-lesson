import { party } from "@/data/party";
import { memberAnchor } from "@/lib/site";
import { Icon } from "./Icon";
import { ReelPhoto } from "./ReelPhoto";

/**
 * Horizontal "film strip" of all candidates. With motion it is pinned and
 * scrolls sideways as you scroll down (see Cinematics); otherwise it is a
 * normal swipeable row. Each card jumps to the full member section.
 */
export function TeamReel() {
  const total = party.members.length;
  return (
    <div className="reel" aria-label="Candidates">
      <div className="reel__bar container" aria-hidden="true">
        <span className="reel__count"><b className="reel__current">01</b> / {String(total).padStart(2, "0")}</span>
        <span className="reel__progress"><i /></span>
        <span className="reel__hint">Scroll <Icon name="arrow" /></span>
      </div>
      <ol className="reel__track">
        {party.members.map((m, i) => (
          <li className="reel__item" key={m.slug}>
            <a className="reel-card" href={`#${memberAnchor(i)}`} data-cursor="Meet">
              <span className="reel-card__media">
                <ReelPhoto src={m.image} name={m.name} />
              </span>
              <span className="reel-card__num" aria-hidden="true">{m.number}</span>
              <span className="reel-card__body">
                <span className="reel-card__pos">{m.position}</span>
                <span className="reel-card__name">{m.name}</span>
                {m.nickname && <span className="reel-card__nick">“{m.nickname}”</span>}
              </span>
            </a>
          </li>
        ))}
        <li className="reel__item reel__item--end" aria-hidden="true">
          <span className="reel__end">
            <span>One team.</span>
            <em>One lesson at a time.</em>
          </span>
        </li>
      </ol>
    </div>
  );
}
