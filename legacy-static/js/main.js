/* =====================================================================
   NEW LESSON — main.js
   Renders content from js/data.js and runs the interactions:
   • data binding           • member sections, roster & HUD
   • policies + filters     • parallax engine (scroll + pointer)
   • reveal animations      • navigation & scroll progress
   You normally do NOT need to edit this file — edit js/data.js instead.
   ===================================================================== */
(() => {
  "use strict";

  const DATA = typeof partyData !== "undefined" ? partyData : null;
  const ICON = typeof ICONS !== "undefined" ? ICONS : {};
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!DATA) {
    console.warn("[NEW LESSON] js/data.js did not load — showing default content only.");
    root.classList.add("ready", "reveal-all");
    return;
  }

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  const get = (path, obj = DATA) =>
    path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /** Escapes text and turns *word* into <em>word</em>. */
  const rich = (value) => esc(value).replace(/\*(.+?)\*/g, "<em>$1</em>");
  const plain = (value) => String(value ?? "").replace(/\*/g, "");
  const pad = (n) => String(n).padStart(2, "0");
  const initials = (name) =>
    String(name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  /** Sets an <img> source and calls onFail if it cannot load. */
  function safeSrc(img, src, onFail) {
    if (!src) { onFail && onFail(); return; }
    img.addEventListener("error", () => onFail && onFail(), { once: true });
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    else if (img.complete && img.naturalWidth === 0) onFail && onFail();
  }

  /* ------------------------------------------------------------------
     1. Theme colours & simple data binding
     ------------------------------------------------------------------ */
  function applyTheme() {
    const t = DATA.theme || {};
    const map = { primary: "--c-primary", secondary: "--c-secondary", background: "--c-bg", text: "--c-text", accent: "--c-accent" };
    Object.entries(map).forEach(([key, cssVar]) => { if (t[key]) root.style.setProperty(cssVar, t[key]); });
    if (t.primary) $('meta[name="theme-color"]')?.setAttribute("content", t.primary);
  }

  function bindContent() {
    $$("[data-bind]").forEach((el) => {
      const v = get(el.dataset.bind);
      if (v != null && typeof v !== "object") el.textContent = plain(v);
    });
    $$("[data-rich]").forEach((el) => {
      const v = get(el.dataset.rich);
      if (v != null) el.innerHTML = rich(v);
    });
    $$("[data-bind-href]").forEach((el) => {
      const v = get(el.dataset.bindHref);
      if (v) el.setAttribute("href", v);
    });
    $$("[data-bind-src]").forEach((el) => {
      safeSrc(el, get(el.dataset.bindSrc), () => { el.style.visibility = "hidden"; });
    });
    $$("[data-cloud]").forEach((el) => {
      const list = DATA.cloudImages || [];
      const src = list[Number(el.dataset.cloud)] || list[0];
      safeSrc(el, src, () => { el.style.display = "none"; });
    });
    $$("[data-icon]").forEach((el) => { el.innerHTML = ICON[el.dataset.icon] || ""; });
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
    $$("[data-count]").forEach((el) => {
      const list = DATA[el.dataset.count];
      if (Array.isArray(list)) el.textContent = list.length;
    });

    document.title = `${DATA.partyName} — Student Council Party · ${DATA.schoolName}`;

    // Hero wordmark: one span per word (stacks on mobile, inline on desktop)
    const wm = $("[data-wordmark]");
    if (wm) {
      wm.innerHTML = String(DATA.partyName || "").split(/\s+/).map((w) => `<span class="wm-word">${esc(w)}</span>`).join(" ");
    }

    // Circular "Meet our team" text
    const cue = $("[data-cue-text]");
    if (cue) {
      const label = String(get("hero.scrollLabel") || "Meet Our Team").toUpperCase();
      cue.textContent = `${label} • ${label} • `;
      cue.setAttribute("textLength", "285");
      cue.setAttribute("lengthAdjust", "spacing");
    }

    // Slogan marquee
    const track = $("[data-marquee]");
    if (track) {
      const text = get("intro.sloganMarquee") || DATA.slogan || "";
      const phrases = text.split("✦").map((s) => s.trim()).filter(Boolean);
      track.parentElement.setAttribute("aria-label", phrases.join(". "));
      let inner = phrases
        .map((p, i) => `<span class="${i % 2 ? "serif" : ""}">${esc(p)}</span><span class="star">✦</span>`)
        .join("");
      inner = inner + inner; // make each group comfortably wider than the screen
      track.innerHTML = `<div class="marquee__group">${inner}</div><div class="marquee__group" aria-hidden="true">${inner}</div>`;
    }
  }

  /* ------------------------------------------------------------------
     2. Members: roster, full-screen sections and HUD
     ------------------------------------------------------------------ */
  const LAYOUTS = ["a", "b", "c", "d"];

  function memberTemplate(m, i) {
    const num = esc(m.number || pad(i + 1));
    const id = `member-${pad(i + 1)}`;
    const layout = LAYOUTS.includes(m.layout) ? m.layout : LAYOUTS[i % LAYOUTS.length];
    const parts = String(m.name || "Member Name").trim().split(/\s+/);
    const first = parts.shift();
    const last = parts.join(" ");
    const roles = Array.isArray(m.responsibilities) ? m.responsibilities.filter(Boolean) : [];
    const badgeText = `${esc(DATA.partyName || "")} • CANDIDATE • `;

    return `
<article class="member member--${layout}" id="${id}" aria-labelledby="${id}-name" data-member="${i}">
  <div class="member__bg" aria-hidden="true">
    <span class="member__panel"></span>
    <span class="member__lines"></span>
    <span class="member__shape" data-parallax="-0.14"></span>
    <span class="member__num" data-parallax="0.24">${num}</span>
    <span class="member__ghost" data-parallax-x="0.32">${esc(m.nickname || first)}</span>
  </div>
  <div class="member__inner">
    <figure class="member__portrait" data-parallax="0.05">
      <div class="member__frame">
        <img class="member__img" alt="Portrait of ${esc(m.name)}${m.nickname ? ` (${esc(m.nickname)})` : ""}"
             width="1000" height="1250" loading="lazy" decoding="async" data-parallax="-0.06" data-src="${esc(m.image || "")}">
      </div>
      <div class="member__badge" aria-hidden="true">
        <svg viewBox="0 0 100 100"><defs><path id="badge-path-${i}" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0"/></defs>
          <text><textPath href="#badge-path-${i}" textLength="236" lengthAdjust="spacing">${badgeText}</textPath></text></svg>
        <span class="member__badge-num">${num}</span>
      </div>
    </figure>
    <div class="member__content">
      <div class="member__head">
        <p class="member__meta" data-stagger style="--s:0">
          <span class="member__lesson">Lesson ${num}</span>
          <span class="member__position">${esc(m.position)}</span>
        </p>
        <h3 class="member__name" id="${id}-name" data-stagger style="--s:1">
          <span class="first">${esc(first)}</span>${last ? `<span class="last">${esc(last)}</span>` : ""}
        </h3>
        ${m.nameThai ? `<p class="member__thai" lang="th" data-stagger style="--s:2">${esc(m.nameThai)}</p>` : ""}
        ${m.nickname ? `<p class="member__nick" data-stagger style="--s:3"><small>Nickname</small><span>${esc(m.nickname)}</span></p>` : ""}
      </div>
      <div class="member__body">
        ${m.description ? `<p class="member__desc" data-stagger style="--s:4">${esc(m.description)}</p>` : ""}
        ${roles.length ? `<div class="member__roles" data-stagger style="--s:5"><h4>Role &amp; Responsibilities</h4><ul>${roles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>` : ""}
        ${m.slogan ? `<blockquote class="member__slogan" data-stagger style="--s:6"><p>${esc(m.slogan)}</p></blockquote>` : ""}
      </div>
    </div>
  </div>
</article>`;
  }

  function showMissingPhoto(frame, member) {
    if (frame.classList.contains("is-missing")) return;
    frame.classList.add("is-missing");
    const box = document.createElement("div");
    box.className = "member__missing";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", `Photo of ${member.name} coming soon`);
    box.innerHTML = `<strong>${esc(initials(member.name))}</strong><span>Photo coming soon</span>`;
    frame.appendChild(box);
  }

  function buildMembers() {
    const members = Array.isArray(DATA.members) ? DATA.members : [];
    const wrap = $("#members");
    const roster = $("#roster");
    const hud = $("#member-hud");
    if (!wrap) return;

    wrap.innerHTML = members.map(memberTemplate).join("");

    // Photos (with graceful fallback)
    $$(".member", wrap).forEach((article, i) => {
      const img = $(".member__img", article);
      const frame = $(".member__frame", article);
      safeSrc(img, img.dataset.src, () => showMissingPhoto(frame, members[i]));
      img.removeAttribute("data-src");
    });

    // Roster (table of contents)
    if (roster) {
      roster.innerHTML = members.map((m, i) => `
        <li><a href="#member-${pad(i + 1)}" data-preview="${esc(m.image || "")}">
          <span class="roster__num">${esc(m.number || pad(i + 1))}</span>
          <span class="roster__name">${esc(m.name)}${m.nickname ? ` <span class="roster__nick">“${esc(m.nickname)}”</span>` : ""}</span>
          <span class="roster__pos">${esc(m.position)}</span>
          <span class="roster__arrow" aria-hidden="true">${ICON.arrow || "→"}</span>
        </a></li>`).join("");
    }

    // Floating HUD
    if (hud && members.length) {
      hud.innerHTML = `
        <span class="member-hud__count" aria-live="polite"><b data-hud-num>01</b><small>/${pad(members.length)}</small></span>
        <span class="member-hud__dots">${members.map((m, i) => `
          <button class="member-hud__dot" type="button" data-target="member-${pad(i + 1)}"
                  aria-label="Go to ${esc(m.name)}"><span>${esc(m.nickname || m.name)}</span></button>`).join("")}
        </span>`;
      if (members.length > 8) hud.classList.add("is-many");
      hud.hidden = false;
      hud.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-target]");
        if (!btn) return;
        document.getElementById(btn.dataset.target)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  function watchMembers() {
    const articles = $$(".member");
    const hud = $("#member-hud");
    const hudNum = $("[data-hud-num]");
    const dots = $$(".member-hud__dot");
    if (!articles.length) return;

    // Reveal each member when ~20% is visible
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    articles.forEach((a) => revealIO.observe(a));

    // Track which member crosses the middle of the screen
    const active = new Set();
    const activeIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? active.add(e.target) : active.delete(e.target)));
      if (!hud) return;
      const current = [...active][0];
      hud.classList.toggle("is-visible", !!current);
      if (!current) return;
      const idx = Number(current.dataset.member);
      if (hudNum) hudNum.textContent = pad(idx + 1);
      dots.forEach((d, i) => d.setAttribute("aria-current", i === idx ? "true" : "false"));
    }, { rootMargin: "-50% 0px -50% 0px" });
    articles.forEach((a) => activeIO.observe(a));
  }

  /* Roster hover preview that follows the cursor (desktop only) */
  function rosterPreview() {
    const box = $("#roster-preview");
    const roster = $("#roster");
    if (!box || !roster || !finePointer || reduceMotion) return;
    const img = $("img", box);
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, on = false;

    const loop = () => {
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${((tx - x) * 0.04).toFixed(2)}deg)`;
      raf = on || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    roster.addEventListener("pointermove", (e) => {
      tx = e.clientX + 24; ty = e.clientY - 130;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    roster.addEventListener("pointerover", (e) => {
      const a = e.target.closest("a[data-preview]");
      if (!a) return;
      const src = a.dataset.preview;
      const frameMissing = document.querySelector(`${a.getAttribute("href")} .member__frame.is-missing`);
      if (!src || frameMissing) { box.classList.remove("is-visible"); return; }
      if (img.getAttribute("src") !== src) img.src = src;
      if (!on) { x = tx = e.clientX + 24; y = ty = e.clientY - 130; }
      on = true;
      box.classList.add("is-visible");
    });
    roster.addEventListener("pointerleave", () => { on = false; box.classList.remove("is-visible"); });
  }

  /* ------------------------------------------------------------------
     3. Policies + category filters
     ------------------------------------------------------------------ */
  function buildPolicies() {
    const policies = Array.isArray(DATA.policies) ? DATA.policies : [];
    const grid = $("#policy-grid");
    const filters = $("#policy-filters");
    const empty = $("#policy-empty");
    if (!grid) return;

    grid.innerHTML = policies.map((p, i) => `
      <article class="policy-card" data-reveal style="--d:${(i % 3) * 0.1}s" data-category="${esc(p.category || "")}">
        <div class="policy-card__top">
          <span class="policy-card__cat">${esc(p.category || "Policy")}</span>
          <span class="policy-card__num">P–${pad(i + 1)}</span>
        </div>
        <div class="policy-card__icon" aria-hidden="true">${ICON[p.icon] || ICON.star || ""}</div>
        <h3 class="policy-card__title">${esc(p.title)}</h3>
        <p class="policy-card__desc">${esc(p.description)}</p>
        <span class="policy-card__bar" aria-hidden="true"></span>
      </article>`).join("");

    const cards = $$(".policy-card", grid);
    const markOffsets = () => cards.filter((c) => !c.hidden).forEach((c, i) => c.classList.toggle("is-offset", i % 3 === 1));
    markOffsets();

    // Pointer glow
    if (finePointer) {
      grid.addEventListener("pointermove", (e) => {
        const card = e.target.closest(".policy-card");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    }

    if (!filters) return;
    const cats = [...new Set(policies.map((p) => p.category).filter(Boolean))];
    if (cats.length < 2) { filters.remove(); return; }
    const count = (c) => policies.filter((p) => p.category === c).length;
    filters.innerHTML = [
      `<button class="filter" type="button" data-filter="*" aria-pressed="true">All<span class="filter__count">${policies.length}</span></button>`,
      ...cats.map((c) => `<button class="filter" type="button" data-filter="${esc(c)}" aria-pressed="false">${esc(c)}<span class="filter__count">${count(c)}</span></button>`),
    ].join("");

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      const f = btn.dataset.filter;
      $$(".filter", filters).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      let k = 0;
      cards.forEach((card) => {
        const show = f === "*" || card.dataset.category === f;
        card.hidden = !show;
        card.classList.remove("is-entering");
        if (show && !reduceMotion) {
          void card.offsetWidth; // restart animation
          card.style.setProperty("--k", k++);
          card.classList.add("is-entering");
        }
      });
      markOffsets();
      if (empty) empty.hidden = cards.some((c) => !c.hidden);
    });
  }

  /* ------------------------------------------------------------------
     4. Social links
     ------------------------------------------------------------------ */
  function buildSocials() {
    const list = $("#socials");
    const socials = Array.isArray(DATA.socials) ? DATA.socials : [];
    if (!list) return;
    if (!socials.length) { list.remove(); return; }
    list.innerHTML = socials.map((s) => {
      const external = s.url && s.url !== "#" && !s.url.startsWith("#");
      return `<li><a href="${esc(s.url || "#")}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="ico" aria-hidden="true">${ICON[s.platform] || ICON.arrow || ""}</span><span>${esc(s.label || s.platform)}</span></a></li>`;
    }).join("");
  }

  /* ------------------------------------------------------------------
     5. Text effects: word split + scroll "scrub" highlight
     ------------------------------------------------------------------ */
  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w";
            w.setAttribute("aria-hidden", "true");
            const inner = document.createElement("span");
            inner.className = "w__i";
            inner.style.setProperty("--i", i++);
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    };
    walk(el);
  }

  const scrubbers = [];
  function setupScrub() {
    $$("[data-scrub]").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w) => `<span class="scrub-word">${esc(w)}</span>`).join(" ");
      const spans = $$(".scrub-word", el);
      if (reduceMotion) { spans.forEach((s) => s.classList.add("is-lit")); return; }
      scrubbers.push({ el, spans, top: 0, h: 0, lit: -1 });
    });
  }

  /* ------------------------------------------------------------------
     6. Reveal on scroll
     ------------------------------------------------------------------ */
  function setupReveal() {
    const items = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-in");
        io.unobserve(el);
        // Once revealed, hand control back to the element's own hover transitions
        const delay = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
        if (el.dataset.reveal !== "words") {
          setTimeout(() => { el.removeAttribute("data-reveal"); el.classList.remove("is-in"); }, (delay + 1.3) * 1000);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
  }

  function setupCounters() {
    const els = $$("[data-count]");
    if (reduceMotion) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const end = Number(el.textContent) || 0;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / 1200);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------
     7. Navigation
     ------------------------------------------------------------------ */
  const header = $("#site-header");
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  let lastY = 0;

  function setupNav() {
    if (!toggle || !nav) return;
    const menu = $("#nav-menu");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      $(".nav__toggle-label", toggle).textContent = open ? "Close" : "Menu";
      document.body.classList.toggle("menu-open", open);
      header.classList.toggle("menu-is-open", open);
      if (open) header.classList.remove("is-hidden");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });

    // Highlight the link of the section in view
    const links = $$(".nav__link");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "team", "policies", "vote"].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  function updateHeader(y) {
    if (!header) return;
    header.classList.toggle("is-scrolled", y > 30);
    const menuOpen = nav && nav.classList.contains("is-open");
    if (!menuOpen && !reduceMotion) {
      if (y > lastY + 6 && y > 500) header.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 500) header.classList.remove("is-hidden");
    }
    lastY = y;
  }
  // Keyboard users: always reveal the header when focus moves into it
  header?.addEventListener("focusin", () => header.classList.remove("is-hidden"));

  /* ------------------------------------------------------------------
     8. Parallax engine
     Elements opt-in with:
       data-parallax="0.2"    vertical speed (+ lags behind, − moves faster)
       data-parallax-x="0.3"  horizontal drift while scrolling
       data-mouse="20"        pointer depth in px (hero only)
     Uses the CSS `translate` property so it never fights with
     transform-based animations.
     ------------------------------------------------------------------ */
  const progressBar = $(".scroll-progress span");
  const hero = $(".hero");
  const px = { items: [], vh: window.innerHeight, factor: 1, docH: 1 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let ticking = false;

  function collectParallax() {
    if (reduceMotion) return;
    px.items = $$("[data-parallax], [data-parallax-x]").map((el) => ({
      el,
      sy: parseFloat(el.dataset.parallax || 0),
      sx: parseFloat(el.dataset.parallaxX || 0),
      mouse: finePointer ? parseFloat(el.dataset.mouse || 0) : 0,
      center: 0,
      h: 0,
    }));
  }

  function measure() {
    px.vh = window.innerHeight;
    px.factor = window.innerWidth < 768 ? 0.55 : 1;
    px.docH = Math.max(1, document.documentElement.scrollHeight - px.vh);
    const y = window.scrollY;
    px.items.forEach((it) => { it.el.style.translate = ""; });
    px.items.forEach((it) => {
      const r = it.el.getBoundingClientRect();
      it.center = r.top + y + r.height / 2;
      it.h = r.height;
    });
    scrubbers.forEach((s) => {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + y; s.h = r.height;
    });
    render();
  }

  function render() {
    ticking = false;
    const y = window.scrollY;
    const vc = y + px.vh / 2;

    // pointer easing
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    const mouseMoving = Math.abs(mouse.tx - mouse.x) > 0.001 || Math.abs(mouse.ty - mouse.y) > 0.001;

    for (const it of px.items) {
      const d = vc - it.center;
      if (Math.abs(d) > px.vh + it.h) continue; // far off-screen: skip work
      const ty = d * it.sy * px.factor + (it.mouse ? mouse.y * it.mouse : 0);
      const tx = d * it.sx * px.factor + (it.mouse ? mouse.x * it.mouse : 0);
      it.el.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
    }

    for (const s of scrubbers) {
      const p = (y + px.vh * 0.85 - s.top) / (s.h + px.vh * 0.35);
      const lit = Math.max(0, Math.min(s.spans.length, Math.floor(p * s.spans.length)));
      if (lit !== s.lit) {
        s.spans.forEach((sp, i) => sp.classList.toggle("is-lit", i < lit));
        s.lit = lit;
      }
    }

    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1, y / px.docH).toFixed(4)})`;
    updateHeader(y);

    if (mouseMoving) requestTick();
  }

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  }

  function setupMotion() {
    collectParallax();
    window.addEventListener("scroll", requestTick, { passive: true });

    let resizeRaf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("load", scheduleMeasure);
    if ("ResizeObserver" in window) new ResizeObserver(scheduleMeasure).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleMeasure);

    if (hero && finePointer && !reduceMotion) {
      hero.addEventListener("pointermove", (e) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        requestTick();
      });
      hero.addEventListener("pointerleave", () => { mouse.tx = 0; mouse.ty = 0; requestTick(); });
    }
    measure();
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  applyTheme();
  bindContent();
  buildMembers();
  buildPolicies();
  buildSocials();
  $$('[data-reveal="words"]').forEach(splitWords);
  setupScrub();
  setupNav();
  setupReveal();
  setupCounters();
  watchMembers();
  rosterPreview();
  setupMotion();
  root.classList.add("ready");
})();
