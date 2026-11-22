import { defineArrayMember, defineField, defineType } from "sanity";

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "sales", title: "Pricing & Stripe" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Guide name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "imageWithAlt",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Shown on the guide card.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      description: "One paragraph per item.",
    }),
    defineField({
      name: "whoItsFor",
      title: "Who It's For",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "problemItSolves",
      title: "Problem It Solves",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "whatsIncluded",
      title: "What's Included",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      description: "One item per line.",
    }),
    defineField({
      name: "faqHeading",
      title: "FAQ Heading",
      type: "string",
      group: "content",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
    defineField({
      name: "faqCta",
      title: "FAQ Button",
      type: "link",
      group: "content",
      description: "Shown after the questions. Blank uses the site default.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "content",
      description: "Lowest first.",
    }),

    // ---- Pricing & Stripe ----
    defineField({
      name: "price",
      title: "Display Price",
      type: "number",
      group: "sales",
      description:
        "What the page shows. Stripe is the source of truth for what is charged.",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "sales",
      initialValue: "usd",
      options: { list: [{ title: "USD", value: "usd" }] },
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      group: "sales",
      description:
        "Starts with price_. Used by the checkout endpoint once Stripe is connected.",
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || value.startsWith("price_")
            ? true
            : "Stripe price IDs start with price_"
        ),
    }),
    defineField({
      name: "stripeProductId",
      title: "Stripe Product ID",
      type: "string",
      group: "sales",
      description: "Starts with prod_.",
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || value.startsWith("prod_")
            ? true
            : "Stripe product IDs start with prod_"
        ),
    }),
    defineField({
      name: "purchaseUrl",
      title: "Purchase URL (fallback)",
      type: "url",
      group: "sales",
      description:
        "A hosted checkout or Payment Link. Used until the Stripe integration exists.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "cover" },
  },
});
