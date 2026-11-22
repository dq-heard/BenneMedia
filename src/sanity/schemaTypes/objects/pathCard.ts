import { defineField, defineType } from "sanity";

/** A card with a title, one paragraph and a button ("I want to do it myself."). */
export const pathCard = defineType({
  name: "pathCard",
  title: "Path Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", title: "Paragraph", type: "text", rows: 3 }),
    defineField({ name: "cta", title: "Button", type: "link" }),
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});
