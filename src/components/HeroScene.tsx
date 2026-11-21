import type { CSSProperties } from "react";

/* =====================================================================
   Layered vector illustration for the hero (sky above, sea below).
   Every layer is its own absolutely-positioned element so it can move
   at its own parallax speed (data-parallax / data-mouse → MotionEngine).
   The water line is the CSS variable --wl (set in hero.css).
   ===================================================================== */

/* ---------- Sun & rays (top-left) ---------- */
function SunRays() {
  const rays: [number, number][] = [[6, 11], [16, 19], [24, 31], [37, 40], [46, 53], [59, 62], [68, 74], [80, 84]];
  const L = 1600;
  const pt = (deg: number) => `${(Math.cos((deg * Math.PI) / 180) * L).toFixed(0)},${(Math.sin((deg * Math.PI) / 180) * L).toFixed(0)}`;
  return (
    <svg className="sea-rays" viewBox="0 0 1000 1000" data-mouse="6">
      <defs>
        <radialGradient id="ray-fade" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(1100)">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-glow">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".35" stopColor="#fff3b8" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="sea-rays__fan">
        {rays.map(([a, b]) => <polygon key={a} points={`0,0 ${pt(a)} ${pt(b)}`} fill="url(#ray-fade)" />)}
      </g>
      <circle cx="70" cy="70" r="260" fill="url(#sun-glow)" />
      <circle cx="70" cy="70" r="70" fill="#fffbe6" />
    </svg>
  );
}

/* ---------- Low-poly clouds ---------- */
function Cloud({ className, parallax, mouse, flip = false }: { className: string; parallax: string; mouse: string; flip?: boolean }) {
  return (
    <svg className={`sea-cloud ${className}`} viewBox="0 0 300 120" data-parallax={parallax} data-mouse={mouse}
      style={flip ? ({ "--flip": -1 } as CSSProperties) : undefined}>
      <polygon points="8,112 38,72 78,64 104,30 150,16 192,40 218,32 252,60 278,72 296,112" fill="#ffffff" />
      <polygon points="150,16 192,40 176,112 118,112" fill="#e9f6ff" />
      <polygon points="218,32 252,60 278,72 296,112 226,112" fill="#d6ecfd" />
      <polygon points="8,112 38,72 78,64 70,112" fill="#f3faff" />
      <polygon points="104,30 150,16 118,112 78,64" fill="#ffffff" />
      <polygon points="192,40 218,32 226,112 176,112" fill="#e1f1fe" />
    </svg>
  );
}

/* ---------- Sailboat with crew ---------- */
function Boat() {
  return (
    <div className="sea-boat">
      <svg viewBox="0 0 420 420" className="sea-boat__svg">
        <defs>
          <clipPath id="hull-clip"><path d="M26 300 L394 294 L352 366 Q205 386 72 364 Z" /></clipPath>
        </defs>
        {/* stays */}
        <path d="M209 38 L392 294 M209 38 L32 300" stroke="#4b3a2e" strokeWidth="1.6" opacity=".7" />
        {/* main sail (tan) */}
        <path d="M202 52 Q128 158 62 276 L202 276 Z" fill="#e8c68c" />
        <path d="M202 52 L202 276 L176 276 Q186 160 202 52 Z" fill="#d6ab6a" />
        <path d="M184 120 L84 236 M196 86 L120 196" stroke="#cfa262" strokeWidth="1.4" opacity=".7" />
        {/* jib (front sail) */}
        <path d="M216 62 L366 286 L220 278 Z" fill="#f1d6a3" />
        <path d="M216 62 L220 278 L246 280 Z" fill="#e2bd80" />
        {/* boom & mast */}
        <path d="M202 279 L56 282" stroke="#6b4428" strokeWidth="6" strokeLinecap="round" />
        <rect x="203" y="36" width="9" height="266" rx="3" fill="#7a4f2f" />
        <path className="sea-boat__flag" d="M208 22 L244 31 L208 40 Z" fill="#e2453c" />
        <rect x="206" y="20" width="4" height="22" fill="#7a4f2f" />
        {/* climber on the mast */}
        <g>
          <path d="M207 146 L198 124 M212 146 L220 122" stroke="#f0b98d" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="199" y="144" width="17" height="27" rx="6" fill="#f6c343" />
          <circle cx="208" cy="137" r="8" fill="#f0b98d" />
          <path d="M200 132 Q208 124 216 132 Z" fill="#3a2b22" />
          <path d="M202 170 L194 192 L203 200 M213 170 L222 186 L214 196" stroke="#23406b" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* lookout at the bow with binoculars */}
        <g>
          <path d="M343 296 L346 274 M354 296 L352 274" stroke="#23406b" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="340" y="249" width="18" height="28" rx="6" fill="#2f7fe0" transform="rotate(8 349 263)" />
          <path d="M356 256 L366 247 M352 258 L364 250" stroke="#f0b98d" strokeWidth="4" strokeLinecap="round" />
          <circle cx="356" cy="240" r="8" fill="#f0b98d" />
          <path d="M348 236 Q355 228 364 234 L362 238 Z" fill="#e2453c" />
          <rect x="363" y="239" width="11" height="6" rx="2" fill="#1d2633" />
          <rect x="363" y="235" width="11" height="4" rx="1.5" fill="#1d2633" />
        </g>
        {/* cabin */}
        <rect x="128" y="280" width="64" height="22" rx="4" fill="#ffffff" />
        <rect x="138" y="286" width="12" height="9" rx="2" fill="#5bb4f0" />
        <rect x="158" y="286" width="12" height="9" rx="2" fill="#5bb4f0" />
        {/* hull: white top band, navy stripe, red bottom */}
        <g clipPath="url(#hull-clip)">
          <rect x="0" y="280" width="420" height="140" fill="#d83a33" />
          <rect x="0" y="280" width="420" height="38" fill="#ffffff" />
          <rect x="0" y="316" width="420" height="8" fill="#1f3550" />
          <path d="M0 340 L420 340" stroke="#b72f29" strokeWidth="10" opacity=".5" />
        </g>
        <path d="M26 300 L394 294" stroke="#c9d6e4" strokeWidth="3" />
        {/* bow spray */}
        <path d="M384 316 q10 -8 18 -2 M376 324 q12 -6 22 2" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".9" />
      </svg>
    </div>
  );
}

