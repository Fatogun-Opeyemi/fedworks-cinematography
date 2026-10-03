import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes/index.js'

export default defineConfig({
  name: 'default',
  title: 'FEDWORKS Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '1qg7m6y2',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Projects
            S.listItem()
              .title('Projects')
              .schemaType('project')
              .child(S.documentTypeList('project').title('All Projects')),

            // BTS / On Set
            S.listItem()
              .title('BTS / On Set')
              .schemaType('btsItem')
              .child(S.documentTypeList('btsItem').title('BTS & On Set Items')),

            S.divider(),

            // Site Settings Singleton
            S.listItem()
              .title('Site Settings')
              .schemaType('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
