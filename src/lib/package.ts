import { LINK_FIELDS, type LinkData, type ResolvedLink } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

const IMG = `{asset, alt, decorative, hotspot, crop}`;
const TIER = `{description, deliverables}`;

type TierKey = "roadmap" | "build" | "execute";

interface Raw {
  title: string;
  heroDescription?: string;
  intro?: string[];
  included?: string[];
  lead?: string;
  whoItsFor?: string[];
  problem?: string;
  outcome?: string;
  ctaHeading?: string;
  ctaBody?: string;
  cta?: LinkData;
  faq?: { question: string; answer: string }[];
  roadmap?: { description?: string; deliverables?: string[] };
  build?: { description?: string; deliverables?: string[] };
  execute?: { description?: string; deliverables?: string[] };
  roadmapGuide?: { slug: string };
  capabilities?: { title: string; slug: string }[];
  caseStudies?: {
    _id: string;
    title: string;
    slug: string;
    landscapeCover?: Img;
    cardProblem?: string;
    cardStrategy?: string;
    cardResult?: string;
  }[];
  guides?: {
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
  }[];
  seo?: { title?: string; description?: string; image?: Img };
  tiers?: {
    heading?: string;
    intro?: string;
    items?: {
      key: TierKey;
      name: string;
      tagline?: string;
      body?: string;
      buttonLabel?: string;
    }[];
  };
  packageCta?: { heading?: string; body?: string; cta?: LinkData };
  hubSlug: string;
}

export async function getPackageSlugs() {
  return client.fetch<string[]>(
    `*[_type == "servicePackage" && defined(slug.current)].slug.current`
  );
}

export async function getPackage(slug: string) {
  const p = await client.fetch<Raw>(
    `*[_type == "servicePackage" && slug.current == $slug][0]{
      title, lead, heroDescription, intro, whoItsFor, included, problem, outcome,
      ctaHeading, cta${LINK_FIELDS}, faq[]{question, answer},
      roadmap${TIER}, build${TIER}, execute${TIER},
      "roadmapGuide": roadmapGuide->{"slug": slug.current},
      "capabilities": expertise[]->{title, "slug": slug.current},
      "caseStudies": relatedCaseStudies[]->{_id, title, "slug": slug.current, landscapeCover${IMG}, cardProblem, cardStrategy, cardResult},
      "guides": relatedGuides[]->{_id, title, "slug": slug.current, shortDescription},
      seo,
      "tiers": *[_type == "siteSettings"][0].packageTiers{heading, intro, items[]{key, name, tagline, body, buttonLabel}},
      "packageCta": *[_type == "siteSettings"][0].packageCta{heading, body, cta${LINK_FIELDS}},
      "hubSlug": *[_type == "workWithMePage"][0].slug.current, 
      }`,
    { slug }
  );
  if (!p) return null;
  const link = await getLinkResolver();

  const tiers = (p.tiers?.items ?? [])
    .filter((t) => t.key)
    .map((t) => {
      // Roadmap goes to the DIY guide when there is one; everything else goes to Contact.
      const button: ResolvedLink | undefined =
        t.key === "roadmap" && p.roadmapGuide?.slug
          ? {
              label: t.buttonLabel ?? t.name,
              href: `/guides/${p.roadmapGuide.slug}`,
            }
          : link({
              kind: "site",
              site: "booking",
              label: t.buttonLabel ?? t.name,
            });
      const extra = p[t.key];
      return {
        ...t,
        button,
        description: extra?.description,
        deliverables: extra?.deliverables ?? [],
      };
    });

  return {
    ...p,
    tiers,
    tiersHeading: p.tiers?.heading,
    tiersIntro: p.tiers?.intro,
    intro: p.intro ?? [],
    whoItsFor: p.whoItsFor ?? [],
    included: p.included ?? [],
    capabilities: (p.capabilities ?? []).filter(Boolean),
    caseStudies: (p.caseStudies ?? []).filter(Boolean),
    guides: (p.guides ?? []).filter(Boolean),
    faq: p.faq ?? [],
    ctaHeading: p.ctaHeading || p.packageCta?.heading,
    ctaBody: p.ctaBody || p.packageCta?.body,
    cta: link(p.cta) ?? link(p.packageCta?.cta),
    hubSlug: p.hubSlug,
  };
}
