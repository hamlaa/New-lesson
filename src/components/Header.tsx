"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { party } from "@/data/party";

const LINKS = [
  { id: "about", num: "01", label: "About" },
  { id: "team", num: "02", label: "Team" },
  { id: "policies", num: "03", label: "Policies" },
];

/** Fixed header: glass background after scrolling, hides on scroll down, mobile sheet menu. */
export function Header({ onHome = true }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  // Scroll state (only re-renders when a boolean flips)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 30);
      if (!reduce) {
        if (y > lastY + 6 && y > 500) setHidden(true);
        else if (y < lastY - 6 || y < 500) setHidden(false);
      }
      lastY = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Highlight the section in view
  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["about", "team", "policies", "vote"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  // Menu: lock page scroll, close with Escape or when resized to desktop
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
    scrolled && "is-scrolled",
    hidden && !open && "is-hidden",
    open && "menu-is-open",
  ].filter(Boolean).join(" ");

  return (
    <header className={cls} id="site-header" onFocus={() => setHidden(false)}>
      <div className="site-header__inner">
        <Link className="brand" href={onHome ? "#top" : "/"} aria-label={`${party.partyName} — home`}>
          <Image className="brand__logo" src={party.logo} alt="" width={40} height={40} />
          <span className="brand__name">{party.partyName}</span>
        </Link>
        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main navigation">
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
            {LINKS.map((l) => (
              <li key={l.id}>
                <a className={`nav__link${active === l.id ? " is-active" : ""}`} href={href(l.id)}>
                  <span className="nav__num">{l.num}</span> {l.label}
                </a>
              </li>
            ))}
            <li>
              <a className={`nav__link nav__link--cta${active === "vote" ? " is-active" : ""}`} href={href("vote")}>
                Vote <span>{party.partyName}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
