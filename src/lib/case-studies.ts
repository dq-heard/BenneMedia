import { LINK_FIELDS, type LinkData } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

const IMG = `{asset, alt, decorative, hotspot, crop}`;
const MARQUEE = `{label, logos[]{name, image, url}}`;

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  shipped: "Shipped",
  "in-development": "In Development",
  archived: "Archived",
};

export interface Slide {
  _id: string;
  title: string;
  slug: string;
  status?: string;
  landscapeCover?: Img;
  cover?: Img;
  shortDescription?: string;
  services?: { title: string }[];
}

interface Marquee {
  label?: string;
  logos?: { name: string; image: Img; url?: string }[];
}

interface Raw {
  intro?: { heading: string; paragraphs?: string[]; cta?: LinkData };
  carouselLabel?: string;
  footprintHeading?: string;
  footprintBody?: string;
  footprintCta?: LinkData;
  footprintStats?: { label: string; value: string }[];
  marquee?: Marquee;
  closingHeading?: string;
  closingBody?: string;
  closingCta?: LinkData;
  seo?: { title?: string; description?: string; image?: Img };
  siteMarquee?: Marquee;
  defaults?: {
    closingHeading?: string;
    closingBody?: string;
    defaultCta?: LinkData;
  };
}

export async function getCaseStudiesPage() {
  const [page, slides, link] = await Promise.all([
    client.fetch<Raw>(`*[_type == "caseStudiesPage"][0]{
      intro{heading, paragraphs, cta${LINK_FIELDS}},
      carouselLabel,
      footprintHeading, footprintBody, footprintCta${LINK_FIELDS}, footprintStats[]{label, value},
      marquee${MARQUEE},
      closingHeading, closingBody, closingCta${LINK_FIELDS},
      seo,
      "siteMarquee": *[_type == "siteSettings"][0].marquee${MARQUEE},
      "defaults": *[_type == "siteSettings"][0]{closingHeading, closingBody, defaultCta${LINK_FIELDS}}
    }`),
    client.fetch<Slide[]>(
      `*[_type == "caseStudy" && defined(slug.current)] | order(releaseDate desc){
        _id, title, "slug": slug.current, status, landscapeCover${IMG}, cover${IMG}, shortDescription,
        "services": services[]->{title}
      }`
    ),
    getLinkResolver(),
  ]);
  if (!page) return null;
  const marquee = page.marquee?.logos?.length ? page.marquee : page.siteMarquee;
  return {
    ...page,
    intro: page.intro && {
      ...page.intro,
      paragraphs: page.intro.paragraphs ?? [],
      cta: link(page.intro.cta),
    },
    footprintCta: link(page.footprintCta),
    footprintStats: page.footprintStats ?? [],
    marquee,
    closingHeading: page.closingHeading || page.defaults?.closingHeading,
    closingBody: page.closingBody || page.defaults?.closingBody,
    closingCta: link(page.closingCta) ?? link(page.defaults?.defaultCta),
    slides: slides.filter(Boolean),
  };
}
