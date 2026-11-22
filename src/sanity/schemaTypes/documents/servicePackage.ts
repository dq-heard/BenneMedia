import { defineArrayMember, defineField, defineType } from "sanity";

export const servicePackage = defineType({
  name: "servicePackage",
  title: "Package",
  type: "document",
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "page", title: "Page" },
    { name: "tiers", title: "Roadmap Guide" },
    { name: "related", title: "Related Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ---- Card (home page) ----
    defineField({
      name: "title",
      title: "Package Name",
      type: "string",
      group: "card",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "card",
      options: { source: "title", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Short Promise",
      type: "text",
      rows: 3,
      group: "card",
      description: "The card paragraph on the home page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Card Button Text",
      type: "string",
      group: "card",
      description:
        'e.g. "Prepare My Campaign". The button links to this package\'s page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Card Second Paragraph",
      type: "text",
      rows: 3,
      group: "card",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "card",
      description: "Lowest first.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "card",
      initialValue: false,
    }),

    // ---- Page ----
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
      group: "page",
      description:
        "The outcome statement under the name: what the client is trying to achieve.",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      description: "One paragraph per item, shown under the outcome line.",
    }),
    defineField({
      name: "whoItsFor",
      title: "Who It's For",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "string" })],
      description: "One bullet per item.",
    }),
    defineField({
      name: "problem",
      title: "Problem",
      type: "text",
      rows: 4,
      group: "page",
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 4,
      group: "page",
      description: "What success looks like.",
    }),
    defineField({
      name: "included",
      title: "What May Be Included",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "string" })],
      description: "One item per line. Shown as a two-column checklist.",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "faqItem" })],
    }),

    // ---- Tiers ----
    defineField({
      name: "roadmapGuide",
      title: "Roadmap Guide",
      type: "reference",
      to: [{ type: "guide" }],
      group: "tiers",
      description:
        "The DIY guide or workbook that is this package's Roadmap. Its button goes to the guide.",
    }),

    // ---- Related ----
    defineField({
      name: "expertise",
      title: "Related Capabilities",
      type: "array",
      group: "related",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "expertise" }] }),
      ],
      description: "Capability pages that may go into this package.",
    }),
    defineField({
      name: "relatedCaseStudies",
      title: "Related Case Studies",
      type: "array",
      group: "related",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "relatedGuides",
      title: "Related Guides",
      type: "array",
      group: "related",
      of: [defineArrayMember({ type: "reference", to: [{ type: "guide" }] })],
    }),
    defineField({
      name: "relatedArticles",
      title: "Related Articles",
      type: "array",
      group: "related",
      of: [defineArrayMember({ type: "reference", to: [{ type: "article" }] })],
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
