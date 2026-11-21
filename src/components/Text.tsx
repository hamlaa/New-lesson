import type { CSSProperties, ElementType, ReactNode } from "react";
import { plain } from "@/lib/site";

/** Splits "Hello *world*" into [{text:"Hello ", em:false}, {text:"world", em:true}]. */
function segments(value: string) {
  return value.split(/(\*[^*]+\*)/g).filter(Boolean).map((s) =>
    s.startsWith("*") && s.endsWith("*") ? { text: s.slice(1, -1), em: true } : { text: s, em: false },
  );
}

/** Text with *accent* words rendered as <em>. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {segments(text).map((s, i) => (s.em ? <em key={i}>{s.text}</em> : <span key={i}>{s.text}</span>))}
    </>
  );
}

/**
 * Heading whose words slide up one by one (rendered on the server, so the
 * full text is in the HTML for Google). Screen readers get the aria-label.
 */
export function SplitHeading({
  as: Tag = "h2",
  text,
  className,
  id,
  delay,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  id?: string;
  delay?: string;
}) {
  let i = 0;
  const words = (chunk: string): ReactNode[] =>
    chunk.split(/(\s+)/).filter(Boolean).map((part, k) =>
      /^\s+$/.test(part) ? (
        " "
      ) : (
        <span className="w" key={k}>
          <span className="w__i" style={{ "--i": i++ } as CSSProperties}>
            {part}
          </span>
        </span>
      ),
    );

  return (
    <Tag
      className={className}
      id={id}
      data-reveal="words"
      aria-label={plain(text)}
      style={delay ? ({ "--d": delay } as CSSProperties) : undefined}
    >
      {segments(text).map((s, k) => (s.em ? <em key={k}>{words(s.text)}</em> : <span key={k}>{words(s.text)}</span>))}
    </Tag>
  );
}

/** Paragraph whose words light up while scrolling (see MotionEngine). */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const list = text.trim().split(/\s+/);
  return (
    <p className={className} data-scrub>
      {list.map((w, i) => (
        <span key={i}>
          <span className="scrub-word">{w}</span>
          {i < list.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
