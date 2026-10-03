import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Contributor / Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 3,
    }),
  ],
})
