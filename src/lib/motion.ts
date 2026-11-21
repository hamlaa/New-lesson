/* Shared animation helpers (client-side only). */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

declare global {
  interface Window { __lenis?: Lenis }
}

/** Fired once by <Loader> when the intro curtain has lifted. */
export const LOADED_EVENT = "nl:loaded";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Phones, tablets and other touch-first screens get the light, native-scroll experience. */
export const LITE_QUERY = "(max-width: 899px), (hover: none), (pointer: coarse)";
export const isLite = () => typeof window !== "undefined" && window.matchMedia(LITE_QUERY).matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Runs `cb` once the loader is gone (immediately if it already is). Returns a cancel function. */
export function whenLoaded(cb: () => void) {
  const root = document.documentElement;
  if (root.classList.contains("is-loaded")) {
    cb();
    return () => {};
  }
  let done = false;
  const run = () => { if (!done) { done = true; cb(); } };
  window.addEventListener(LOADED_EVENT, run, { once: true });
  const t = window.setTimeout(run, 6000); // failsafe
  return () => { window.removeEventListener(LOADED_EVENT, run); clearTimeout(t); };
}

/** Smooth-scroll to a selector / element / y position (Lenis when active). */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement | number, { duration: 1.6 });
  else if (typeof el === "number") window.scrollTo({ top: el, behavior: "smooth" });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
