import { defineField, defineType } from "sanity";

/** One stat card on a case study: a label on top and a value at the bottom. */
export const statItem = defineType({
  name: "statItem",
  title: "Stat",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: 'Keep it short, e.g. "42,000 wishlists".',
      validation: (Rule) =>
        Rule.required().max(28).warning("Long values get cramped on the card"),
    }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});
