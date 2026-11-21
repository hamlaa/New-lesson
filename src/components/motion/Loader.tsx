"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { party } from "@/data/party";
import { gsap, isLite, LOADED_EVENT, prefersReducedMotion } from "@/lib/motion";

/**
 * Intro curtain: logo, party name, 000→100 counter, then a two-layer wipe.
 * Shown on the first full page load only (shorter on repeat visits).
 * Without JS or with reduced motion it never appears (see motion.css).
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!el) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.remove("is-loading");
      root.classList.add("is-loaded");
      window.__lenis?.start();
      // Dispatch outside GSAP: callbacks run inside the loader's gsap.context,
      // which would scope every selector created by listeners to the loader.
      window.setTimeout(() => window.dispatchEvent(new Event(LOADED_EVENT)), 0);
    };

    // phones / touch screens skip the intro curtain entirely (content first)
    if (prefersReducedMotion() || isLite() || root.classList.contains("is-loaded")) {
      el.style.display = "none";
      finish();
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem("nl-seen") === "1";
      sessionStorage.setItem("nl-seen", "1");
    } catch { /* private mode */ }

    const total = seen ? 0.75 : 1.9;
    const counter = el.querySelector<HTMLElement>(".loader__count");
    const n = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => { el.style.display = "none"; } })
        .from(".loader__logo", { scale: 0, rotate: -220, duration: 1.1, ease: "back.out(1.5)" }, 0)
        .from(".loader__word .ch", { yPercent: 120, rotateX: -90, stagger: 0.045, duration: 0.9, ease: "expo.out" }, 0.15)
        .from(".loader__sub", { opacity: 0, y: 16, duration: 0.7 }, 0.5)
        .to(n, {
          v: 100, duration: total, ease: "power2.inOut",
          onUpdate: () => { if (counter) counter.textContent = String(Math.round(n.v)).padStart(3, "0"); },
        }, 0)
        .to(".loader__bar i", { scaleX: 1, duration: total, ease: "power2.inOut" }, 0)
        .to(".loader__content", { yPercent: -40, opacity: 0, duration: 0.6, ease: "power3.in" }, total)
        .to(".loader__foot", { opacity: 0, duration: 0.3 }, total)
        .to(".loader__panel--front", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, total + 0.2)
        .to(".loader__panel--back", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, total + 0.36)
        .add(finish, total + 0.7);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <div className="loader__panel loader__panel--back" />
      <div className="loader__panel loader__panel--front">
        <div className="loader__content">
          <Image className="loader__logo" src={party.logo} alt="" width={160} height={160} preload sizes="160px" />
          <p className="loader__word">
            {party.partyName.split("").map((c, i) => (
              <span className="ch" key={i}>{c === " " ? " " : c}</span>
            ))}
          </p>
          <p className="loader__sub">{party.schoolName} · Student Council</p>
        </div>
        <div className="loader__foot">
          <span className="loader__bar"><i /></span>
          <span className="loader__count">000</span>
        </div>
      </div>
    </div>
  );
}
