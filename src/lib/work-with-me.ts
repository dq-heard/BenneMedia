import { LINK_FIELDS, type LinkData, type ResolvedLink } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

const IMG = `{asset, alt, decorative, hotspot, crop}`;

const QUERY = `*[_type == "workWithMePage"][0]{
  "slug": slug.current,
  intro{heading, paragraphs, cta${LINK_FIELDS}},
  packageHeading, packageIntro,
  "packages": *[_type == "servicePackage" && defined(slug.current)] | order(order asc){_id, title, "slug": slug.current, lead, summary, ctaLabel},
  pathsHeading,
  paths[]{title, body, cta${LINK_FIELDS}},
  who{heading, intro, items},
  caseStudiesHeading,
  "caseStudies": caseStudies[]->{_id, title, "slug": slug.current, landscapeCover${IMG}, cardProblem, cardStrategy, cardResult},
  closingHeading, closingCta${LINK_FIELDS},
  seo,
  "defaults": *[_type == "siteSettings"][0]{closingHeading, defaultCta${LINK_FIELDS}}
}`;

interface Raw {
  slug?: string;
  intro?: { heading: string; paragraphs?: string[]; cta?: LinkData };
  packageHeading?: string;
  packageIntro?: string;
  summary?: string;
  packages?: {
    _id: string;
    title: string;
    slug: string;
    lead: string;
    summary: string;
    ctaLabel: string;
  }[];
  pathsHeading?: string;
  paths?: { title: string; body?: string; cta?: LinkData }[];
  who?: { heading: string; intro?: string; items?: string[] };
  caseStudiesHeading?: string;
  caseStudies?: {
    _id: string;
    title: string;
    slug: string;
    landscapeCover?: Img;
    cardProblem?: string;
    cardStrategy?: string;
    cardResult?: string;
  }[];
  closingHeading?: string;
  closingCta?: LinkData;
  seo?: { title?: string; description?: string; image?: Img };
  defaults?: { closingHeading?: string; defaultCta?: LinkData };
}

export async function getWorkWithMe() {
  const raw = await client.fetch<Raw>(QUERY);
  if (!raw) return null;
  const link = await getLinkResolver();
  return {
    ...raw,
    intro: raw.intro && {
      ...raw.intro,
      paragraphs: raw.intro.paragraphs ?? [],
      cta: link(raw.intro.cta),
    },
    packages: (raw.packages ?? []).filter(Boolean),
    paths: (raw.paths ?? []).map((p) => ({ ...p, cta: link(p.cta) })),
    caseStudies: (raw.caseStudies ?? []).filter(Boolean),
    closingHeading: raw.closingHeading || raw.defaults?.closingHeading,
    closingCta: link(raw.closingCta) ?? link(raw.defaults?.defaultCta),
  };
}

export type WorkWithMe = NonNullable<Awaited<ReturnType<typeof getWorkWithMe>>>;
export type { ResolvedLink };
