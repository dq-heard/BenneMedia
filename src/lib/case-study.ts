import { LINK_FIELDS, type LinkData } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

const IMG = `{asset, alt, decorative, hotspot, crop}`;

interface Raw {
  title: string;
  developer?: string;
  releaseDate?: string;
  genres?: string[];
  services?: { title: string }[];
  cover?: Img;
  shortDescription?: string;
  steamUrl?: string;
  ctaText?: string;
  wishlistCtaText?: string;
  tagline?: string;
  challenge?: string;
  stats?: { label: string; value: string }[];
  goal?: string;
  strategy?: string;
  gallery?: { image: Img; size?: "normal" | "wide" | "tall" | "big" }[];
  whatMoved?: string[];
  fieldNotes?: string[];
  landscapeCover?: Img;
  description?: string;
  closingHeading?: string;
  closingBody?: string;
  seo?: { title?: string; description?: string; image?: Img };
  defaults?: {
    closingHeading?: string;
    closingBody?: string;
    defaultCta?: LinkData;
  };
}

export async function getCaseStudySlugs() {
  return client.fetch<string[]>(
    `*[_type == "caseStudy" && defined(slug.current)].slug.current`
  );
}

export async function getCaseStudy(slug: string) {
  const c = await client.fetch<Raw>(
    `*[_type == "caseStudy" && slug.current == $slug][0]{
      title, developer, releaseDate, genres,
      "services": services[]->{title},
      cover${IMG}, shortDescription, steamUrl, ctaText, wishlistCtaText,
      tagline, challenge, stats[]{label, value}, goal, strategy,
      gallery[]{image${IMG}, size},
      whatMoved, fieldNotes, landscapeCover${IMG}, description,
      closingHeading, closingBody, seo,
      "defaults": *[_type == "siteSettings"][0]{closingHeading, closingBody, defaultCta${LINK_FIELDS}}
    }`,
    { slug }
  );
  if (!c) return null;
  const link = await getLinkResolver();
  const released = !!c.releaseDate && new Date(c.releaseDate) <= new Date();
  return {
    ...c,
    services: (c.services ?? []).filter(Boolean),
    genres: c.genres ?? [],
    stats: c.stats ?? [],
    gallery: (c.gallery ?? []).filter((g) => g?.image),
    whatMoved: c.whatMoved ?? [],
    fieldNotes: c.fieldNotes ?? [],
    dateLabel: c.releaseDate
      ? new Date(`${c.releaseDate}T00:00:00Z`).toLocaleDateString("en-US", {
          dateStyle: "long",
          timeZone: "UTC",
        })
      : "TBD",
    heroCta: c.ctaText || "View on Steam",
    splitCta:
      c.wishlistCtaText || (released ? "Play on Steam" : "Wishlist on Steam"),
    closingHeading: c.closingHeading || c.defaults?.closingHeading,
    closingBody: c.closingBody || c.defaults?.closingBody,
    closingCta: link(c.defaults?.defaultCta),
  };
}
