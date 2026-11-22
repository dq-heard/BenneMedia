import { homePage } from "./homePage";
import { workWithMePage } from "./workWithMePage";
import { guidesPage } from "./guidesPage";
import { caseStudiesPage } from "./caseStudiesPage";
import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";

export {
  homePage,
  workWithMePage,
  guidesPage,
  caseStudiesPage,
  aboutPage,
  contactPage,
};

/** One singleton document per page. Add the page here, then list it in the
 *  desk structure so it opens directly instead of as a list. */
export const pages = [
  homePage,
  workWithMePage,
  guidesPage,
  caseStudiesPage,
  aboutPage,
  contactPage,
];
