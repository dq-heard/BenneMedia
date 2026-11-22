import { defineField, defineType } from "sanity";

/** Singleton: the Guides index page. The guide cards come from the Guide documents. */
export const guidesPage = defineType({
  name: "guidesPage",
  title: "Guides Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "guides", title: "Guides" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      type: "pageIntro",
      group: "intro",
    }),
    defineField({
      name: "guidesHeading",
      title: "Heading",
      type: "string",
      group: "guides",
      description:
        "Cards show every Guide document, in the order set on each guide.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Guides Page" }) },
});
