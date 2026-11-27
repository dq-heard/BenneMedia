import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

// Load environment variables from the root directory based on current mode
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  ""
);

// Define an array of paths to exclude from the sitemap
const EXCLUDED_EXACT_PATHS = ["/packages"];
const EXCLUDED_ROUTES = ["/studio"];

export default defineConfig({
  site: "https://bennemediasolutions.com",
  adapter: cloudflare(),
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || "production",
      studioBasePath: "/studio",
      useCdn: false,
    }),
    react(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/+$/, "") || "/";

        if (EXCLUDED_EXACT_PATHS.includes(pathname)) {
          return false;
        }

        return !EXCLUDED_ROUTES.some(
          (route) => pathname === route || pathname.startsWith(`${route}/`)
        );
      },
    }),
  ],
});
