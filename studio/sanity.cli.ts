import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'zq8k8g90',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  typegen: {
    enabled: true,
    path: '../sanity/lib/queries.ts',
    schema: 'schema.json',
    generates: '../types/sanity.types.ts',
  },
})
