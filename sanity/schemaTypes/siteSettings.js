import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      description: 'Primary MP4 cinematography reel for the homepage hero.',
      options: {
        accept: 'video/mp4,video/*',
      },
    }),
    defineField({
      name: 'heroPoster',
      title: 'Hero Poster',
      type: 'image',
      description: 'Poster image displayed before or alongside hero video playback.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutHeading',
      title: 'About Heading',
      type: 'string',
      description: 'Primary headline on the About page.',
      initialValue: 'Cinematographer. Director. Storyteller.',
    }),
    defineField({
      name: 'aboutBody',
      title: 'About Body Text',
      type: 'text',
      description: 'Main editorial text for the About page.',
      rows: 6,
    }),
    defineField({
      name: 'mentoringHeading',
      title: 'Mentoring Heading',
      type: 'string',
      description: 'Headline on the Mentoring page.',
      initialValue: 'Shadow a shoot. Practical set craft.',
    }),
    defineField({
      name: 'mentoringBody',
      title: 'Mentoring Body Text',
      type: 'text',
      description: 'Program description for mentoring and shadowing.',
      rows: 6,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Direct inquiries email address.',
      initialValue: 'studio@fedworks.com',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Optional link to official Instagram profile.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
        subtitle: 'Hero reel, copy, and contact info',
      }
    },
  },
})
