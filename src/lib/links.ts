/** Turns a `link` object from Sanity into a label and an address.
 *  Pages get their address from the document itself, so editing a slug
 *  (for example the Work With Me page) never breaks a link. */

export interface LinkData {
  kind?: "page" | "site" | "external";
  label?: string;
  anchor?: string;
  site?: "quiz" | "booking" | "consult" | "guides";
  external?: string;
  page?: { _type: string; slug?: string } | null;
}

export interface ResolvedLink {
  label: string;
  href: string;
  newTab?: boolean;
}

/** Use inside a GROQ projection: `navCta${LINK_FIELDS}` or `ctas[]${LINK_FIELDS}`. */
export const LINK_FIELDS = `{kind, label, anchor, site, external, "page": page->{_type, "slug": slug.current}}`;

// Keep in step with the route files in src/pages.
const PAGE_ROUTES: Record<string, string> = {
  homePage: "/",
  guidesPage: "/guides",
  caseStudiesPage: "/case-studies",
  aboutPage: "/about",
  contactPage: "/contact",
};

const COLLECTION_ROUTES: Record<string, string> = {
  caseStudy: "/case-studies",
  guide: "/guides",
  servicePackage: "/packages",
  expertise: "/expertise",
  article: "/articles",
};

const SITE_LABELS = {
  quiz: "Take the Quiz",
  booking: "Book a Call",
  consult: "Get a Free Consultation",
  guides: "Grab a Guide",
} as const;

export interface SiteUrls {
  bookingUrl: string | undefined;
  quizUrl?: string;
}

function pageHref(page: NonNullable<LinkData["page"]>): string | undefined {
  if (page._type === "workWithMePage")
    return page.slug ? `/${page.slug}` : undefined;
  if (page._type in PAGE_ROUTES) return PAGE_ROUTES[page._type];
  const base = COLLECTION_ROUTES[page._type];
  return base && page.slug ? `${base}/${page.slug}` : undefined;
}

const isOutside = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function resolveLink(
  link: LinkData | null | undefined,
  urls: SiteUrls
): ResolvedLink | undefined {
  if (!link) return undefined;

  let href: string | undefined;
  let label = link.label;

  if (link.kind === "external") {
    href = link.external;
  } else if (link.kind === "site" && link.site) {
    href =
      link.site === "quiz"
        ? urls.quizUrl
        : link.site === "consult"
          ? urls.bookingUrl
          : link.site === "booking"
            ? PAGE_ROUTES.contactPage
            : PAGE_ROUTES.guidesPage;
    label ||= SITE_LABELS[link.site];
  } else if (link.page) {
    href = pageHref(link.page);
    if (href && link.anchor) href += `#${link.anchor}`;
  }

  if (!href || !label) return undefined;
  return {
    label,
    href,
    newTab:
      isOutside(href) &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:"),
  };
}
