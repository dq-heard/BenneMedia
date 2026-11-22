import { defineField, defineType } from "sanity";

/** An expertise page: an intro plus every package that references it. */
export const expertise = defineType({
  name: "expertise",
  title: "Expertise",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Card Summary",
      type: "text",
      rows: 3,
      description: "The paragraph on the Work With Me card.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
    defineField({ name: "body", title: "Page Content", type: "blockContent" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