/* ---------- Cliff + lighthouse (above water) ---------- */
function Lighthouse() {
  // tapered tower: bottom y=236 (x 262–318) → top y=90 (x 272–308)
  const xl = (y: number) => 262 + ((236 - y) * 10) / 146;
  const xr = (y: number) => 318 - ((236 - y) * 10) / 146;
  const band = (y1: number, y2: number) => `${xl(y1)},${y1} ${xr(y1)},${y1} ${xr(y2)},${y2} ${xl(y2)},${y2}`;
  return (
    <svg className="sea-cliff" viewBox="0 0 400 420">
      <defs>
        <linearGradient id="beam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fff6c4" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff6c4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon className="sea-cliff__beam" points="290,62 -260,-40 -260,150 290,74" fill="url(#beam)" />
      {/* rock */}
      <polygon points="40,420 68,362 96,330 122,300 152,262 192,240 242,232 300,236 352,250 400,246 400,420" fill="#9a6a49" />
      <polygon points="40,420 68,362 96,330 132,420" fill="#b8835c" />
      <polygon points="96,330 122,300 152,262 176,330 168,420 132,420" fill="#a8744f" />
      <polygon points="152,262 192,240 214,300 176,330" fill="#c08b62" />
      <polygon points="214,300 260,290 300,330 262,420 168,420 176,330" fill="#7d533a" />
      <polygon points="300,330 352,300 400,320 400,420 262,420" fill="#6a4532" />
      <polygon points="260,290 300,250 352,262 352,300 300,330" fill="#8b5d41" />
      {/* grass cap */}
      <polygon points="150,266 192,238 242,229 300,233 352,247 400,243 400,258 352,264 300,250 242,246 194,254 162,276" fill="#62bd55" />
      <polygon points="242,229 300,233 352,247 400,243 400,258 352,264 300,250 242,246" fill="#4ea444" />
      {/* keeper's house */}
      <rect x="204" y="206" width="46" height="32" fill="#ffffff" />
      <polygon points="198,208 227,186 256,208" fill="#d83a33" />
      <rect x="221" y="218" width="12" height="20" rx="2" fill="#2d3a4a" />
      {/* tower */}
      <polygon points={band(236, 90)} fill="#ffffff" />
      <polygon points={band(236, 206)} fill="#e2453c" />
      <polygon points={band(176, 146)} fill="#e2453c" />
      <polygon points={band(118, 92)} fill="#e2453c" />
      <polygon points={`${xr(236)},236 ${xr(90)},90 ${xr(90) - 8},90 ${xr(236) - 12},236`} fill="#000" opacity=".1" />
      <path d="M284 236 L284 220 Q290 212 296 220 L296 236 Z" fill="#2d3a4a" />
      {/* gallery, lantern, dome */}
      <rect x="262" y="82" width="56" height="9" rx="2" fill="#2d3a4a" />
      <rect x="274" y="54" width="32" height="28" fill="#ffe37a" className="sea-cliff__lamp" />
      <path d="M284 54 V82 M296 54 V82" stroke="#2d3a4a" strokeWidth="2.5" />
      <path d="M270 55 Q290 26 310 55 Z" fill="#d83a33" />
      <rect x="288" y="22" width="4" height="12" fill="#2d3a4a" />
    </svg>
  );
}

/* ---------- Cliff base (under water) ---------- */
function CliffBase() {
  return (
    <svg className="sea-cliff-base" viewBox="0 0 400 640">
      <polygon points="40,0 400,0 400,640 196,640 150,470 118,300 78,150 52,52" fill="#1b5c94" />
      <polygon points="40,0 132,0 150,90 78,150 52,52" fill="#2470ab" />
      <polygon points="150,90 262,0 400,0 400,180 238,210" fill="#16507f" />
      <polygon points="78,150 150,90 238,210 214,380 118,300" fill="#134670" />
      <polygon points="118,300 214,380 400,300 400,640 196,640 150,470" fill="#0f3d64" />
      <polygon points="214,380 238,210 400,180 400,300" fill="#12466f" />
    </svg>
  );
}

