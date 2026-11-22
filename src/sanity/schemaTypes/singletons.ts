/** Page singletons, in the order they appear in the Studio's Pages folder
 *  (matches the site navigation). Add a new page here and in pages/index.ts. */
export const pageTypes = [
  "homePage",
  "workWithMePage",
  "guidesPage",
  "caseStudiesPage",
  "aboutPage",
  "contactPage",
] as const;

/** Documents that exist exactly once. Used by the desk structure and by
 *  `document.newDocumentOptions` / `document.actions` in sanity.config.ts so
 *  editors can't create duplicates or delete them. */
export const singletonTypes = ["siteSettings", ...pageTypes] as const;
export type SingletonType = (typeof singletonTypes)[number];
