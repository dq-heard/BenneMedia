import { defineField, defineType } from "sanity";

/** Reusable quotes. Pages choose which testimonials to show. */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role, Studio, or Game",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Photo",
      type: "image",
      description: "Optional. Decorative, so no alt text.",
    }),
    defineField({
      name: "caseStudy",
      title: "Related Case Study",
      type: "reference",
      to: [{ type: "caseStudy" }],
      description: "Optional. Lets the case study page show its own quotes.",
    }),
  ],
  preview: { select: { title: "name", subtitle: "quote", media: "avatar" } },
});
