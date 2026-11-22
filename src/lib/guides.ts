import { LINK_FIELDS, type LinkData } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

const IMG = `{asset, alt, decorative, hotspot, crop}`;

export interface GuideCard {
  _id: string;
  title: string;
  slug: string;
  cover: Img;
  shortDescription?: string;
}

export async function getGuidesPage() {
  const page = await client.fetch<{
    intro?: { heading: string; paragraphs?: string[] };
    guidesHeading?: string;
    seo?: { title?: string; description?: string; image?: Img };
  }>(
    `*[_type == "guidesPage"][0]{intro{heading, paragraphs}, guidesHeading, seo}`
  );
  const guides = await client.fetch<GuideCard[]>(
    `*[_type == "guide" && defined(slug.current)] | order(order asc){_id, title, "slug": slug.current, cover${IMG}, shortDescription}`
  );
  return {
    intro: page?.intro && {
      ...page.intro,
      paragraphs: page.intro.paragraphs ?? [],
    },
    guidesHeading: page?.guidesHeading,
    seo: page?.seo,
    guides,
  };
}

export async function getGuideSlugs() {
  return client.fetch<string[]>(
    `*[_type == "guide" && defined(slug.current)].slug.current`
  );
}

interface RawGuide {
  title: string;
  cover: Img;
  shortDescription?: string;
  fullDescription?: string[];
  whoItsFor?: string;
  problemItSolves?: string;
  whatsIncluded?: string[];
  faq?: { question: string; answer: string }[];
  faqHeading?: string;
  faqCta?: LinkData;
  price?: number;
  currency?: string;
  purchaseUrl?: string;
  seo?: { title?: string; description?: string; image?: Img };
}

export async function getGuide(slug: string) {
  const g = await client.fetch<RawGuide>(
    `*[_type == "guide" && slug.current == $slug][0]{
      title, cover${IMG}, shortDescription, fullDescription, whoItsFor, problemItSolves, whatsIncluded,
      faq[]{question, answer}, faqHeading, faqCta${LINK_FIELDS},
      price, currency, purchaseUrl, seo
    }`,
    { slug }
  );
  if (!g) return null;
  const link = await getLinkResolver();
  return {
    ...g,
    faq: g.faq ?? [],
    fullDescription: g.fullDescription ?? [],
    whatsIncluded: g.whatsIncluded ?? [],
    faqCta: link(g.faqCta),
  };
}

export function formatPrice(price?: number, currency = "usd") {
  if (price == null) return undefined;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);
}
