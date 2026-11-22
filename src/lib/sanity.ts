import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

/** urlFor(image).width(800).auto('format').url() */
export const urlFor = (source: SanityImageSource) => builder.image(source);
