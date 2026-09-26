import { defineField, defineType, defineArrayMember } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export const progressRecordType = defineType({
  name: 'progressRecord',
  title: 'Learner Progress Record',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'Clerk User ID',
      type: 'string',
      description: 'The Clerk user ID this progress record belongs to',
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'completedLessons',
      title: 'Completed Lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
    }),
    defineField({
      name: 'lastLesson',
      title: 'Last Active Lesson',
      type: 'reference',
      to: [{ type: 'lesson' }],
    }),
    defineField({
      name: 'lastPositionSeconds',
      title: 'Last Watched Position (Seconds)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      userId: 'userId',
      completedCount: 'completedLessons.length',
      lastLessonTitle: 'lastLesson.title',
    },
    prepare({ userId, completedCount, lastLessonTitle }) {
      return {
        title: `User: ${userId || 'Unknown'}`,
        subtitle: `${completedCount || 0} completed • Last: ${lastLessonTitle || 'None'}`,
        media: ActivityIcon,
      }
    },
  },
})
