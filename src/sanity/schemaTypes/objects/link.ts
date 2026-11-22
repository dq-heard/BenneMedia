import { defineField, defineType } from "sanity";

/** Add a site-wide destination here once (and its URL field in Site Settings,
 *  named `<value>Url`) and every link field offers it. */
export const SITE_LINKS = [
  { title: "Take the Quiz", value: "quiz" },
  { title: "Book a Call", value: "booking" },
  { title: "Grab a Guide", value: "guides" },
  { title: "Free Consult", value: "consult" },
];

/** Every document type a link can point to. The page address is worked out
 *  from the document, so changing a slug never breaks a link. */
const LINKABLE_TYPES = [
  "homePage",
  "workWithMePage",
  "guidesPage",
  "caseStudiesPage",
  "aboutPage",
  "contactPage",
  "caseStudy",
  "guide",
  "servicePackage",
  "expertise",
  "article",
];

type Parent = { kind?: string } | undefined;

/** One link type for every button, nav item and CTA. */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Link To",
      type: "string",
      options: {
        list: [
          { title: "A page on this site", value: "page" },
          { title: "A site-wide link (quiz, booking)", value: "site" },
          { title: "An outside website", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "page",
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "reference",
      to: LINKABLE_TYPES.map((type) => ({ type })),
      hidden: ({ parent }) => (parent as Parent)?.kind !== "page",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as Parent)?.kind === "page" && !value
            ? "Pick a page"
            : true
        ),
    }),
    defineField({
      name: "anchor",
      title: "Section",
      type: "string",
      description:
        "Optional. Jump to a section of the page, e.g. faq (no # needed).",
      hidden: ({ parent }) => (parent as Parent)?.kind !== "page",
      validation: (Rule) =>
        Rule.custom((value) =>
          !value || /^[a-z0-9_-]+$/i.test(value)
            ? true
            : "Letters, numbers, hyphens only"
        ),
    }),
    defineField({
      name: "site",
      title: "Site-Wide Link",
      type: "string",
      description: "The address is set once in Site Settings.",
      options: { list: SITE_LINKS },
      hidden: ({ parent }) => (parent as Parent)?.kind !== "site",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as Parent)?.kind === "site" && !value
            ? "Pick a link"
            : true
        ),
    }),
    defineField({
      name: "external",
      title: "Web Address",
      type: "url",
      description: "Outside links open in a new tab.",
      hidden: ({ parent }) => (parent as Parent)?.kind !== "external",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }).custom(
          (value, context) =>
            (context.parent as Parent)?.kind === "external" && !value
              ? "Add a web address"
              : true
        ),
    }),
    defineField({
      name: "label",
      title: "Button Text",
      type: "string",
      description:
        "Blank uses the default for site-wide links (Take the Quiz, Book a Call).",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          (context.parent as Parent)?.kind !== "site" && !value
            ? "Add the button text"
            : true
        ),
    }),
  ],
  preview: {
    select: {
      label: "label",
      kind: "kind",
      site: "site",
      external: "external",
    },
    prepare: ({ label, kind, site, external }) => ({
      title: label || SITE_LINKS.find((s) => s.value === site)?.title || "Link",
      subtitle:
        kind === "external"
          ? external
          : kind === "site"
            ? "Site-wide link"
            : "Page on this site",
    }),
  },
});
