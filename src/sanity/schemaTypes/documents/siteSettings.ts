import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton: site-wide content (nav, footer, home marquee, defaults). */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "brand", title: "Brand & Nav", default: true },
    { name: "marquee", title: "Logo Marquee" },
    { name: "seo", title: "SEO & Structured Data" },
    { name: "defaults", title: "Defaults" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      group: "brand",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Short Name",
      type: "string",
      group: "brand",
      description: "Shown next to the logo in the nav (e.g. BMS).",
    }),
    defineField({
      name: "logo",
      title: "Nav Logo",
      type: "image",
      group: "brand",
      description:
        "The small cube mark. Decorative, since the name is beside it.",
    }),
    defineField({
      name: "footerLogo",
      title: "Footer Logo",
      type: "image",
      group: "brand",
      description: "The full logo. Its alt text is the brand name.",
    }),
    defineField({
      name: "nav",
      title: "Navigation",
      type: "array",
      group: "brand",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          fields: [
            defineField({
              name: "link",
              title: "Link",
              type: "link",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "link.label", subtitle: "link.kind" } },
        }),
      ],
    }),
    defineField({
      name: "navCta",
      title: "Nav Button",
      type: "link",
      group: "brand",
      description: 'The "Take the Quiz" button.',
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "array",
      group: "brand",
      description:
        "Optional. The footer shows social links only when this has items.",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X / Twitter", value: "x" },
                  { title: "Bluesky", value: "bluesky" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "Twitch", value: "twitch" },
                  { title: "Discord", value: "discord" },
                  { title: "Steam", value: "steam" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer Link Columns",
      type: "array",
      group: "brand",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [defineArrayMember({ type: "link" })],
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Tagline",
      type: "text",
      rows: 3,
      group: "brand",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking Link",
      type: "url",
      group: "brand",
      description: 'The "Book a Call" link.',
    }),

    defineField({
      name: "marquee",
      title: "Logo Marquee",
      type: "logoMarquee",
      group: "marquee",
    }),

    defineField({
      name: "orgDescription",
      title: "Organization Description",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "One or two plain sentences about what Benne Media Solutions does. Used in search results data.",
    }),
    defineField({
      name: "founderName",
      title: "Founder Name",
      type: "string",
      group: "seo",
    }),

    defineField({
      name: "packageTiers",
      title: "Package Tiers",
      type: "object",
      group: "defaults",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Choose How Much Help You Want",
        }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
        defineField({
          name: "items",
          title: "Tiers",
          type: "array",
          validation: (Rule) => Rule.max(3),
          of: [
            defineArrayMember({
              type: "object",
              name: "tier",
              fields: [
                defineField({
                  name: "key",
                  title: "Tier",
                  type: "string",
                  options: {
                    list: [
                      { title: "Roadmap", value: "roadmap" },
                      { title: "Build", value: "build" },
                      { title: "Execute", value: "execute" },
                    ],
                    layout: "radio",
                  },
                }),
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({
                  name: "tagline",
                  title: "Tagline",
                  type: "string",
                }),
                defineField({
                  name: "body",
                  title: "Description",
                  type: "text",
                  rows: 4,
                }),
                defineField({
                  name: "buttonLabel",
                  title: "Button Text",
                  type: "string",
                }),
              ],
              preview: { select: { title: "name", subtitle: "tagline" } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "packageCta",
      title: "Package Page CTA",
      type: "object",
      group: "defaults",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "body",
          title: "Paragraph",
          type: "text",
          rows: 3,
        }),
        defineField({ name: "cta", title: "Button", type: "link" }),
      ],
    }),
    defineField({
      name: "closingHeading",
      title: "Default Closing Heading",
      type: "string",
      group: "defaults",
    }),
    defineField({
      name: "closingBody",
      title: "Default Closing Paragraph",
      type: "text",
      rows: 3,
      group: "defaults",
    }),
    defineField({
      name: "defaultCta",
      title: "Default CTA",
      type: "link",
      group: "defaults",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seo",
      group: "defaults",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
