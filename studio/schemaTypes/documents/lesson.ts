import { defineField, defineType, defineArrayMember } from 'sanity'
import { DocumentVideoIcon } from '@sanity/icons'

export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: DocumentVideoIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      validation: (rule) => rule.required().error('Lesson title is required'),
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
      name: 'videoUrl',
      title: 'Video Embed URL',
      type: 'url',
      description: 'Supported providers: YouTube, Vimeo, Bunny embed URLs',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }).error('A valid video URL is required'),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Poster / Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (Display)',
      type: 'string',
      description: 'Formatted duration shown in UI, e.g. "12:45" or "8:20"',
      validation: (rule) => rule.required().error('Duration display string is required'),
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (Seconds)',
      type: 'number',
      description: 'Duration in total seconds (used for progress tracking and seeking)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free Preview',
      type: 'boolean',
      description: 'Presentational badge indicating this lesson can be previewed without enrollment',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count (Display)',
      type: 'number',
      initialValue: 0,
      description: 'Number of learners displayed for social proof',
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points ("In this lesson you will...")',
      description: 'Bullet points highlighting what the student will learn in this lesson',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip (Optional Callout)',
      type: 'text',
      rows: 3,
      description: 'Highlighted pro-tip shown alongside the notes in the lesson view',
    }),
    defineField({
      name: 'notes',
      title: 'Lesson Notes (Portable Text)',
      description: 'Comprehensive rich text notes, code snippets, and explanations',
      type: 'blockContent',
    }),
    defineField({
      name: 'resources',
      title: 'Lesson Resources',
      description: 'Downloads, source code repositories, guides, and external links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'resource',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      freePreview: 'freePreview',
      media: 'thumbnail',
    },
    prepare({ title, duration, freePreview, media }) {
      const badges = [duration, freePreview ? 'Free Preview' : null].filter(Boolean).join(' • ')
      return {
        title: title || 'Untitled Lesson',
        subtitle: badges,
        media: media || DocumentVideoIcon,
      }
    },
  },
})
