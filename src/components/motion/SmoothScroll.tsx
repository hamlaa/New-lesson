"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/** Inertia ("buttery") scrolling for mouse wheels & trackpads, synced with GSAP ScrollTrigger. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, anchors: { duration: 1.6 }, autoRaf: false });
    window.__lenis = lenis;
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
