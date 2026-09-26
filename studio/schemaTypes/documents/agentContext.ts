import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const agentContextType = defineType({
  name: 'agentContext',
  title: 'Agent Search Configuration',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Configuration Name',
      type: 'string',
      initialValue: 'Vertex Search Agent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scopeFilter',
      title: 'Content Scope Filter',
      description: 'GROQ filter defining visible content types for the agent',
      type: 'text',
      rows: 3,
      initialValue: '_type in ["course", "lesson", "instructor", "category"]',
    }),
    defineField({
      name: 'instructions',
      title: 'Search Agent Query Instructions',
      description: 'System instructions that guide the LLM when querying the Sanity Context MCP',
      type: 'text',
      rows: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'scopeFilter',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Agent Search Configuration',
        subtitle: subtitle || 'No filter defined',
        media: CogIcon,
      }
    },
  },
})
