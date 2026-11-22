import type {SchemaTypeDefinition} from 'sanity'

import {documents} from './documents'
import {objects} from './objects'
import {pages} from './pages'

/** Register in sanity.config.ts: schema: {types: schemaTypes} */
export const schemaTypes: SchemaTypeDefinition[] = [...pages, ...documents, ...objects]