/* ---------- Water surface strip (the cross-section line) ---------- */
const surfaceSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="30" viewBox="0 0 240 30"><path d="M0 12 Q30 4 60 12 T120 12 T180 12 T240 12" fill="none" stroke="#e8f8ff" stroke-width="3"/><path d="M0 20 Q30 14 60 20 T120 20 T180 20 T240 20" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="2"/></svg>`;
const surfaceBg = { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(surfaceSvg)}")` } as CSSProperties;

/* ---------- Underwater light shafts ---------- */
function Shafts() {
  const shafts = [60, 230, 420, 610, 820, 1010];
  return (
    <svg className="sea-shafts" viewBox="0 0 1200 600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {shafts.map((x, i) => (
        <polygon key={x} className="sea-shafts__beam" style={{ "--i": i } as CSSProperties}
          points={`${x},0 ${x + 46},0 ${x + 250},600 ${x + 130},600`} fill="url(#shaft)" />
      ))}
    </svg>
  );
}

/* ---------- School of glowing fish (bottom right) ---------- */
function FishSchool() {
  const fish = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    return {
      x: 60 + t * 470 + Math.sin(i * 1.7) * 34,
      y: 290 - t * 190 + Math.cos(i * 2.3) * 46,
      s: 0.7 + ((i * 37) % 10) / 22,
      i,
    };
  });
  return (
    <svg className="sea-fish" viewBox="0 0 600 360" data-parallax="0.05" data-mouse="22">
      <defs>
        <linearGradient id="fish-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8ffff" />
          <stop offset=".5" stopColor="#5ff0ff" />
          <stop offset="1" stopColor="#21b8f0" />
        </linearGradient>
      </defs>
      <g className="sea-fish__school">
        {fish.map((f) => (
          <g key={f.i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${f.s.toFixed(2)})`}>
            <g className="sea-fish__one" style={{ "--i": f.i } as CSSProperties}>
              <path d="M14 0 L30 -9 L26 0 L30 9 Z" fill="#7ff4ff" />
              <ellipse cx="0" cy="0" rx="19" ry="7.5" fill="url(#fish-body)" />
              <path d="M-2 -6 L6 -12 L8 -6 Z" fill="#9ff7ff" />
              <circle cx="-11" cy="-1.5" r="1.6" fill="#073a5c" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- Seabed silhouettes (bottom left) ---------- */
function Seabed() {
  return (
    <svg className="sea-bed" viewBox="0 0 600 160" preserveAspectRatio="xMinYMax meet">
      <path d="M0 160 L0 96 Q60 70 110 92 Q170 50 240 88 Q300 112 360 104 Q430 96 470 128 Q520 150 600 160 Z" fill="#052347" />
      <path d="M0 160 L0 126 Q80 104 160 124 Q260 150 380 140 L420 160 Z" fill="#031a38" />
      {[[70, 96, 0], [96, 100, 1], [196, 76, 2], [228, 84, 3], [322, 106, 4]].map(([x, y, i]) => (
        <path key={i} className="sea-weed" style={{ "--i": i } as CSSProperties}
          d={`M${x} ${y} q-12 -30 4 -56 q14 -24 -2 -52`} stroke="#0f5f73" strokeWidth="7" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function Bubbles() {
  const list = [
    { l: "18%", b: "22%", s: 10, i: 0 }, { l: "22%", b: "30%", s: 6, i: 1 }, { l: "27%", b: "16%", s: 8, i: 2 },
    { l: "71%", b: "26%", s: 7, i: 3 }, { l: "76%", b: "18%", s: 11, i: 4 }, { l: "84%", b: "34%", s: 6, i: 5 },
    { l: "48%", b: "12%", s: 7, i: 6 }, { l: "56%", b: "24%", s: 5, i: 7 },
  ];
  return (
    <div className="sea-bubbles">
      {list.map((b) => (
        <span key={b.i} style={{ left: b.l, bottom: b.b, width: b.s, height: b.s, "--i": b.i } as CSSProperties} />
      ))}
    </div>
  );
}

export function HeroScene() {
  return (
    <div className="hero__scene" aria-hidden="true">
      {/* sky (hero background gradient) + sun rays + clouds */}
      <SunRays />
      <Cloud className="sea-cloud--1" parallax="0.34" mouse="16" />
      <Cloud className="sea-cloud--2" parallax="0.28" mouse="24" flip />
      <Cloud className="sea-cloud--3" parallax="0.22" mouse="30" />
      <Cloud className="sea-cloud--4" parallax="0.3" mouse="20" flip />

      {/* everything tied to the water line moves together */}
      <div className="sea-level" data-parallax="0.1" data-mouse="6">
        <Lighthouse />
        <Boat />
        <div className="sea-water" />
        <Shafts />
        <CliffBase />
        <div className="sea-surface" style={surfaceBg} />
        <Seabed />
        <Bubbles />
      </div>

      <FishSchool />
    </div>
  );
}
