import { defineArrayMember, defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "related", title: "Related & CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
      initialValue: "Junae Benne",
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedDate",
      title: "Updated Date",
      type: "datetime",
      group: "content",
      description: "Optional.",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faqItem" })],
    }),

    defineField({
      name: "relatedGuide",
      title: "Related Guide",
      type: "reference",
      group: "related",
      to: [{ type: "guide" }],
    }),
    defineField({
      name: "relatedCaseStudy",
      title: "Related Case Study",
      type: "reference",
      group: "related",
      to: [{ type: "caseStudy" }],
    }),
    defineField({
      name: "relatedPackage",
      title: "Related Package",
      type: "reference",
      group: "related",
      to: [{ type: "servicePackage" }],
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "link",
      group: "related",
      description: "Blank uses the site default.",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "publishDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "featuredImage" },
  },
});
