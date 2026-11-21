import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Intro } from "@/components/Intro";
import { JsonLd } from "@/components/JsonLd";
import { MemberHud } from "@/components/MemberHud";
import { MemberSection } from "@/components/MemberSection";
import { Cinematics } from "@/components/motion/Cinematics";
import { MotionEngine } from "@/components/MotionEngine";
import { Pledge } from "@/components/Pledge";
import { Closing, Footer, Policies, TeamHead } from "@/components/Sections";
import { party } from "@/data/party";
import { homeJsonLd } from "@/lib/jsonld";
import { baseOpenGraph } from "@/lib/metadata";
import { memberAnchor } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Pledge />
        <section className="team" id="team" aria-labelledby="team-title">
          <TeamHead />
          <div className="members">
            {party.members.map((m, i) => (
              <MemberSection key={m.slug} member={m} index={i} heading="h3" />
            ))}
          </div>
        </section>
        <Policies />
        <Closing />
      </main>
      <MemberHud
        items={party.members.map((m, i) => ({ anchor: memberAnchor(i), name: m.name, label: m.nickname || m.name }))}
      />
      <Footer />
      <MotionEngine />
      <Cinematics />
      <JsonLd data={homeJsonLd()} />
    </>
  );
}
