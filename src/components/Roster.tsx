import { getImageProps } from "next/image";
import { party } from "@/data/party";
import { memberAnchor } from "@/lib/site";
import { Icon } from "./Icon";

/** Team "table of contents". Each row jumps to the member section. */
export function Roster() {
  return (
    <ol className="roster" id="roster" aria-label="Party members">
      {party.members.map((m, i) => {
        // Pre-optimised thumbnail URL for the desktop hover preview
        const preview = m.image
          ? getImageProps({ src: m.image, alt: "", width: 420, height: 525 }).props.src
          : "";
        return (
          <li key={m.slug}>
            <a href={`#${memberAnchor(i)}`} data-preview={preview}>
              <span className="roster__num">{m.number}</span>
              <span className="roster__name">
                {m.name}
                {m.nickname ? <> <span className="roster__nick">“{m.nickname}”</span></> : null}
              </span>
              <span className="roster__pos">{m.position}</span>
              <span className="roster__arrow" aria-hidden="true"><Icon name="arrow" /></span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
