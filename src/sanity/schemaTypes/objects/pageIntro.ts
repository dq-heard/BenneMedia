import { defineArrayMember, defineField, defineType } from "sanity";

/** The h1 and opening paragraphs at the top of an inner page. */
export const pageIntro = defineType({
  name: "pageIntro",
  title: "Page Intro",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading (h1)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "link",
      description: "Optional.",
    }),
  ],
  preview: { select: { title: "heading" } },
});
