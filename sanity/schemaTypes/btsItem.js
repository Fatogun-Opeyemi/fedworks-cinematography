import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'btsItem',
  title: 'BTS Item',
  type: 'document',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Short technical or contextual note for the on-set still or clip.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Behind-the-scenes photograph or camera rig frame.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video File',
      type: 'file',
      description: 'Behind-the-scenes short MP4 video clip.',
      options: {
        accept: 'video/mp4,video/*',
      },
    }),
    defineField({
      name: 'project',
      title: 'Associated Project',
      type: 'reference',
      description: 'Optional link to a project document.',
      to: [{ type: 'project' }],
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Toggle visibility on the public site.',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Display sequence order.',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      projectTitle: 'project.title',
      media: 'image',
    },
    prepare({ title, projectTitle, media }) {
      return {
        title: title || 'Untitled BTS Item',
        subtitle: projectTitle ? `Project: ${projectTitle}` : 'General On Set',
        media,
      }
    },
  },
})
