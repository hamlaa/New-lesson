"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, whenLoaded } from "@/lib/motion";

/**
 * Scroll-driven "cinematic" scenes (GSAP ScrollTrigger). Renders nothing.
 * Works on whatever sections exist on the current page:
 *
 *   hero      intro after the loader + pinned fly-through on scroll
 *   pledge    pinned giant typography, lines slide in & fill
 *   reel      pinned horizontal candidate strip with velocity skew
 *   members   3D letter names, zooming numbers, stacked-card transitions
 *   pillars / policy cards   3D entrances
 *   marquee   speed & direction follow the scroll velocity
 *   closing   zoom-out headline, parting clouds, rising sun
 *   kickers   text scramble · [data-confetti] confetti burst
 *
 * Nothing runs with prefers-reduced-motion — the page is then fully static.
 */
export function Cinematics() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    const q = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
    const all = <T extends Element = HTMLElement>(s: string, scope?: Element) => gsap.utils.toArray<T>(s, scope);
    const pad = (n: number) => String(n).padStart(2, "0");
    const cleanups: (() => void)[] = [];
    const mm = gsap.matchMedia(document.body);

    /* ---------------- hero: entrance after the loader ---------------- */
    const heroIntro = () => {
      const hero = q(".hero");
      if (!hero) return;
      const ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .from(".hero__sky img", { scale: 1.45, duration: 2.8 }, 0)
          .from(".wm-char", {
            yPercent: 120, rotateX: -100, opacity: 0, transformOrigin: "50% 100%",
            stagger: { each: 0.06, from: "center" }, duration: 1.7,
          }, 0.05)
          .from(".cloud--a", { xPercent: -70, opacity: 0, duration: 2.6 }, 0)
          .from(".cloud--b", { xPercent: 70, opacity: 0, duration: 2.6 }, 0.05)
          .from(".cloud--c", { yPercent: 70, opacity: 0, duration: 2.6 }, 0.1)
          .from(".hero__island img", { yPercent: 45, duration: 2.4 }, 0.1)
          .from(".hero__glare", { opacity: 0, scale: 0.3, duration: 2.4 }, 0.2)
          .from(".plane", { opacity: 0, duration: 1.2, stagger: 0.2 }, 0.9)
          .from(".ballot-badge", { scale: 0, rotate: -300, duration: 1.8, ease: "elastic.out(1, 0.55)" }, 1);
      }, hero);
      cleanups.push(() => ctx.revert());
    };

    /* ---------------- hero: pinned fly-through ---------------- */
    const heroScroll = (desktop: boolean) => {
      const hero = q(".hero");
      if (!hero) return;
      gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: { trigger: hero, start: "top top", end: desktop ? "+=130%" : "+=90%", pin: true, scrub: 0.7, anticipatePin: 1 },
      })
        .to(".hero__wordmark", { scale: desktop ? 3.8 : 2.8, yPercent: -14, opacity: 0, ease: "power2.in" }, 0)
        .to(".hero__sky", { scale: 1.3, yPercent: 5 }, 0)
        .to(".cloud--a", { x: "-55vw", y: "-10vh", scale: 1.8, ease: "power1.in" }, 0)
        .to(".cloud--b", { x: "55vw", y: "-14vh", scale: 1.7, ease: "power1.in" }, 0)
        .to(".cloud--c", { y: "-48vh", scale: 2.8, ease: "power1.in" }, 0)
        .to(".hero__island", { scale: 1.45, yPercent: 12, transformOrigin: "70% 100%" }, 0)
        .to(".hero__glare", { scale: 2.2, opacity: 0.9 }, 0)
        .to(".hero__content", { y: "-24vh", opacity: 0, filter: "blur(14px)", ease: "power1.in", duration: 0.75 }, 0)
        .to(".hero__flash", { opacity: 1, duration: 0.4, ease: "power2.in" }, 0.62);
    };

    /* ---------------- pledge: pinned giant type ---------------- */
    const pledge = () => {
      const sec = q(".pledge");
      if (!sec) return;
      const lines = all(".pledge__line", sec);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sec, start: "top top", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
          end: () => `+=${window.innerHeight * (lines.length * 0.9 + 0.8)}`,
        },
      });
      tl.from(sec.querySelector(".pledge__kicker"), { opacity: 0, y: 50, duration: 0.4 }, 0);
      lines.forEach((line, i) => {
        const side = i % 2 ? 1 : -1;
        const at = i + 0.2;
        tl.fromTo(line, { xPercent: side * 75, opacity: 0, rotate: side * 5 },
          { xPercent: 0, opacity: 1, rotate: 0, duration: 0.6, ease: "power3.out" }, at)
          .fromTo(line, { "--fill": "100%" }, { "--fill": "0%", duration: 0.7 }, at + 0.2)
          .from(line.querySelector(".pledge__num"), { scale: 0, rotate: -180, duration: 0.35, ease: "back.out(2)" }, at + 0.1)
          .from(line.querySelector(".pledge__thai"), { opacity: 0, y: 24, duration: 0.35 }, at + 0.45);
        if (i > 0) tl.to(lines[i - 1], { opacity: 0.35, scale: 0.96, duration: 0.4 }, at + 0.3);
      });
      const end = lines.length + 0.8;
      tl.to(lines[lines.length - 1], { opacity: 0.35, scale: 0.96, duration: 0.3 }, end - 0.6)
        .to(lines, { opacity: 1, scale: 1, duration: 0.3 }, end - 0.3)
        .from(sec.querySelector(".pledge__vote"), { scale: 0, rotate: -120, opacity: 0, duration: 0.45, ease: "back.out(1.8)" }, end - 0.55)
        .to(".pledge__orb--1", { xPercent: 70, yPercent: 50, duration: end }, 0)
        .to(".pledge__orb--2", { xPercent: -60, yPercent: -40, duration: end }, 0)
        .to(".pledge__grid", { yPercent: -25, duration: end }, 0)
        .to(".pledge__star", { rotate: 420, scale: 1.5, duration: end }, 0);
    };

    /* ---------------- reel: pinned horizontal strip ---------------- */
    const reel = () => {
      const sec = q(".reel");
      const track = q(".reel__track");
      if (!sec || !track) return;
      const cards = all(".reel-card", sec);
      const total = cards.length;
      const counter = sec.querySelector<HTMLElement>(".reel__current");
      const bar = sec.querySelector<HTMLElement>(".reel__progress i");
      const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
      const skew = gsap.quickTo(cards, "skewX", { duration: 0.5, ease: "power3" });
      const settle = gsap.delayedCall(0.12, () => skew(0)).pause();

      const move = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: sec, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.7,
          anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
            if (counter) counter.textContent = pad(Math.min(total, Math.floor(self.progress * total) + 1));
            skew(gsap.utils.clamp(-9, 9, self.getVelocity() / -260));
            settle.restart(true);
          },
        },
      });

      const visible = cards.filter((c) => c.getBoundingClientRect().left < window.innerWidth);
      gsap.from(visible, {
        y: 160, rotate: 5, opacity: 0, stagger: 0.12, duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: sec, start: "top 80%", once: true },
      });
      cards.forEach((card) => {
        const img = card.querySelector(".reel-card__media > *");
        if (img) {
          gsap.fromTo(img, { xPercent: -10 }, {
            xPercent: 10, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          });
        }
        if (!visible.includes(card)) {
          gsap.from(card, {
            yPercent: 22, rotate: 7, opacity: 0.2, ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: move, start: "left 100%", end: "left 62%", scrub: true },
          });
        }
      });
    };

    /* ---------------- members ---------------- */
    const members = (desktop: boolean) => {
      all(".member").forEach((m, i) => {
        const chars = m.querySelectorAll(".member__name .ch");
        if (chars.length) {
          gsap.from(chars, {
            yPercent: 120, rotateX: -95, opacity: 0, transformOrigin: "50% 100%",
            stagger: 0.03, duration: 1.2, ease: "expo.out", delay: 0.3,
            scrollTrigger: { trigger: m, start: "top 62%", once: true },
          });
        }
        const num = m.querySelector(".member__num");
        if (num) {
          gsap.fromTo(num, { scale: 0.5, rotate: -10, opacity: 0 }, {
            scale: 1, rotate: 0, opacity: 1, ease: "none",
            scrollTrigger: { trigger: m, start: "top bottom", end: "top 15%", scrub: true },
          });
        }
        const ghost = m.querySelector(".member__ghost");
        if (ghost) {
          gsap.fromTo(ghost, { skewX: -12 }, {
            skewX: 12, ease: "none",
            scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
        // Stacked cards: the next member slides over this one
        if (desktop && m.closest(".members")) {
          gsap.timeline({ scrollTrigger: { trigger: m, start: "bottom bottom", end: "+=100%", pin: true, pinSpacing: false, scrub: true } })
            .to(m.querySelector(".member__inner"), { scale: 0.84, yPercent: -5, rotate: i % 2 ? 2.5 : -2.5, ease: "none" }, 0)
            .to(m.querySelector(".member__shade"), { opacity: 0.62, ease: "none" }, 0);
        }
      });
    };

    /* ---------------- intro pillars ---------------- */
    const pillars = () => {
      const list = all(".pillar");
      if (!list.length) return;
      gsap.fromTo(list,
        { y: 180, rotateX: -60, opacity: 0, transformPerspective: 1000, transformOrigin: "50% 100%" },
        {
          y: 0, rotateX: 0, opacity: 1, stagger: 0.18, ease: "power3.out",
          scrollTrigger: { trigger: ".pillars", start: "top 95%", end: "top 40%", scrub: 1 },
        });
    };

    /* ---------------- policy cards ---------------- */
    const policies = () => {
      const cards = all(".policy-card");
      if (!cards.length) return;
      gsap.set(cards, {
        opacity: 0, y: 150, rotateX: -45, rotateZ: (i: number) => ((i % 3) - 1) * 5,
        transformPerspective: 1000, transformOrigin: "50% 0%", transition: "none",
      });
      ScrollTrigger.batch(cards, {
        start: "top 94%", once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1, y: 0, rotateX: 0, rotateZ: 0, stagger: 0.12, duration: 1.4, ease: "expo.out",
          overwrite: true, clearProps: "opacity,transform,transition",
        }),
      });
    };

    /* ---------------- marquee: velocity-driven ---------------- */
    const marquee = () => {
      const band = q(".marquee");
      const track = q(".marquee__track");
      if (!band || !track) return;
      band.classList.add("is-gsap");
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 34, repeat: -1 });
      loop.totalTime(loop.duration() * 500); // room to play backwards
      const groups = all(".marquee__group", band);
      const skew = gsap.quickTo(groups, "skewX", { duration: 0.4, ease: "power3" });
      let speed = 1;
      let dir = 1;
      ScrollTrigger.create({
        trigger: band, start: "top bottom", end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          dir = self.direction;
          speed = dir * (1 + Math.min(Math.abs(v) / 180, 9));
          skew(gsap.utils.clamp(-16, 16, v / -110));
        },
      });
      const tick = () => {
        speed += (dir - speed) * 0.04;
        loop.timeScale(speed);
        if (Math.abs(speed - dir) < 0.05) skew(0);
      };
      gsap.ticker.add(tick);
      return () => { gsap.ticker.remove(tick); band.classList.remove("is-gsap"); };
    };

    /* ---------------- closing ---------------- */
    const closing = () => {
      const sec = q(".closing");
      if (!sec) return;
      gsap.set(".closing__sun", { xPercent: -50, x: 0 });
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: sec, start: "top bottom", end: "center center", scrub: 1 },
      })
        .fromTo(".closing__title", { scale: 1.55, yPercent: 35 }, { scale: 1, yPercent: 0 }, 0)
        .fromTo(".closing__sun", { scale: 0.25 }, { scale: 1.3 }, 0)
        .fromTo(".closing__rays", { rotate: -50, scale: 0.5, opacity: 0 }, { rotate: 25, scale: 1, opacity: 1 }, 0)
        .fromTo(".closing__ballot", { yPercent: 70, scale: 0.5, opacity: 0 }, { yPercent: 0, scale: 1, opacity: 1 }, 0)
        .fromTo(".cloud--d", { x: "0vw" }, { x: "-22vw" }, 0)
        .fromTo(".cloud--e", { x: "0vw" }, { x: "20vw" }, 0)
        .fromTo(".cloud--f", { y: "0vh" }, { y: "12vh" }, 0);
    };

    /* ---------------- decorations spin with the scroll ---------------- */
    const decos = () => {
      all(".deco-ring, .spark").forEach((el) => {
        gsap.to(el, {
          rotate: el.classList.contains("spark") ? 540 : 220, ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    };

    /* ---------------- kicker text scramble ---------------- */
    const scramble = () => {
      const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/";
      all(".kicker, .pledge__kicker").forEach((k) => {
        const node = Array.from(k.childNodes).reverse().find((n) => n.nodeType === 3 && n.textContent?.trim());
        if (!node) return;
        const final = node.textContent ?? "";
        ScrollTrigger.create({
          trigger: k, start: "top 92%", once: true,
          onEnter: () => {
            const o = { p: 0 };
            gsap.to(o, {
              p: 1, duration: 1.2, ease: "power1.inOut", delay: 0.15,
              onUpdate: () => {
                const n = Math.floor(o.p * final.length);
                node.textContent = final.slice(0, n) + final.slice(n).replace(/[^\s—–\-·]/g, () => CH[(Math.random() * CH.length) | 0]);
              },
              onComplete: () => { node.textContent = final; },
            });
          },
        });
        cleanups.push(() => { node.textContent = final; });
      });
    };

    /* ---------------- build once the loader is gone ---------------- */
    const build = () => {
      root.classList.add("motion");
      heroIntro();
      mm.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)" }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        // create in page order so pin spacing is measured correctly
        heroScroll(desktop);
        pillars();
        const stopMarquee = marquee();
        pledge();
        reel();
        members(desktop);
        policies();
        closing();
        decos();
        return () => stopMarquee?.();
      });
      scramble();
      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(refresh);
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      cleanups.push(() => window.removeEventListener("load", refresh));
    };
    cleanups.push(whenLoaded(build));

    /* ---------------- confetti on [data-confetti] ---------------- */
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-confetti]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height / 2);
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    return () => {
      cleanups.forEach((fn) => fn());
      mm.revert();
      root.classList.remove("motion");
    };
  }, []);

  return null;
}

/** Small dependency-free confetti burst from (x, y). */
function confetti(x: number, y: number) {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti";
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const c = canvas.getContext("2d");
  if (!c) { canvas.remove(); return; }
  c.scale(dpr, dpr);
  const colors = ["#69BDF5", "#B9E1FF", "#173B63", "#FFD66B", "#FFFFFF", "#FF8FA3", "#3E9BE0"];
  const parts = Array.from({ length: 170 }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 6 + Math.random() * 12;
    return {
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 9,
      w: 6 + Math.random() * 8, h: 4 + Math.random() * 6,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      color: colors[(Math.random() * colors.length) | 0], star: Math.random() < 0.18,
    };
  });
  const t0 = performance.now();
  const frame = (t: number) => {
    const age = (t - t0) / 1000;
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    c.globalAlpha = Math.max(0, 1 - Math.max(0, age - 1.6) / 0.8);
    for (const p of parts) {
      p.vy += 0.42; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.r);
      c.fillStyle = p.color;
      if (p.star) {
        c.font = `${p.w * 2}px sans-serif`;
        c.fillText("✦", -p.w / 2, p.w / 2);
      } else {
        c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
      }
      c.restore();
    }
    if (age < 2.4) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
