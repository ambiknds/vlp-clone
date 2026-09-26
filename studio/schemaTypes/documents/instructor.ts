import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const instructorType = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required().error('Instructor name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required().error('Instructor photo is required'),
    }),
    defineField({
      name: 'expertise',
      title: 'Title / Area of Expertise',
      type: 'string',
      description: 'e.g. "Senior Staff Engineer & Next.js Core Contributor"',
      validation: (rule) => rule.required().error('Expertise is required'),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'expertise',
      media: 'photo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Instructor',
        subtitle: subtitle,
        media: media || UserIcon,
      }
    },
  },
})
