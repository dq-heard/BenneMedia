import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton: the About page. */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "bio", title: "Bio" },
    { name: "experience", title: "Industry Experience" },
    { name: "media", title: "Featured / Media" },
    { name: "projects", title: "Selected Projects" },
    { name: "testimonials", title: "Testimonials" },
    { name: "closing", title: "Closing Buttons" },
    { name: "structured", title: "Structured Data" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      type: "pageIntro",
      group: "intro",
    }),

    defineField({
      name: "bio",
      title: "Professional Bio",
      type: "splitSection",
      group: "bio",
    }),

    defineField({
      name: "experienceHeading",
      title: "Heading",
      type: "string",
      group: "experience",
    }),
    defineField({
      name: "experience",
      title: "Tiles",
      type: "array",
      group: "experience",
      of: [defineArrayMember({ type: "string" })],
      description: "One tile per line. Six fill the grid evenly.",
    }),

    defineField({
      name: "mediaHeading",
      title: "Heading",
      type: "string",
      group: "media",
      description:
        "Tiles come from Media features marked Featured. Blank hides the section.",
    }),

    defineField({
      name: "projectsHeading",
      title: "Heading",
      type: "string",
      group: "projects",
      description: "Cards come from case studies. Blank hides the section.",
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      group: "projects",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] }),
      ],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: "testimonialsHeading",
      title: "Heading",
      type: "string",
      group: "testimonials",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      group: "testimonials",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] }),
      ],
    }),

    defineField({
      name: "closingCtas",
      title: "Buttons",
      type: "array",
      group: "closing",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      group: "structured",
      description: "e.g. Founder and Game Marketing Strategist",
    }),
    defineField({
      name: "profileLinks",
      title: "Personal Profile Links",
      type: "array",
      group: "structured",
      of: [
        defineArrayMember({
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https"] }),
        }),
      ],
      description:
        "Only Junae's own profiles (LinkedIn, speaker pages, bylines, etc.). Not the company's socials.",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
