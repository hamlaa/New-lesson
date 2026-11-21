import { ImageResponse } from "next/og";
import { party } from "@/data/party";
import { OG_SIZE, publicDataUri } from "@/lib/og";
import { plain } from "@/lib/site";

export const alt = `${party.partyName} — Student council party of ${party.schoolName}`;
export const size = OG_SIZE;
export const contentType = "image/png";

/* Share preview for LINE / Facebook / X (1200×630), generated at build time */
export default async function OpengraphImage() {
  const [bg, logo] = await Promise.all([publicDataUri(party.heroImage), publicDataUri(party.logo)]);
  const navy = party.theme.text;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: party.theme.primary, color: navy }}>
        {bg && <img src={bg} width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, display: "flex", background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.92) 55%, #fff 100%)" }} />
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", fontSize: 200, fontWeight: 800, letterSpacing: -12, color: "rgba(255,255,255,.9)" }}>
          {party.partyName}
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, bottom: 56, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>
              {party.schoolName} · {party.hero.eyebrow}
            </div>
            <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -3, marginTop: 10 }}>{plain(party.hero.headline)}</div>
            <div style={{ display: "flex", fontSize: 34, marginTop: 6, opacity: 0.8 }}>{party.slogan}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {logo && <img src={logo} width={120} height={120} style={{ borderRadius: 34 }} />}
            <div style={{ display: "flex", marginTop: 14, padding: "8px 22px", borderRadius: 999, background: navy, color: "#fff", fontSize: 30, fontWeight: 700 }}>
              Vote No. {party.ballotNumber}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
