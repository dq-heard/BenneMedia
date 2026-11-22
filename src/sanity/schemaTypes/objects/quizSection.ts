import { defineArrayMember, defineField, defineType } from "sanity";

/** Copy plus the embedded Typeform quiz. */
export const quizSection = defineType({
  name: "quizSection",
  title: "Quiz Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Line Above the List",
      type: "string",
      description: 'e.g. "Are you a:"',
    }),
    defineField({
      name: "options",
      title: "List Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "body", title: "Paragraph", type: "text", rows: 4 }),
    defineField({
      name: "typeformId",
      title: "Typeform ID",
      type: "string",
      description:
        "Just the ID from the form link (the part after typeform.com/to/). The page builds the embed address.",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value && /^[A-Za-z0-9]+$/.test(value)
            ? true
            : "Letters and numbers only, not the full URL"
        ),
    }),
    defineField({
      name: "embedTitle",
      title: "Embed Title",
      type: "string",
      description: "Read aloud by screen readers.",
      initialValue: "Launch Strategy Quiz",
    }),
  ],
  preview: { select: { title: "heading" } },
});
