"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { party } from "@/data/party";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

/**
 * Curtain wipe between pages (home ⇄ member profiles).
 * Intercepts same-site links to another path, covers the screen,
 * navigates, then lifts the curtain on the new page.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const covering = useRef(false);

  // Cover → navigate
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      if (covering.current) return;
      covering.current = true;
      window.__lenis?.stop();
      gsap.timeline()
        .set(el, { visibility: "visible" })
        .fromTo(el.querySelectorAll(".curtain__layer"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "expo.inOut", stagger: 0.08 })
        .fromTo(el.querySelector(".curtain__logo"), { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(1.7)" }, "-=0.3")
        .add(() => router.push(url.pathname + url.search + url.hash));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New page rendered → uncover
  useEffect(() => {
    if (!covering.current) return;
    const el = ref.current!;
    const id = window.setTimeout(() => {
      if (!location.hash) window.scrollTo(0, 0);
      window.__lenis?.start();
      ScrollTrigger.refresh();
      gsap.timeline({ onComplete: () => { covering.current = false; gsap.set(el, { visibility: "hidden" }); } })
        .to(el.querySelector(".curtain__logo"), { scale: 0, rotate: 120, duration: 0.3, ease: "power3.in" })
        .to(Array.from(el.querySelectorAll(".curtain__layer")).reverse(),
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut", stagger: 0.08 }, "-=0.1");
    }, 60);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div className="curtain" ref={ref} aria-hidden="true">
      <div className="curtain__layer curtain__layer--sky" />
      <div className="curtain__layer curtain__layer--navy">
        <Image className="curtain__logo" src={party.logo} alt="" width={120} height={120} sizes="120px" />
      </div>
    </div>
  );
}
