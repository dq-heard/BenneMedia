import type {
  StructureBuilder,
  StructureResolver,
  StructureResolverContext,
} from "sanity/structure";
import {
  pageTypes,
  singletonTypes,
} from "../src/sanity/schemaTypes/singletons";

type Ordering = { field: string; direction: "asc" | "desc" }[];

/** A document that opens straight to its editor (no list). Title comes from the schema. */
const singleton = (
  S: StructureBuilder,
  context: StructureResolverContext,
  type: string
) =>
  S.listItem()
    .title(context.schema.get(type)?.title ?? type)
    .id(type)
    .child(S.document().schemaType(type).documentId(type));

/** A list of every document of one type. */
const collection = (
  S: StructureBuilder,
  title: string,
  type: string,
  ordering?: Ordering
) => {
  const list = S.documentTypeList(type).title(title);
  return S.listItem()
    .title(title)
    .schemaType(type)
    .child(ordering ? list.defaultOrdering(ordering) : list);
};

const folder = (
  S: StructureBuilder,
  title: string,
  items: ReturnType<typeof collection>[]
) => S.listItem().title(title).child(S.list().title(title).items(items));

// Types shown in folders below. Anything not listed here or in singletonTypes
// still appears at the bottom, so a new schema is never hidden by accident.
const grouped = [
  "caseStudy",
  "mediaAppearance",
  "testimonial",
  "guide",
  "servicePackage",
  "expertise",
  "article",
];

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, context, "siteSettings"),
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(pageTypes.map((type) => singleton(S, context, type)))
        ),
      S.divider(),

      folder(S, "Work", [
        collection(S, "Case Studies", "caseStudy", [
          { field: "releaseDate", direction: "desc" },
        ]),
        collection(S, "Media Features", "mediaAppearance", [
          { field: "date", direction: "desc" },
        ]),
        collection(S, "Testimonials", "testimonial"),
      ]),
      folder(S, "Products", [
        collection(S, "Guides", "guide", [
          { field: "order", direction: "asc" },
        ]),
        collection(S, "Packages", "servicePackage", [
          { field: "order", direction: "asc" },
        ]),
        collection(S, "Expertise", "expertise", [
          { field: "order", direction: "asc" },
        ]),
      ]),
      collection(S, "Articles", "article", [
        { field: "publishDate", direction: "desc" },
      ]),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return (
          id &&
          !(singletonTypes as readonly string[]).includes(id) &&
          !grouped.includes(id)
        );
      }),
    ]);
