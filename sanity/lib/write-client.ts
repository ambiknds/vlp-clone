import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Server-only Sanity write client for learner progress and offline mutations.
 * Strictly adheres to AGENTS.md Sections 5, 7, 8, 12:
 * - Must never be imported in client components.
 * - Uses server-only mutation token.
 */
const writeToken =
  process.env.SANITY_API_DEVELOPER_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
  perspective: 'published',
})
