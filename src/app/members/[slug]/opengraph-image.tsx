import { ImageResponse } from "next/og";
import { party } from "@/data/party";
import { OG_SIZE, publicDataUri } from "@/lib/og";
import { findMember } from "@/lib/site";

export const alt = `${party.partyName} candidate profile — ${party.schoolName}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return party.members.map((m) => ({ slug: m.slug }));
}

/* Per-candidate share preview: photo + name + position */
export default async function MemberOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = findMember(slug)?.member ?? party.members[0];
  const photo = await publicDataUri(m.image);
  const navy = party.theme.text;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: `linear-gradient(135deg, #ffffff 0%, ${party.theme.accent} 55%, ${party.theme.secondary} 100%)`, color: navy }}>
        <div style={{ position: "absolute", right: 380, top: -40, display: "flex", fontSize: 420, fontWeight: 800, color: "rgba(105,189,245,.22)", letterSpacing: -20 }}>
          {m.number}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", padding: "8px 20px", borderRadius: 999, background: navy, color: "#fff", fontSize: 24, fontWeight: 700, letterSpacing: 3 }}>
              LESSON {m.number}
            </div>
            <div style={{ display: "flex", marginLeft: 18, fontSize: 24, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: 0.75 }}>
              {m.position}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 800, letterSpacing: -4, lineHeight: 1, marginTop: 26 }}>
            {m.name.split(/\s+/).map((w, i) => <span key={i}>{w}</span>)}
          </div>
          {m.nickname && <div style={{ display: "flex", fontSize: 40, marginTop: 18, opacity: 0.8 }}>“{m.nickname}”</div>}
          <div style={{ display: "flex", marginTop: 34, fontSize: 28, fontWeight: 700 }}>
            {party.partyName} · {party.schoolName} · Vote No. {party.ballotNumber}
          </div>
        </div>
        {photo && (
          <img src={photo} width={440} height={550} style={{ position: "absolute", right: 56, top: 40, borderRadius: "220px 220px 32px 32px", objectFit: "cover" }} />
        )}
      </div>
    ),
    size,
  );
}
