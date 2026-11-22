import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton: the home page. Sections appear in the order of the groups below.
 *  The logo marquee comes from Site settings. */
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro" },
    { name: "quiz", title: "Quiz" },
    { name: "about", title: "About" },
    { name: "goals", title: "Goals" },
    { name: "expertise", title: "Expertise" },
    { name: "caseStudies", title: "Case Studies" },
    { name: "testimonials", title: "Testimonials" },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "imageWithAlt",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCaption",
      title: "Image Caption",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroHeading",
      title: "Heading (h1)",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSub",
      title: "Subheading",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroCtas",
      title: "Buttons",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.max(3),
    }),

    // ---- Sections ----
    defineField({
      name: "intro",
      title: "Intro Statement",
      type: "statementSection",
      group: "intro",
    }),
    defineField({
      name: "quiz",
      title: "Quiz",
      type: "quizSection",
      group: "quiz",
    }),
    defineField({
      name: "about",
      title: "About (split)",
      type: "splitSection",
      group: "about",
    }),
    defineField({
      name: "goals",
      title: "Goals Statement",
      type: "statementSection",
      group: "goals",
    }),

    // ---- Expertise ----
    defineField({
      name: "expertiseHeading",
      title: "Expertise Heading",
      type: "string",
      group: "expertise",
    }),
    // defineField({
    //   name: "expertiseIntro",
    //   title: "Expertise Intro",
    //   type: "text",
    //   rows: 2,
    //   group: "expertise",
    // }),
    defineField({
      name: "expertise",
      title: "Expertise",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "expertise" }] }),
      ],
      group: "expertise",
    }),

    // ---- Case studies (optional) ----
    defineField({
      name: "caseStudiesHeading",
      title: "Heading",
      type: "string",
      group: "caseStudies",
      description: "Leave blank to hide the section.",
    }),
    defineField({
      name: "caseStudiesIntro",
      title: "Intro Paragraph",
      type: "text",
      rows: 3,
      group: "caseStudies",
    }),
    defineField({
      name: "caseStudies",
      title: "Case Studies",
      type: "array",
      group: "caseStudies",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] }),
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ---- Testimonials (optional) ----
    defineField({
      name: "testimonialsHeading",
      title: "Heading",
      type: "string",
      group: "testimonials",
      description: "Leave blank to hide the section.",
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

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
