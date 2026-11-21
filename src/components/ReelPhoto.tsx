"use client";

import Image from "next/image";
import { useState } from "react";
import { initials } from "@/lib/site";

/** Candidate photo for the reel, with an initials placeholder if the file is missing. */
export function ReelPhoto({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <span className="reel-card__missing">{initials(name)}</span>;
  return (
    <Image
      className="reel-card__img"
      src={src!}
      alt={`Portrait of ${name}`}
      fill
      sizes="(min-width: 900px) 380px, 70vw"
      onError={() => setFailed(true)}
    />
  );
}
