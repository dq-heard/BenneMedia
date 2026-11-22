import { defineArrayMember, defineField, defineType } from "sanity";

/** One tier (Roadmap, Build or Execute) of a package. The shared tier copy lives in Site Settings. */
export const packageTier = defineType({
  name: "packageTier",
  title: "Package Tier",
  type: "object",
  fields: [
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description:
        "What this tier means for this package. Leave blank to hide the tier.",
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "One deliverable per line.",
    }),
  ],
  preview: { select: { title: "description" } },
});
