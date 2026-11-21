"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Policy } from "@/data/party";
import { pad } from "@/lib/site";
import { Icon } from "./Icon";

/** Policy cards + category filter. All cards are in the server HTML (good for SEO). */
export function PolicyGrid({ policies }: { policies: Policy[] }) {
  const [filter, setFilter] = useState("*");
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  const categories = useMemo(() => [...new Set(policies.map((p) => p.category).filter(Boolean))], [policies]);
  const shown = (p: Policy) => filter === "*" || p.category === filter;

  // Replay the entrance animation for the cards that remain after filtering
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(gridRef.current?.querySelectorAll<HTMLElement>(".policy-card:not([hidden])") ?? []);
    cards.forEach((card, k) => {
      card.classList.remove("is-entering");
      void card.offsetWidth;
      card.style.setProperty("--k", String(k));
      card.classList.add("is-entering");
    });
  }, [filter]);

  const glow = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>(".policy-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  let visibleIndex = 0;
  const count = (c: string) => policies.filter((p) => p.category === c).length;

  return (
    <>
      {categories.length > 1 && (
        <div className="filters" role="group" aria-label="Filter policies by category" data-reveal>
          {["*", ...categories].map((c) => (
            <button
              key={c}
              className="filter"
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c === "*" ? "All" : c}
              <span className="filter__count">{c === "*" ? policies.length : count(c)}</span>
            </button>
          ))}
        </div>
      )}
      <div className="policy-grid" ref={gridRef} onPointerMove={glow}>
        {policies.map((p, i) => {
          const visible = shown(p);
          const offset = visible && visibleIndex++ % 3 === 1;
          return (
            <article
              key={p.title}
              className={`policy-card${offset ? " is-offset" : ""}`}
              hidden={!visible}
              data-reveal
              style={{ "--d": `${(i % 3) * 0.1}s` } as CSSProperties}
            >
              <div className="policy-card__top">
                <span className="policy-card__cat">{p.category}</span>
                <span className="policy-card__num">P–{pad(i + 1)}</span>
              </div>
              <div className="policy-card__icon" aria-hidden="true"><Icon name={p.icon} /></div>
              <h3 className="policy-card__title">{p.title}</h3>
              <p className="policy-card__desc">{p.description}</p>
              <span className="policy-card__bar" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </>
  );
}
