import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import { structureTool } from "sanity/structure";
import { structure } from "./structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { singletonTypes } from "./src/sanity/schemaTypes/singletons";

const singletons: readonly string[] = singletonTypes;

export default defineConfig({
  name: "default",
  title: "Benne Media Solutions",

  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2025-01-01" }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              action && !["unpublish", "delete", "duplicate"].includes(action)
          )
        : prev,
  },
});
