import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
    }),
    defineField({
      name: 'isMain',
      title: 'Is Main Event',
      type: 'boolean',
      initialValue: false,
    }),
    orderRankField({ type: 'event' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'date' },
  },
})
