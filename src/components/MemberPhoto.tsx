"use client";

import Image from "next/image";
import { useState } from "react";
import { initials } from "@/lib/site";

/** Portrait with a styled "Photo coming soon" fallback if the file is missing. */
export function MemberPhoto({ src, name, nickname, eager = false }: {
  src?: string; name: string; nickname?: string; eager?: boolean;
}) {
  const [failed, setFailed] = useState(!src);
  return (
    <div className={`member__frame${failed ? " is-missing" : ""}`} data-tilt="7">
      {failed ? (
        <div className="member__missing" role="img" aria-label={`Photo of ${name} coming soon`}>
          <strong>{initials(name)}</strong>
          <span>Photo coming soon</span>
        </div>
      ) : (
        <Image
          className="member__img"
          src={src!}
          alt={`Portrait of ${name}${nickname ? ` (${nickname})` : ""}`}
          fill
          sizes="(min-width: 900px) 540px, (min-width: 768px) 42vw, 92vw"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          data-parallax="-0.06"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
