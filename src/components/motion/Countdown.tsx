"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { key: "d", label: "Days", th: "วัน" },
  { key: "h", label: "Hours", th: "ชั่วโมง" },
  { key: "m", label: "Minutes", th: "นาที" },
  { key: "s", label: "Seconds", th: "วินาที" },
] as const;

type Left = Record<(typeof UNITS)[number]["key"], number> | null;

function timeLeft(target: number): Left {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Live countdown to election day (Thailand time). Digits flip when they change. */
export function Countdown({ dateISO, label, doneText }: { dateISO: string; label: string; doneText: string }) {
  const target = new Date(`${dateISO}T08:00:00+07:00`).getTime();
  const [left, setLeft] = useState<Left | undefined>(undefined); // undefined = not mounted yet (SSR)

  useEffect(() => {
    setLeft(timeLeft(target));
    const id = window.setInterval(() => setLeft(timeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left === null) return <p className="countdown countdown--done">{doneText}</p>;

  return (
    <div className="countdown" role="timer" aria-label={label}>
      <p className="countdown__label">{label}</p>
      <div className="countdown__grid">
        {UNITS.map((u) => {
          const v = left ? String(left[u.key]).padStart(2, "0") : "--";
          return (
            <div className="countdown__cell" key={u.key}>
              <span className="countdown__num" aria-hidden={u.key === "s" || undefined}>
                {v.split("").map((c, i) => (
                  <span className="countdown__digit" key={`${i}-${c}`}>{c}</span>
                ))}
              </span>
              <span className="countdown__unit">{u.label} <span lang="th">· {u.th}</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
