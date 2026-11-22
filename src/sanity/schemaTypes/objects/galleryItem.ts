import { defineField, defineType } from "sanity";

/** One tile in the case study masonry grid. Cells must add up to 12:
 *  wide = 2, tall = 2, big = 4, normal = 1. */
export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Tile",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Normal (1 cell)", value: "normal" },
          { title: "Wide (2 cells)", value: "wide" },
          { title: "Tall (2 cells)", value: "tall" },
          { title: "Big (4 cells)", value: "big" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
  ],
  preview: { select: { title: "image.alt", subtitle: "size", media: "image" } },
});
