import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

export default defineType({
  name: 'liveSet',
  title: 'Live Set',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trackUrl',
      title: 'SoundCloud Track URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    orderRankField({ type: 'liveSet' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'trackUrl' },
  },
})
