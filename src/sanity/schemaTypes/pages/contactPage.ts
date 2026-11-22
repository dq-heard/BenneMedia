import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton: the Contact page. Form submissions are not stored in Sanity;
 *  this holds the copy around the form. */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "topics", title: "Topics" },
    { name: "form", title: "Form" },
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
      name: "topicsLead",
      title: "Line Above the List",
      type: "string",
      group: "topics",
    }),
    defineField({
      name: "topics",
      title: "Contact Topics",
      type: "array",
      group: "topics",
      of: [defineArrayMember({ type: "contactTopic" })],
      description:
        "These become the choices in the form, and the ones with a description also appear in the list beside it.",
      validation: (Rule) => Rule.required().min(2),
    }),

    defineField({
      name: "topicLegend",
      title: "Question Above the Choices",
      type: "string",
      group: "form",
      initialValue: "What can I help with?",
    }),
    defineField({
      name: "submitLabel",
      title: "Submit Button Text",
      type: "string",
      group: "form",
      initialValue: "Send Message",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "text",
      rows: 2,
      group: "form",
      description: "Shown after a message is sent.",
    }),
    defineField({
      name: "errorMessage",
      title: "Error Message",
      type: "text",
      rows: 2,
      group: "form",
      description: "Shown if sending fails.",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact Page" }) },
});
