import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./sanity";
import {
  LINK_FIELDS,
  resolveLink,
  type LinkData,
  type ResolvedLink,
  type SiteUrls,
} from "./links";

export interface SiteLink {
  label: string;
  href: string;
  newTab?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  children?: SiteLink[];
}

export interface SiteSettings {
  brandName: string;
  shortName?: string;
  logo?: SanityImageSource;
  footerLogo?: SanityImageSource;
  footerText?: string;
  quizUrl?: string;
  bookingUrl?: string;
  orgDescription?: string;
  founderName?: string;
  navCta?: SiteLink;
  nav: NavItem[];
  socials: { platform: string; url: string }[];
  footerColumns: { heading: string; links: SiteLink[] }[];
}

// One query for everything the layout needs. The dropdown contents come from
// the collections, so a new case study or guide appears in the menu on its own.
const QUERY = `*[_type == "siteSettings"][0]{
  brandName, shortName, logo, footerLogo, footerText, quizUrl, bookingUrl, orgDescription, founderName,
  "quizId": *[_type == "homePage"][0].quiz.typeformId,
  navCta${LINK_FIELDS},
  socials[]{platform, url},
  footerColumns[]{heading, links[]${LINK_FIELDS}},
  nav[]{link${LINK_FIELDS}, dropdownSource},
  "caseStudies": *[_type == "caseStudy"] | order(releaseDate desc){title, "slug": slug.current},
  "guides": *[_type == "guide"] | order(order asc){title, "slug": slug.current}
}`;

interface Raw extends Omit<
  SiteSettings,
  "nav" | "socials" | "footerColumns" | "navCta"
> {
  navCta?: LinkData;
  nav?: {
    link?: LinkData;
  }[];
  quizId?: string;
  socials?: SiteSettings["socials"];
  footerColumns?: { heading: string; links?: LinkData[] }[];
}

let cached: Promise<SiteSettings> | undefined;

/** Fetched once per build / server start, not once per page. */
export function getSiteSettings(): Promise<SiteSettings> {
  cached ??= client.fetch<Raw>(QUERY).then((raw) => {
    if (!raw)
      throw new Error(
        "No Site settings document found. Create and publish one in Studio first."
      );
    const { nav, socials, footerColumns, navCta, quizId, ...rest } = raw;

    const urls: SiteUrls = {
      quizUrl:
        rest.quizUrl ||
        (quizId ? `https://form.typeform.com/to/${quizId}` : undefined),
      bookingUrl: rest.bookingUrl,
    };
    const ok = (l: ResolvedLink | undefined): l is ResolvedLink => !!l;
    return {
      ...rest,
      quizUrl: urls.quizUrl,
      navCta: resolveLink(navCta, urls),
      nav: (nav ?? []).flatMap((n) => {
        const l = n.link && resolveLink(n.link, urls);
        return l ? [{ label: l.label, href: l.href }] : [];
      }),
      socials: socials ?? [],
      footerColumns: (footerColumns ?? []).map((c) => ({
        heading: c.heading,
        links: (c.links ?? []).map((l) => resolveLink(l, urls)).filter(ok),
      })),
    };
  });
  return cached!;
}

const clean = (p: string) =>
  p.replace(/\/index\.html$/, "/").replace(/(.)\/$/, "$1");

/** True when `href` is the current page or a parent of it (/case-studies/foo
 *  counts as being on /case-studies). */
export function isCurrent(href: string, pathname: string): boolean {
  if (!href.startsWith("/")) return false;
  const path = clean(href);
  const here = clean(pathname);
  return path === here || (path !== "/" && here.startsWith(path + "/"));
}

/** For page loaders: `const link = await getLinkResolver(); link(data.cta)` */
export async function getLinkResolver() {
  const { quizUrl, bookingUrl } = await getSiteSettings();
  return (l?: LinkData | null) => resolveLink(l, { quizUrl, bookingUrl });
}
