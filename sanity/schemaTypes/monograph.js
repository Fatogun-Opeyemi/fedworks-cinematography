import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'monograph',
  title: 'Monograph Publication',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Monograph Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issueNumber',
      title: 'Issue / Volume Number',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
    }),
    defineField({
      name: 'editionSize',
      title: 'Edition Size',
      type: 'string',
    }),
    defineField({
      name: 'paperStock',
      title: 'Paper Stock & Binding',
      type: 'string',
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],
})
