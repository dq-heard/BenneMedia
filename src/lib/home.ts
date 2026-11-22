import { LINK_FIELDS, type LinkData, type ResolvedLink } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";

const IMG = `{asset, alt, decorative, hotspot, crop}`;
const STATEMENT = `{heading, paragraphs, ctas[]${LINK_FIELDS}}`;

const QUERY = `*[_type == "homePage"][0]{
  heroImage${IMG}, heroCaption, heroHeading, heroSub,
  heroCtas[]${LINK_FIELDS},
  intro${STATEMENT},
  quiz{heading, lead, options, body, typeformId, embedTitle},
  about{image${IMG}, heading, paragraphs, cta${LINK_FIELDS}},
  goals${STATEMENT},
  expertiseHeading, expertiseIntro,
  "expertise": expertise[]->{_id, title, summary},
  "marquee": *[_type == "siteSettings"][0].marquee{label, logos[]{name, image, url}}
}`;

export interface Img {
  asset?: { _ref: string };
  alt?: string;
  decorative?: boolean;
}
export interface Statement {
  heading: string;
  paragraphs: string[];
  ctas: ResolvedLink[];
}

interface Raw {
  heroImage: Img;
  heroCaption?: string;
  heroHeading: string;
  heroSub?: string;
  heroCtas?: LinkData[];
  intro?: { heading: string; paragraphs?: string[]; ctas?: LinkData[] };
  quiz?: {
    heading: string;
    lead?: string;
    options?: string[];
    body?: string;
    typeformId?: string;
    embedTitle?: string;
  };
  about?: {
    image: Img;
    heading: string;
    paragraphs?: string[];
    cta?: LinkData;
  };
  goals?: { heading: string; paragraphs?: string[]; ctas?: LinkData[] };
  expertiseHeading?: string;
  expertiseIntro?: string;
  expertise?: {
    _id: string;
    title: string;
    slug: string;
    lead: string;
    summary?: string;
    ctaLabel?: string;
  }[];
  seo?: { title?: string; description?: string; image?: Img };
  marquee?: {
    label?: string;
    logos?: { name: string; image: Img; url?: string }[];
  };
}

export async function getHome() {
  const raw = await client.fetch<Raw>(QUERY);
  if (!raw)
    throw new Error(
      "No Home page document found. Create and publish one in Studio."
    );
  const link = await getLinkResolver();
  const many = (l?: LinkData[]) =>
    (l ?? []).map((x) => link(x)).filter((x): x is ResolvedLink => !!x);
  const statement = (s?: Raw["intro"]): Statement | undefined =>
    s && {
      heading: s.heading,
      paragraphs: s.paragraphs ?? [],
      ctas: many(s.ctas),
    };

  return {
    ...raw,
    heroCtas: many(raw.heroCtas),
    intro: statement(raw.intro),
    goals: statement(raw.goals),
    about: raw.about && {
      ...raw.about,
      paragraphs: raw.about.paragraphs ?? [],
      cta: link(raw.about.cta),
    },
    expertise: (raw.expertise ?? []).filter(Boolean),
  };
}
