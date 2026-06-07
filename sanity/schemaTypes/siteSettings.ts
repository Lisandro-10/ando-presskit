import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'biographyColumn1',
      title: 'Biography — Column 1',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'segment',
          fields: [
            { name: 'text', title: 'Text', type: 'string' },
            {
              name: 'emphasis',
              title: 'Emphasis',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: '' },
                  { title: 'Brand (Orbitron)', value: 'brand' },
                  { title: 'Strong (Bold)', value: 'strong' },
                ],
              },
            },
          ],
          preview: {
            select: { title: 'text', subtitle: 'emphasis' },
          },
        },
      ],
    }),
    defineField({
      name: 'biographyColumn2',
      title: 'Biography — Column 2',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'segment',
          fields: [
            { name: 'text', title: 'Text', type: 'string' },
            {
              name: 'emphasis',
              title: 'Emphasis',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: '' },
                  { title: 'Brand (Orbitron)', value: 'brand' },
                  { title: 'Strong (Bold)', value: 'strong' },
                ],
              },
            },
          ],
          preview: {
            select: { title: 'text', subtitle: 'emphasis' },
          },
        },
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'soundcloud', title: 'SoundCloud URL', type: 'url' },
        { name: 'spotify', title: 'Spotify URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'directEmail',
      title: 'Direct Email',
      type: 'string',
    }),
  ],
})
