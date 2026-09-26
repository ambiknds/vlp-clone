import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export const learningOutcomeType = defineType({
  name: 'learningOutcome',
  title: 'Learning Outcome',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Outcome Title',
      type: 'string',
      validation: (rule) => rule.required().error('Outcome title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon Key / Name',
      type: 'string',
      description: 'Lucide icon identifier (e.g. "code", "zap", "shield", "database", "layers")',
      initialValue: 'check-circle',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Learning Outcome',
        subtitle: subtitle,
        media: CheckmarkCircleIcon,
      }
    },
  },
})
