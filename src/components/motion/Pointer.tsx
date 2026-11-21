"use client";

import { useEffect, useRef } from "react";
import { finePointer, gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Desktop-only pointer effects (mouse / trackpad, motion allowed):
 *   • custom cursor ring that grows over links and shows data-cursor="Label"
 *   • [data-magnetic]  elements lean towards the pointer
 *   • [data-tilt]      cards tilt in 3D (sets --rx / --ry / --gx / --gy)
 */
export function Pointer() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return;
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const label = ring.querySelector<HTMLElement>(".cursor__label")!;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const releaseMagnet = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      magnet = null;
    };
    const releaseTilt = () => {
      if (!tilt) return;
      tilt.style.setProperty("--rx", "0deg");
      tilt.style.setProperty("--ry", "0deg");
      tilt.classList.remove("is-tilting");
      tilt = null;
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      ringX(e.clientX); ringY(e.clientY);
      dotX(e.clientX); dotY(e.clientY);
      ring.classList.add("is-visible");
      dot.classList.add("is-visible");
      const target = e.target as Element | null;

      // magnetic
      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const strength = parseFloat(m.dataset.magnetic || "") || 0.35;
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
          duration: 0.5, ease: "power3.out",
        });
      }

      // tilt
      const t = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (t !== tilt) releaseTilt();
      if (t) {
        tilt = t;
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const max = parseFloat(t.dataset.tilt || "") || 10;
        t.classList.add("is-tilting");
        t.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
        t.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
        t.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        t.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      }
    };

    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-cursor], label, summary");
      const text = el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      ring.classList.toggle("is-hover", !!el);
      ring.classList.toggle("has-label", !!text);
      label.textContent = text;
    };
    const down = () => ring.classList.add("is-down");
    const up = () => ring.classList.remove("is-down");
    const leave = () => {
      ring.classList.remove("is-visible");
      dot.classList.remove("is-visible");
      releaseMagnet();
      releaseTilt();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      releaseMagnet();
      releaseTilt();
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={ringRef} aria-hidden="true"><span className="cursor__label" /></div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
