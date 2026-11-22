import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton: the Work With Me page. */
export const workWithMePage = defineType({
  name: "workWithMePage",
  title: "Work With Me Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "packages", title: "Package Hub" },
    { name: "paths", title: "Where Are You Now" },
    { name: "who", title: "Who This Is For" },
    { name: "caseStudies", title: "Case Studies" },
    { name: "closing", title: "Closing" },
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
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "intro",
      description:
        "The page address, e.g. game-marketing-services. Changing it breaks old links unless you add a redirect.",
      initialValue: { current: "work-with-me" },
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug?.current ?? "")
            ? true
            : "Lowercase letters, numbers and hyphens only, no slashes"
        ),
    }),

    defineField({
      name: "packageHeading",
      title: "Heading",
      type: "string",
      group: "packages",
    }),
    defineField({
      name: "packageIntro",
      title: "Intro",
      type: "text",
      rows: 2,
      group: "packages",
    }),

    defineField({
      name: "pathsHeading",
      title: "Heading",
      type: "string",
      group: "paths",
    }),
    defineField({
      name: "paths",
      title: "Path Cards",
      type: "array",
      group: "paths",
      of: [defineArrayMember({ type: "pathCard" })],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: "who",
      title: "Who This Is For",
      type: "listSection",
      group: "who",
    }),

    defineField({
      name: "caseStudiesHeading",
      title: "Heading",
      type: "string",
      group: "caseStudies",
      description: "Cards come from case studies. Blank hides the section.",
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

    defineField({
      name: "closingHeading",
      title: "Heading",
      type: "string",
      group: "closing",
    }),
    defineField({
      name: "closingCta",
      title: "Button",
      type: "link",
      group: "closing",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Work With Me Page" }) },
});
