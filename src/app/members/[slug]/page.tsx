import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { MemberSection } from "@/components/MemberSection";
import { MotionEngine } from "@/components/MotionEngine";
import { Closing, Footer } from "@/components/Sections";
import { party } from "@/data/party";
import { memberJsonLd } from "@/lib/jsonld";
import { baseOpenGraph } from "@/lib/metadata";
import { findMember, memberPath } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/* Every member page is pre-rendered at build time (fast + fully crawlable) */
export const dynamicParams = false;
export function generateStaticParams() {
  return party.members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findMember(slug);
  if (!found) return {};
  const m = found.member;
  const title = `${m.name}${m.nickname ? ` (${m.nickname})` : ""} — ${m.positionThai || m.position}`;
  const thai = [m.nameThai, m.positionThai].filter(Boolean).join(" · ");
  const description = `${thai ? `${thai} — ` : ""}พรรค ${party.partyName} ${party.schoolNameThai}. ${m.description}`.slice(0, 300);
  const [firstName, ...rest] = m.name.split(/\s+/);
  return {
    title,
    description,
    keywords: [m.name, m.nameThai, m.nickname, m.position, m.positionThai, ...party.seo.keywords].filter(Boolean) as string[],
    alternates: { canonical: memberPath(m) },
    openGraph: {
      ...baseOpenGraph,
      type: "profile",
      url: memberPath(m),
      title,
      description,
      firstName,
      lastName: rest.join(" "),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params;
  const found = findMember(slug);
  if (!found) notFound();
  const { member, index } = found;
  const others = party.members.filter((m) => m.slug !== member.slug);

  return (
    <>
      <Header onHome={false} />
      <main id="main">
        <span id="top" />
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol className="container">
            <li><Link href="/">{party.partyName}</Link></li>
            <li><a href="/#team">Team</a></li>
            <li aria-current="page">{member.name}</li>
          </ol>
        </nav>

        <MemberSection member={member} index={index} heading="h1" profileLink={false} eager />

        <section className="others" aria-labelledby="others-title">
          <div className="container">
            <p className="kicker"><span className="kicker__line" aria-hidden="true" />{party.teamSection.kicker}</p>
            <h2 className="others__title" id="others-title">More from the <em>{party.partyName}</em> team</h2>
            <ul className="others__grid">
              {others.map((m) => (
                <li key={m.slug}>
                  <Link className="other-card" href={memberPath(m)}>
                    <span className="other-card__photo">
                      {m.image && (
                        <Image src={m.image} alt="" fill sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw" />
                      )}
                      <span className="other-card__num">{m.number}</span>
                    </span>
                    <span className="other-card__name">{m.name}</span>
                    {m.nameThai && <span className="other-card__thai" lang="th">{m.nameThai}</span>}
                    <span className="other-card__pos">{m.position}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <a className="btn btn--primary others__back" href="/#team">
              <Icon name="arrowLeft" /> All candidates
            </a>
          </div>
        </section>

        <Closing ctaBase="/" />
      </main>
      <Footer />
      <MotionEngine />
      <JsonLd data={memberJsonLd(member)} />
    </>
  );
}
