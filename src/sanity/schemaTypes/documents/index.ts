import {article} from './article'
import {caseStudy} from './caseStudy'
import {expertise} from './expertise'
import {guide} from './guide'
import {mediaAppearance} from './mediaAppearance'
import {servicePackage} from './servicePackage'
import {siteSettings} from './siteSettings'
import {testimonial} from './testimonial'

export {article, caseStudy, expertise, guide, mediaAppearance, servicePackage, siteSettings, testimonial}

/** Add a new document type: create the file, import it above, add it here. */
export const documents = [
  siteSettings,
  caseStudy,
  servicePackage,
  expertise,
  guide,
  article,
  mediaAppearance,
  testimonial,
]
