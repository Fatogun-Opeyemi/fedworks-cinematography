import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the project or film.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL slug for the project detail page.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Primary project category.',
      options: {
        list: [
          { title: 'Narrative', value: 'narrative' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Music', value: 'music' },
          { title: 'Documentary', value: 'documentary' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'Year of completion or release.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Synopsis or conceptual project overview.',
      rows: 4,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Feature this project on the homepage.',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Ascending numerical order for sequence display.',
      initialValue: 10,
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Compact image preview for grids and lists.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'image',
      description: 'High-resolution primary poster image for the project.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video Asset',
      type: 'file',
      description: 'Web-ready MP4 video file.',
      options: {
        accept: 'video/mp4,video/*',
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Stills Gallery',
      type: 'array',
      description: 'High-resolution film stills and production photography.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      description: 'Key collaborators and technical camera specifications.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', title: 'Role / Specification', type: 'string' },
            { name: 'name', title: 'Name / Detail', type: 'string' },
          ],
          preview: {
            select: { title: 'role', subtitle: 'name' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      year: 'year',
      media: 'poster',
    },
    prepare({ title, category, year, media }) {
      return {
        title,
        subtitle: `${category ? category.toUpperCase() : ''} · ${year || ''}`,
        media,
      }
    },
  },
})
