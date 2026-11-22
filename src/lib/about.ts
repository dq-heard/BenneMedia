import { LINK_FIELDS, type LinkData } from "./links";
import { client } from "./sanity";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

const IMG = `{asset, alt, decorative, hotspot, crop}`;

interface Raw {
  intro?: { heading: string; paragraphs?: string[]; cta?: LinkData };
  bio?: { image: Img; heading: string; paragraphs?: string[]; cta?: LinkData };
  experienceHeading?: string;
  experience?: string[];
  mediaHeading?: string;
  projectsHeading?: string;
  projects?: {
    _id: string;
    title: string;
    slug: string;
    landscapeCover?: Img;
    cardProblem?: string;
    cardStrategy?: string;
    cardResult?: string;
  }[];
  testimonialsHeading?: string;
  testimonials?: {
    _id: string;
    quote: string;
    name: string;
    role?: string;
    avatar?: Img;
  }[];
  closingCtas?: LinkData[];
  jobTitle?: string;
  profileLinks?: string[];
  seo?: { title?: string; description?: string; image?: Img };
}

export interface MediaItem {
  _id: string;
  title: string;
  publication: string;
  type?: string;
  date?: string;
  logo?: Img;
  externalUrl?: string;
}

export async function getAbout() {
  const [page, media, link] = await Promise.all([
    client.fetch<Raw>(`*[_type == "aboutPage"][0]{
      intro{heading, paragraphs, cta${LINK_FIELDS}},
      bio{image${IMG}, heading, paragraphs, cta${LINK_FIELDS}},
      experienceHeading, experience,
      mediaHeading,
      projectsHeading,
      "projects": projects[]->{_id, title, "slug": slug.current, landscapeCover${IMG}, cardProblem, cardStrategy, cardResult},
      testimonialsHeading,
      "testimonials": testimonials[]->{_id, quote, name, role, avatar},
      closingCtas[]${LINK_FIELDS},
      jobTitle, profileLinks,
      seo
    }`),
    client.fetch<MediaItem[]>(
      `*[_type == "mediaAppearance" && featured == true] | order(date desc){_id, title, publication, type, date, logo, externalUrl}`
    ),
    getLinkResolver(),
  ]);
  if (!page) return null;
  return {
    ...page,
    intro: page.intro && {
      ...page.intro,
      paragraphs: page.intro.paragraphs ?? [],
    },
    bio: page.bio && {
      ...page.bio,
      paragraphs: page.bio.paragraphs ?? [],
      cta: link(page.bio.cta),
    },
    experience: page.experience ?? [],
    media: media.filter(Boolean),
    projects: (page.projects ?? []).filter(Boolean),
    testimonials: (page.testimonials ?? []).filter(Boolean),
    closingCtas: (page.closingCtas ?? [])
      .map((l) => link(l))
      .filter((l): l is NonNullable<typeof l> => !!l),
  };
}

export const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  });
