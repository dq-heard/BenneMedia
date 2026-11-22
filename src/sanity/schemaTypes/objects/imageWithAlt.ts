import { defineField, defineType } from "sanity";

/** Image with alt text. Alt is required unless the image is marked decorative. */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description:
        'Describe what the image shows. Leave empty only if "Decorative" is ticked.',
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context.parent as { decorative?: boolean } | undefined;
          if (parent?.decorative || alt) return true;
          return 'Add alt text, or tick "Decorative image"';
        }),
    }),
    defineField({
      name: "decorative",
      title: "Decorative Image",
      type: "boolean",
      description:
        'Tick if the image adds nothing a screen reader user needs (the page renders alt="").',
      initialValue: false,
    }),
  ],
});
