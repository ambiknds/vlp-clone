import { defineField, defineType, defineArrayMember } from 'sanity'
import { OlistIcon } from '@sanity/icons'

export const moduleType = defineType({
  name: 'module',
  title: 'Course Module',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: (rule) => rule.required().error('Module title is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Module Summary',
      type: 'text',
      rows: 2,
      description: 'A brief summary of what this module covers',
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      description: 'Ordered list of lessons belonging to this module',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      validation: (rule) => rule.min(1).warning('A module should contain at least one lesson'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessons: 'lessons',
    },
    prepare({ title, lessons }) {
      const lessonCount = Array.isArray(lessons) ? lessons.length : 0
      return {
        title: title || 'Untitled Module',
        subtitle: `${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`,
        media: OlistIcon,
      }
    },
  },
})
