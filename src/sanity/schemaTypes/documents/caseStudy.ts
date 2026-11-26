import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Story" },
    { name: "results", title: "Results" },
    { name: "cards", title: "Cards & Previews" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: "title",
      title: "Project Name",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "hero",
      options: { source: "title", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "developer",
      title: "Developer / Company",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      group: "hero",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "hero",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Shipped", value: "shipped" },
          { title: "In Development", value: "in-development" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
    defineField({
      name: "genres",
      title: "Genres",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "platforms",
      title: "Platforms",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "expertise" }] }),
      ],
      description: "Shown as tags in the hero and on the case study cards.",
    }),
    defineField({
      name: "cover",
      title: "Hero Image (square cover)",
      type: "imageWithAlt",
      group: "hero",
      description: "Square, 500 x 500.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
      group: "hero",
      description: "The short paragraph under the game name.",
      validation: (Rule) =>
        Rule.required().max(220).warning("Keep the hero paragraph short"),
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "string",
      group: "hero",
      initialValue: "View on Steam",
    }),
    defineField({
      name: "steamUrl",
      title: "Steam / Game URL",
      type: "url",
      group: "hero",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),

    // ---- Story ----
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "story",
      description: 'The large line beside "The Challenge".',
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 5,
      group: "story",
    }),
    defineField({
      name: "stats",
      title: "Stat Cards",
      type: "array",
      group: "story",
      of: [defineArrayMember({ type: "statItem" })],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "goal",
      title: "Goal",
      type: "text",
      rows: 5,
      group: "story",
    }),
    defineField({
      name: "strategy",
      title: "Strategy",
      type: "text",
      rows: 5,
      group: "story",
    }),
    defineField({
      name: "landscapeCover",
      title: "Landscape Cover",
      type: "imageWithAlt",
      group: "story",
      description: "Used beside the game description (the 50/50 section).",
    }),
    defineField({
      name: "description",
      title: "Game Description",
      type: "text",
      rows: 5,
      group: "story",
      description: "The longer paragraph beside the landscape cover.",
    }),
    defineField({
      name: "wishlistCtaText",
      title: "Second Button Text",
      type: "string",
      group: "story",
      initialValue: "Wishlist on Steam",
      description:
        "The button beside the landscape cover. Uses the same Steam link.",
    }),
    // TODO: timeline (added once the approved timeline design is described)

    // ---- Results ----
    defineField({
      name: "whatMoved",
      title: "What Moved",
      type: "array",
      group: "results",
      of: [defineArrayMember({ type: "string" })],
      description: "One result per line.",
    }),
    defineField({
      name: "fieldNotes",
      title: "Field Notes",
      type: "array",
      group: "results",
      of: [defineArrayMember({ type: "string" })],
      description: "One lesson per line.",
    }),
    defineField({
      name: "closingHeading",
      title: "Closing Heading",
      type: "string",
      group: "results",
      description: "Blank uses the site default.",
    }),
    defineField({
      name: "closingBody",
      title: "Closing Paragraph",
      type: "text",
      rows: 3,
      group: "results",
    }),
    defineField({
      name: "closingCta",
      title: "Closing Button",
      type: "link",
      group: "results",
    }),

    // ---- Cards & previews ----
    defineField({
      name: "cardProblem",
      title: "Card: Problem",
      type: "text",
      rows: 2,
      group: "cards",
      description: "One or two sentences.",
    }),
    defineField({
      name: "cardStrategy",
      title: "Card: Strategy",
      type: "text",
      rows: 2,
      group: "cards",
    }),
    defineField({
      name: "cardResult",
      title: "Card: Result",
      type: "text",
      rows: 2,
      group: "cards",
      description: "Optional. Leave blank if there is no result yet.",
    }),

    // ---- Media ----
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "galleryItem" })],
      description:
        "Tile sizes must add up to 12 cells (wide 2, tall 2, big 4, normal 1).",
      validation: (Rule) =>
        Rule.custom((items) => {
          if (!items || items.length === 0) return true;
          const cells: Record<string, number> = {
            normal: 1,
            wide: 2,
            tall: 2,
            big: 4,
          };
          const total = (items as { size?: string }[]).reduce(
            (sum, i) => sum + (cells[i.size ?? "normal"] ?? 1),
            0
          );
          return total === 12
            ? true
            : `Tiles add up to ${total} cells; the grid needs exactly 12`;
        }).warning(),
    }),

    // ---- SEO ----
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "developer", media: "cover" },
  },
});
