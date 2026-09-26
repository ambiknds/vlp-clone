import { defineType, defineArrayMember, defineField } from 'sanity'
import { BlockContentIcon, CodeBlockIcon, InfoOutlineIcon } from '@sanity/icons'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  icon: BlockContentIcon,
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (rule) =>
                  rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),
    defineArrayMember({
      name: 'codeSnippet',
      title: 'Code Snippet',
      type: 'object',
      icon: CodeBlockIcon,
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TSX / React', value: 'tsx' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash / Shell', value: 'bash' },
              { title: 'GROQ', value: 'groq' },
            ],
          },
          initialValue: 'typescript',
        }),
        defineField({
          name: 'filename',
          title: 'Filename (Optional)',
          type: 'string',
          description: 'e.g. "app/page.tsx"',
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 8,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          language: 'language',
          filename: 'filename',
          code: 'code',
        },
        prepare({ language, filename, code }) {
          return {
            title: filename || `${language || 'code'} snippet`,
            subtitle: code ? code.slice(0, 60) + '...' : '',
            media: CodeBlockIcon,
          }
        },
      },
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout / Pro Tip Box',
      type: 'object',
      icon: InfoOutlineIcon,
      fields: [
        defineField({
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              { title: 'Pro Tip (Orange)', value: 'tip' },
              { title: 'Info (Blue)', value: 'info' },
              { title: 'Warning (Amber)', value: 'warning' },
            ],
          },
          initialValue: 'tip',
        }),
        defineField({
          name: 'text',
          title: 'Callout Text',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          tone: 'tone',
          text: 'text',
        },
        prepare({ tone, text }) {
          return {
            title: `Callout (${tone || 'tip'})`,
            subtitle: text,
            media: InfoOutlineIcon,
          }
        },
      },
    }),
  ],
})
