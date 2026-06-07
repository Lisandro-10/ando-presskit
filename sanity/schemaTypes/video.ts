import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'file',
      title: 'Video File (mp4)',
      type: 'file',
      options: { accept: 'video/mp4' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation',
      type: 'string',
      options: {
        list: [
          { title: 'Tall (vertical)', value: 'tall' },
          { title: 'Wide (horizontal)', value: 'wide' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image (preview frame)',
      description: 'Shown before the video loads — prevents downloading the full video until play.',
      type: 'image',
      options: { hotspot: true },
    }),
    orderRankField({ type: 'video' }),
  ],
})
