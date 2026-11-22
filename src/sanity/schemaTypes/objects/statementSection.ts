import { defineArrayMember, defineField, defineType } from "sanity";

/** A heading, a few paragraphs and up to three buttons. Used by the home page
 *  statements and reusable on any other page that has the same layout. */
export const statementSection = defineType({
  name: "statementSection",
  title: "Statement Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
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
      name: "ctas",
      title: "Buttons",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  preview: { select: { title: "heading" } },
});
