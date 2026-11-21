"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Turns a YouTube link into an embeddable URL. Returns null for other links. */
function youTubeEmbed(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0` : null;
}

const PlayIcon = () => (
  <span className="hero__play-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
  </span>
);

/**
 * Big translucent play button in the hero.
 * With a video (YouTube or .mp4) it opens a modal player;
 * without one it simply links to the team section.
 */
export function HeroPlay({ videoUrl, label, fallbackHref }: { videoUrl: string; label: string; fallbackHref: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const embed = videoUrl ? youTubeEmbed(videoUrl) : null;

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  if (!videoUrl) {
    return (
      <a className="hero__play" href={fallbackHref} aria-label={label} data-reveal="fade" style={{ "--d": ".8s" } as CSSProperties}>
        <PlayIcon />
      </a>
    );
  }

  return (
    <>
      <button className="hero__play" type="button" aria-label={label} onClick={() => setOpen(true)}
        data-reveal="fade" style={{ "--d": ".8s" } as CSSProperties}>
        <PlayIcon />
      </button>
      <dialog
        ref={dialogRef}
        className="video-modal"
        aria-label={label}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <button className="video-modal__close" type="button" aria-label="Close video" onClick={() => setOpen(false)}>×</button>
        {open && (embed ? (
          <iframe src={embed} title={label} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        ) : (
          <video src={videoUrl} controls autoPlay playsInline />
        ))}
      </dialog>
    </>
  );
}
