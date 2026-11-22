import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO Title",
      type: "string",
      description: "Falls back to the page title. Around 60 characters.",
      validation: (Rule) =>
        Rule.max(60).warning(
          "Over 60 characters may be cut off in search results"
        ),
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Around 155 characters.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Over 160 characters may be cut off in search results"
        ),
    }),
    defineField({
      name: "image",
      title: "Share Image",
      type: "image",
      description: "Optional. Falls back to the page image.",
    }),
  ],
});
