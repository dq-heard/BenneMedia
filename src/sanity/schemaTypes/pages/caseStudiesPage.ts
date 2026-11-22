import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton: the Case Studies index page. The carousel slides come from the
 *  Case Study documents. */
export const caseStudiesPage = defineType({
  name: "caseStudiesPage",
  title: "Case Studies Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "projects", title: "Projects" },
    { name: "footprint", title: "Industry Footprint" },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      type: "pageIntro",
      group: "intro",
      description:
        "The button is optional. Leave it empty until there is somewhere useful to send people.",
    }),

    defineField({
      name: "carouselLabel",
      title: "Carousel Label",
      type: "string",
      group: "projects",
      description:
        'Read aloud by screen readers (not shown). Blank uses "Case studies".',
    }),

    defineField({
      name: "footprintHeading",
      title: "Heading",
      type: "string",
      group: "footprint",
    }),
    defineField({
      name: "footprintBody",
      title: "Paragraph",
      type: "text",
      rows: 4,
      group: "footprint",
    }),
    defineField({
      name: "footprintCta",
      title: "Button",
      type: "link",
      group: "footprint",
    }),
    defineField({
      name: "footprintStats",
      title: "Stats",
      type: "array",
      group: "footprint",
      of: [defineArrayMember({ type: "statItem" })],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "marquee",
      title: "Logo Marquee",
      type: "logoMarquee",
      group: "footprint",
      description: "Leave empty to reuse the marquee from Site Settings.",
    }),

    defineField({
      name: "closingHeading",
      title: "Closing Heading",
      type: "string",
      group: "closing",
    }),
    defineField({
      name: "closingBody",
      title: "Closing Paragraph",
      type: "text",
      rows: 3,
      group: "closing",
    }),
    defineField({
      name: "closingCta",
      title: "Closing Button",
      type: "link",
      group: "closing",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Case Studies Page" }) },
});
