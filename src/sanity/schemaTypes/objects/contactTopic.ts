import { defineField, defineType } from "sanity";

/** One reason for getting in touch. Drives both the radio choices in the form
 *  and the list beside it, so each topic is entered once. */
export const contactTopic = defineType({
  name: "contactTopic",
  title: "Contact Topic",
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
      description:
        "Sent with the form (e.g. work-with-me). Lowercase letters and hyphens. Changing it later affects how submissions are sorted.",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value && /^[a-z0-9-]+$/.test(value)
            ? true
            : "Lowercase letters, numbers and hyphens only"
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Shown in the list beside the form. Leave blank to keep this topic out of the list (e.g. Other).",
    }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});
