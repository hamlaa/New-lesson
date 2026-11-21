"use client";

import { useEffect, useState } from "react";
import { pad } from "@/lib/site";

type Item = { anchor: string; name: string; label: string };

/** Floating "03 / 06" indicator with dots to jump between members. */
export function MemberHud({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const articles = Array.from(document.querySelectorAll<HTMLElement>(".member[data-member]"));
    const active = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? active.add(e.target as HTMLElement) : active.delete(e.target as HTMLElement)));
        const first = [...active][0];
        setVisible(!!first);
        if (first) setCurrent(Number(first.dataset.member));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    articles.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  if (items.length < 2) return null;

  const go = (anchor: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(anchor)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <aside
      className={`member-hud${visible ? " is-visible" : ""}${items.length > 8 ? " is-many" : ""}`}
      aria-label="Member navigation"
    >
      <span className="member-hud__count" aria-live="polite">
        <b>{pad(current + 1)}</b>
        <small>/{pad(items.length)}</small>
      </span>
      <span className="member-hud__dots">
        {items.map((it, i) => (
          <button
            key={it.anchor}
            className="member-hud__dot"
            type="button"
            aria-label={`Go to ${it.name}`}
            aria-current={i === current ? "true" : "false"}
            onClick={() => go(it.anchor)}
          >
            <span>{it.label}</span>
          </button>
        ))}
      </span>
    </aside>
  );
}
