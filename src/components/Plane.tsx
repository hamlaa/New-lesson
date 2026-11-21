/** Small paper-plane decoration (used in the intro and closing sections). */
export function Plane({ className, parallax, mouse, fill = "#fff", fold = "#d9eeff" }: {
  className: string; parallax: string; mouse?: string; fill?: string; fold?: string;
}) {
  return (
    <svg className={`plane ${className}`} viewBox="0 0 64 64" data-parallax={parallax} data-mouse={mouse} aria-hidden="true">
      <path d="M60 6 4 28l20 7 7 21Z" fill={fill} />
      <path d="M60 6 24 35l7 21" fill={fold} />
    </svg>
  );
}
