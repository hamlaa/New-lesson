import { party, type Member } from "@/data/party";
import { absoluteUrl, memberPath, realSocialUrls, SITE_URL } from "./site";

/* schema.org structured data — helps Google understand who/what/where. */

const ORG_ID = `${SITE_URL}/#party`;
const SCHOOL_ID = `${SITE_URL}/#school`;
const SITE_ID = `${SITE_URL}/#website`;

const school = () => ({
  "@type": "HighSchool",
  "@id": SCHOOL_ID,
  name: party.schoolName,
  alternateName: party.schoolNameThai,
  address: {
    "@type": "PostalAddress",
    addressLocality: party.seo.locality,
    addressRegion: party.seo.region,
    addressCountry: party.seo.country,
  },
});

export const personNode = (m: Member) => ({
  "@type": "Person",
  "@id": `${absoluteUrl(memberPath(m))}#person`,
  name: m.name,
  ...(m.nameThai ? { alternateName: [m.nameThai, m.nickname].filter(Boolean) } : m.nickname ? { alternateName: m.nickname } : {}),
  jobTitle: m.positionThai ? `${m.position} (${m.positionThai})` : m.position,
  description: m.description,
  ...(m.image ? { image: absoluteUrl(m.image) } : {}),
  url: absoluteUrl(memberPath(m)),
  memberOf: { "@id": ORG_ID },
  affiliation: { "@id": SCHOOL_ID },
});

export function homeJsonLd() {
  const sameAs = realSocialUrls();
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: absoluteUrl("/"),
      name: `${party.partyName} — ${party.partyNameThai}`,
      alternateName: [party.partyNameThai, `${party.partyName} ${party.schoolName}`],
      inLanguage: ["en", "th"],
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: party.partyName,
      alternateName: party.partyNameThai,
      slogan: party.slogan,
      description: party.seo.description,
      url: absoluteUrl("/"),
      logo: absoluteUrl(party.logo),
      parentOrganization: { "@id": SCHOOL_ID },
      member: party.members.map((m) => ({ "@id": `${absoluteUrl(memberPath(m))}#person` })),
      ...(sameAs.length ? { sameAs } : {}),
    },
    school(),
    ...party.members.map(personNode),
  ];

  if (party.electionDateISO) {
    graph.push({
      "@type": "Event",
      name: `${party.schoolName} Student Council Election — ${party.schoolNameThai} เลือกตั้งสภานักเรียน`,
      startDate: party.electionDateISO,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: party.schoolName, address: school().address },
      organizer: { "@id": SCHOOL_ID },
      description: `${party.partyName} — ballot No. ${party.ballotNumber}`,
      image: absoluteUrl("/opengraph-image"),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function memberJsonLd(m: Member) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        url: absoluteUrl(memberPath(m)),
        name: `${m.name} — ${party.partyName}`,
        isPartOf: { "@id": SITE_ID },
        mainEntity: { "@id": `${absoluteUrl(memberPath(m))}#person` },
      },
      personNode(m),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: party.partyName, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Team", item: absoluteUrl("/#team") },
          { "@type": "ListItem", position: 3, name: m.name, item: absoluteUrl(memberPath(m)) },
        ],
      },
      { "@type": "Organization", "@id": ORG_ID, name: party.partyName, url: absoluteUrl("/") },
      school(),
    ],
  };
}
