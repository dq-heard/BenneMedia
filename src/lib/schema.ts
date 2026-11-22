import { urlFor } from "./sanity";
import { getSiteSettings } from "./site";

/** Organization for the whole site. Put it on the home page; other pages can point at its @id. */
export async function getOrganizationSchema(origin: string | URL) {
  const site = await getSiteSettings();
  const base = new URL(origin).origin;
  const mark = site.logo ?? site.footerLogo;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: site.brandName,
    url: `${base}/`,
    logo: mark ? urlFor(mark).width(512).format("png").url() : undefined,
    description: site.orgDescription || undefined,
    founder: site.founderName
      ? {
          "@type": "Person",
          "@id": `${base}/#person`,
          name: site.founderName,
          url: `${base}/about`,
        }
      : undefined,
    sameAs: site.socials.length ? site.socials.map((s) => s.url) : undefined,
  };
}

interface PersonInput {
  jobTitle?: string;
  image?: Parameters<typeof urlFor>[0];
  sameAs?: string[];
}

/** Person for the About page. Same @id as the Organization's founder, so the two are one entity. */
export async function getPersonSchema(
  origin: string | URL,
  { jobTitle, image, sameAs }: PersonInput
) {
  const site = await getSiteSettings();
  const base = new URL(origin).origin;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/#person`,
    name: site.founderName,
    jobTitle: jobTitle || undefined,
    url: `${base}/about`,
    image: image
      ? urlFor(image).width(800).height(800).fit("crop").format("jpg").url()
      : undefined,
    worksFor: {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: site.brandName,
    },
    sameAs: sameAs?.length ? sameAs : undefined,
  };
}

interface ServiceInput {
  title: string;
  summary?: string;
  slug?: string;
}

/** One Service per expertise card on the Work With Me page, all provided by the Organization. */
export async function getServiceSchemas(
  origin: string | URL,
  pagePath: string,
  services: ServiceInput[]
) {
  const site = await getSiteSettings();
  const base = new URL(origin).origin;
  return services.map((s, i) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${base}/#service-${s.slug ?? i}`,
    name: s.title,
    serviceType: s.title,
    description: s.summary || undefined,
    url: `${base}/${pagePath.replace(/^\//, "")}`,
    provider: {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: site.brandName,
    },
  }));
}

interface ProductInput {
  title: string;
  slug: string;
  description?: string;
  image?: Parameters<typeof urlFor>[0];
  price?: number;
  currency?: string;
  purchaseUrl?: string;
}

/** Product for a guide page. Returns null unless there is a price and a buy link,
 *  because a Product without an offer is flagged by Google. */
export async function getProductSchema(origin: string | URL, g: ProductInput) {
  if (g.price == null || !g.purchaseUrl) return null;
  const site = await getSiteSettings();
  const base = new URL(origin).origin;
  const org = {
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: site.brandName,
  };
  const url = `${base}/guides/${g.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: g.title,
    description: g.description || undefined,
    image: g.image ? urlFor(g.image).width(800).format("jpg").url() : undefined,
    url,
    brand: org,
    offers: {
      "@type": "Offer",
      url: g.purchaseUrl,
      price: g.price.toFixed(2),
      priceCurrency: (g.currency || "usd").toUpperCase(),
      availability: "https://schema.org/InStock",
      seller: org,
    },
  };
}

/** BreadcrumbList. Pass the trail after Home, in order; the last item is the current page. */
export function getBreadcrumbSchema(
  origin: string | URL,
  trail: { name: string; path: string }[]
) {
  const base = new URL(origin).origin;
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}
