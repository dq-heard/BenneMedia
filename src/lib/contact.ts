import { client } from "./sanity";
import { LINK_FIELDS, type LinkData } from "./links";
import { getLinkResolver } from "./site";
import type { Img } from "./home";

interface Raw {
  intro?: { heading: string; paragraphs?: string[]; cta?: LinkData };
  topicsLead?: string;
  topics?: { label: string; value: string; description?: string }[];
  topicLegend?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  seo?: { title?: string; description?: string; image?: Img };
}

export async function getContact() {
  const [page, link] = await Promise.all([
    client.fetch<Raw>(`*[_type == "contactPage"][0]{
      intro{heading, paragraphs, cta${LINK_FIELDS}}, topicsLead, topics[]{label, value, description},
      topicLegend, submitLabel, successMessage, errorMessage, seo
    }`),
    getLinkResolver(),
  ]);
  if (!page) return null;
  return {
    ...page,
    intro: page.intro && {
      ...page.intro,
      paragraphs: page.intro.paragraphs ?? [],
      cta: link(page.intro.cta),
    },
    topics: page.topics ?? [],
    topicLegend: page.topicLegend || "What can I help with?",
    submitLabel: page.submitLabel || "Send Message",
    successMessage: page.successMessage || "Thanks! Your message was sent.",
    errorMessage:
      page.errorMessage || "Something went wrong. Please try again.",
  };
}
