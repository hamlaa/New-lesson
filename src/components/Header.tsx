"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { party } from "@/data/party";

type NavItem = { label: string; href: string };

/**
 * Fixed header: logo in the middle, links split evenly on both sides.
 * Transparent with white text over the hero, turns into a white glass bar
 * after the hero, hides while scrolling down. Full-screen sheet on mobile.
 */
export function Header({ onHome = true }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const to = (href: string) => (onHome || !href.startsWith("#") ? href : `/${href}`);
  const all: NavItem[] = [...party.nav.left, ...party.nav.right];

  // Scroll state (only re-renders when a boolean flips)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = onHome ? document.getElementById("top") : null;
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const limit = hero ? hero.offsetHeight - 90 : 30;
      setScrolled(y > limit);
      if (!reduce) {
        if (y > lastY + 6 && y > 500) setHidden(true);
        else if (y < lastY - 6 || y < 500) setHidden(false);
      }
      lastY = y;
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
  }, [onHome]);

  // Highlight the link of the section in view
  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    all.forEach((l) => {
      const el = l.href.startsWith("#") ? document.getElementById(l.href.slice(1)) : null;
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onHome]);

  // Mobile menu: lock page scroll, close with Escape or when resized to desktop
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const cls = [
    "site-header",
    onHome && !scrolled && "is-on-hero",
    scrolled && "is-scrolled",
    hidden && !open && "is-hidden",
    open && "menu-is-open",
  ].filter(Boolean).join(" ");

  const splitList = (items: NavItem[], side: "left" | "right") => (
    <ul className={`nav-split nav-split--${side}`}>
      {items.map((l) => (
        <li key={l.href + l.label}>
          <a className={`nav-split__link${active === l.href ? " is-active" : ""}`} href={to(l.href)}>
            {l.label}<span className="nav-split__cursor" aria-hidden="true"> _</span>
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header className={cls} id="site-header" onFocus={() => setHidden(false)}>
      <nav className="site-header__inner" aria-label="Main navigation">
        {splitList(party.nav.left, "left")}

        <Link className="brand" href={onHome ? "#top" : "/"} aria-label={`${party.partyName} — home`}>
          <Image className="brand__logo" src={party.logo} alt="" width={128} height={128} preload sizes="72px" />
        </Link>

        {splitList(party.nav.right, "right")}

        <div className={`nav${open ? " is-open" : ""}`}>
          <button
            ref={toggleRef}
            className="nav__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__toggle-label">{open ? "Close" : "Menu"}</span>
            <span className="nav__toggle-icon" aria-hidden="true"><span /><span /></span>
          </button>
          <ul className="nav__menu" id="nav-menu" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
            {all.map((l, i) => (
              <li key={l.href + l.label}>
                <a className={`nav__link${active === l.href ? " is-active" : ""}`} href={to(l.href)}>
                  <span className="nav__num">{String(i + 1).padStart(2, "0")}</span> {l.label}
                </a>
              </li>
            ))}
            <li>
              <a className="nav__link nav__link--cta" href={to("#vote")}>
                Vote <span>{party.partyName}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
