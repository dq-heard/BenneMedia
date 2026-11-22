import { defineField, defineType } from "sanity";

export const mediaAppearance = defineType({
  name: "mediaAppearance",
  title: "Media Feature",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publication",
      title: "Publication / Event",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Podcast", value: "podcast" },
          { title: "Interview", value: "interview" },
          { title: "Article / Feature", value: "article" },
          { title: "Speaking Engagement", value: "speaking" },
          { title: "Conference", value: "conference" },
          { title: "Industry Collaboration", value: "collaboration" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Optional.",
    }),
    defineField({
      name: "logo",
      title: "Image / Logo",
      type: "image",
      description:
        "Use a light or white version for dark backgrounds. Decorative, so no alt text.",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Not shown on the tiles yet.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publication", media: "logo" },
  },
});
