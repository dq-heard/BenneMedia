import { defineArrayMember, defineField, defineType } from "sanity";

/** A heading, one short paragraph and a bullet list. */
export const listSection = defineType({
  name: "listSection",
  title: "List Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { select: { title: "heading" } },
});
