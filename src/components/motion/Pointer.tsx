"use client";

import { useEffect } from "react";
import { finePointer, gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Desktop-only pointer effects (mouse / trackpad, motion allowed):
 *   • [data-magnetic]  elements lean towards the pointer
 *   • [data-tilt]      cards tilt in 3D (sets --rx / --ry / --gx / --gy)
 */
export function Pointer() {
  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return;
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

    const leave = () => {
      releaseMagnet();
      releaseTilt();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      releaseMagnet();
      releaseTilt();
    };
  }, []);

  return null;
}
