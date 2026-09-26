import { defineField, defineType, defineArrayMember } from 'sanity'
import { MasterDetailIcon } from '@sanity/icons'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      validation: (rule) => rule.required().error('Course title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Marketing Summary / Description',
      type: 'text',
      rows: 3,
      description: 'Concise summary of the course shown on catalog cards and the hero section',
      validation: (rule) => rule.required().error('Course summary is required'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'badgeIcon',
      title: 'Logo / Badge Icon Preset',
      type: 'string',
      description: 'Card badge icon identifier (e.g., "nextjs", "typescript", "docker", "react")',
      options: {
        list: [
          { title: 'Next.js (Dark Badge)', value: 'nextjs' },
          { title: 'TypeScript (Blue Badge)', value: 'typescript' },
          { title: 'Docker (Whale Badge)', value: 'docker' },
          { title: 'React (Cyan Badge)', value: 'react' },
          { title: 'Python (Yellow/Blue Badge)', value: 'python' },
          { title: 'Database (Slate Badge)', value: 'database' },
        ],
      },
      initialValue: 'nextjs',
    }),
    defineField({
      name: 'level',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'All Levels', value: 'All Levels' },
        ],
      },
      initialValue: 'Intermediate',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Estimated Total Duration',
      type: 'string',
      description: 'e.g. "18h 24m" or "6h 15m"',
      initialValue: '12h 00m',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      description: 'Display price (0 for free)',
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'popular',
      title: 'Popular Course Flag',
      type: 'boolean',
      description: 'Highlights course with a popular badge in catalog listings',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count (Display)',
      type: 'number',
      initialValue: 0,
      description: 'Number of active learners for social proof',
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required().error('Instructor reference is required'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required().error('Category reference is required'),
    }),
    defineField({
      name: 'learningOutcomes',
      title: 'Learning Outcomes ("What You\'ll Learn")',
      description: 'Short list of concrete outcomes students achieve',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'learningOutcome',
        }),
      ],
      validation: (rule) => rule.min(1).warning('Add at least one learning outcome'),
    }),
    defineField({
      name: 'modules',
      title: 'Course Modules',
      description: 'Ordered sequence of modules containing the course lessons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'module',
        }),
      ],
      validation: (rule) => rule.min(1).error('A course must contain at least one module'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      level: 'level',
      categoryTitle: 'category.title',
      instructorName: 'instructor.name',
      media: 'coverImage',
    },
    prepare({ title, level, categoryTitle, instructorName, media }) {
      const subtitle = [categoryTitle, level, instructorName ? `by ${instructorName}` : null]
        .filter(Boolean)
        .join(' • ')
      return {
        title: title || 'Untitled Course',
        subtitle,
        media: media || MasterDetailIcon,
      }
    },
  },
})
