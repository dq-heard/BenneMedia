import { defineArrayMember, defineField, defineType } from "sanity";

/** Image on one side; heading, paragraphs and a button on the other. */
export const splitSection = defineType({
  name: "splitSection",
  title: "Split Section",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
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
    defineField({ name: "cta", title: "Button", type: "link" }),
  ],
  preview: { select: { title: "heading", media: "image" } },
});
