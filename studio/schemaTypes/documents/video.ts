import { defineField, defineType, defineArrayMember } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoType = defineType({
  name: 'video',
  title: 'Video Intelligence Record',
  type: 'document',
  icon: PlayIcon,
  readOnly: false,
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'Identifier derived from video URL (e.g. YouTube ID, Vimeo ID)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Bunny', value: 'bunny' },
        ],
      },
    }),
    defineField({
      name: 'chapters',
      title: 'Table of Contents / Chapter Markers',
      description: 'Timestamped chapter markers for precise seeking',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Seconds',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Chapter Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              startSeconds: 'startSeconds',
              label: 'label',
            },
            prepare({ startSeconds, label }) {
              const minutes = Math.floor((startSeconds || 0) / 60)
              const seconds = (startSeconds || 0) % 60
              const time = `${minutes}:${seconds.toString().padStart(2, '0')}`
              return {
                title: label || 'Chapter',
                subtitle: `Starts at ${time} (${startSeconds}s)`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      description: 'Timestamped transcript pieces (ingested offline)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'transcriptChunk',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Seconds',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'text',
              title: 'Chunk Text',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              startSeconds: 'startSeconds',
              text: 'text',
            },
            prepare({ startSeconds, text }) {
              return {
                title: text ? text.slice(0, 70) + '...' : 'Chunk',
                subtitle: `At ${startSeconds}s`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'videoId',
      subtitle: 'url',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Video Record',
        subtitle,
        media: PlayIcon,
      }
    },
  },
})
