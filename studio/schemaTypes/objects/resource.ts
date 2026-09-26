import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const resourceType = defineType({
  name: 'resource',
  title: 'Lesson Resource',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      validation: (rule) => rule.required().error('Resource title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'type',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'PDF Document', value: 'PDF' },
          { title: 'Source Code / Repo', value: 'Code' },
          { title: 'Guide / Documentation', value: 'Guide' },
          { title: 'External Link', value: 'Link' },
          { title: 'Video / Recording', value: 'Video' },
        ],
      },
      initialValue: 'PDF',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Resource URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size (Optional)',
      type: 'string',
      description: 'e.g. "1.2 MB", "450 KB"',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      fileSize: 'fileSize',
    },
    prepare({ title, type, fileSize }) {
      return {
        title: title || 'Resource',
        subtitle: [type, fileSize].filter(Boolean).join(' • '),
        media: DocumentIcon,
      }
    },
  },
})
