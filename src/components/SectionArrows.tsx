"use client";

import { useEffect, useState } from "react";

const TARGETS = "#top, #about, #team .team__head, .member[data-member], #policies, #vote";
const OFFSET = 0.3; // a section counts as "current" once its top passes 30% of the viewport

/** Up / down section controls on the middle-right edge of the screen. */
export function SectionArrows() {
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setAtStart(y < 8);
      setAtEnd(y > max - 8);
      setPastHero(y > window.innerHeight * 0.6);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const list = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    if (!list.length) return;
    const line = window.innerHeight * OFFSET;
    const tops = list.map((el) => el.getBoundingClientRect().top);
    let current = 0;
    tops.forEach((t, i) => { if (t <= line) current = i; });
    let target: number;
    if (dir === 1) target = Math.min(current + 1, list.length - 1);
    else target = tops[current] < -8 ? current : Math.max(current - 1, 0); // first go back to the top of this section
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list[target].scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  return (
    <div className={`section-arrows${pastHero ? " is-past-hero" : ""}`} role="group" aria-label="Section navigation">
      <button type="button" className="section-arrows__btn" aria-label="Previous section" disabled={atStart} onClick={() => go(-1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>
      </button>
      <button type="button" className="section-arrows__btn" aria-label="Next section" disabled={atEnd} onClick={() => go(1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
    </div>
  );
}
