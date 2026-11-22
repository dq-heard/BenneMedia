import { defineArrayMember, defineField, defineType } from "sanity";

/** The scrolling logo strip. Reused by siteSettings (home) and the Case Studies page. */
export const logoMarquee = defineType({
  name: "logoMarquee",
  title: "Logo Marquee",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label Above the Strip",
      type: "string",
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "logo",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Logo",
              type: "image",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "url", title: "Link (optional)", type: "url" }),
          ],
          preview: { select: { title: "name", media: "image" } },
        }),
      ],
    }),
  ],
});
