"use client";

import { useEffect } from "react";
import { whenLoaded } from "@/lib/motion";

/**
 * Scroll & pointer effects for server-rendered markup. Renders nothing.
 *
 *   data-reveal[="left|right|scale|fade|words"]  fade/slide in when visible
 *   data-parallax="0.2"     vertical parallax speed (+ lags, − moves faster)
 *   data-parallax-x="0.3"   horizontal drift while scrolling
 *   data-mouse="20"         pointer depth in px (hero, desktop only)
 *   data-scrub              words light up while scrolling
 *   data-count              count up from 0 when visible
 *   .member                 gets .is-in when 20% visible
 *
 * Parallax uses the CSS `translate` property so it never fights with
 * transform-based animations, and reads no layout while scrolling.
 */
export function MotionEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const $$ = <T extends Element = HTMLElement>(sel: string): T[] => Array.from(document.querySelectorAll<T>(sel));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];
    const timers: number[] = [];

    /* ---------- Reveal ---------- */
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          revealIO.unobserve(el);
          if (el.dataset.reveal !== "words") {
            // Hand control back to the element's own hover transitions
            const delay = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
            timers.push(window.setTimeout(() => { el.removeAttribute("data-reveal"); el.classList.remove("is-in"); }, (delay + 1.3) * 1000));
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const reveals = $$<HTMLElement>("[data-reveal]");
    cleanups.push(() => revealIO.disconnect());

    /* ---------- Members ---------- */
    const memberIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); memberIO.unobserve(e.target); }
      }),
      { threshold: 0.2 },
    );
    cleanups.push(() => memberIO.disconnect());

    // Reveals start once the intro loader has lifted
    const startReveals = () => {
      if (reduce) reveals.forEach((el) => el.classList.add("is-in"));
      else reveals.forEach((el) => revealIO.observe(el));
      $$(".member").forEach((m) => (reduce ? m.classList.add("is-in") : memberIO.observe(m)));
    };
    cleanups.push(whenLoaded(startReveals));

    /* ---------- Counters ---------- */
    if (!reduce) {
      const countIO = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countIO.unobserve(e.target);
          const el = e.target as HTMLElement;
          const end = Number(el.textContent) || 0;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / 1200);
            el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
        { threshold: 0.6 },
      );
      $$("[data-count]").forEach((el) => countIO.observe(el));
      cleanups.push(() => countIO.disconnect());
    }

    /* ---------- Scroll-scrubbed words ---------- */
    type Scrub = { el: HTMLElement; spans: HTMLElement[]; top: number; h: number; lit: number };
    const scrubbers: Scrub[] = $$<HTMLElement>("[data-scrub]").map((el) => ({
      el, spans: Array.from(el.querySelectorAll<HTMLElement>(".scrub-word")), top: 0, h: 0, lit: -1,
    }));
    if (reduce) scrubbers.forEach((s) => s.spans.forEach((sp) => sp.classList.add("is-lit")));

    /* ---------- Parallax ---------- */
    type Item = { el: HTMLElement; sy: number; sx: number; mouse: number; center: number; h: number };
    // Touch screens: no per-frame parallax (keeps native scrolling smooth)
    const lite = window.matchMedia("(max-width: 899px), (hover: none), (pointer: coarse)").matches;
    const items: Item[] = reduce || lite
      ? []
      : $$<HTMLElement>("[data-parallax], [data-parallax-x]").map((el) => ({
          el,
          sy: parseFloat(el.dataset.parallax || "0"),
          sx: parseFloat(el.dataset.parallaxX || "0"),
          mouse: fine ? parseFloat(el.dataset.mouse || "0") : 0,
          center: 0,
          h: 0,
        }));
    const bar = document.querySelector<HTMLElement>(".scroll-progress span");
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let vh = window.innerHeight;
    let factor = 1;
    let docH = 1;
    let ticking = false;

    const render = () => {
      ticking = false;
      const y = window.scrollY;
      const vc = y + vh / 2;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const moving = Math.abs(mouse.tx - mouse.x) > 0.001 || Math.abs(mouse.ty - mouse.y) > 0.001;

      for (const it of items) {
        const dist = vc - it.center;
        if (Math.abs(dist) > vh + it.h) continue;
        const ty = dist * it.sy * factor + (it.mouse ? mouse.y * it.mouse : 0);
        const tx = dist * it.sx * factor + (it.mouse ? mouse.x * it.mouse : 0);
        it.el.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
      }
      if (!reduce) {
        for (const s of scrubbers) {
          const p = (y + vh * 0.85 - s.top) / (s.h + vh * 0.35);
          const lit = Math.max(0, Math.min(s.spans.length, Math.floor(p * s.spans.length)));
          if (lit !== s.lit) {
            s.spans.forEach((sp, i) => sp.classList.toggle("is-lit", i < lit));
            s.lit = lit;
          }
        }
      }
      if (bar) bar.style.transform = `scaleX(${Math.min(1, y / docH).toFixed(4)})`;
      if (moving) request();
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(render); } };

    const measure = () => {
      vh = window.innerHeight;
      factor = window.innerWidth < 768 ? 0.55 : 1;
      docH = Math.max(1, root.scrollHeight - vh);
      const y = window.scrollY;
      items.forEach((it) => { it.el.style.translate = ""; });
      items.forEach((it) => {
        const r = it.el.getBoundingClientRect();
        it.center = r.top + y + r.height / 2;
        it.h = r.height;
      });
      scrubbers.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        s.top = r.top + y;
        s.h = r.height;
      });
      render();
    };
    let measureRaf = 0;
    const scheduleMeasure = () => { cancelAnimationFrame(measureRaf); measureRaf = requestAnimationFrame(measure); };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("load", scheduleMeasure);
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(document.body);
    document.fonts?.ready.then(scheduleMeasure);
    cleanups.push(() => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      ro.disconnect();
      cancelAnimationFrame(measureRaf);
      items.forEach((it) => { it.el.style.translate = ""; });
    });

    const hero = document.querySelector<HTMLElement>(".hero");
    if (hero && fine && !reduce) {
      const move = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        request();
      };
      const leave = () => { mouse.tx = 0; mouse.ty = 0; request(); };
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", leave);
      cleanups.push(() => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); });
    }
    measure();

    root.classList.add("ready");
    return () => {
      cleanups.forEach((fn) => fn());
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return null;
}
