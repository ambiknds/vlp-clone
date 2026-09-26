import { createClient, type ClientConfig } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from '../env'

/**
 * Server-ready Sanity client.
 * For private datasets, uses SANITY_API_READ_TOKEN with useCdn: false.
 * When token is present, perspective defaults to 'published'.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Never cache against public CDN when accessing private dataset with a token
  useCdn: !token,
  token,
  perspective: 'published',
})

/**
 * Returns a configured Sanity client, allowing override of token or perspective.
 */
export function getSanityClient(customConfig?: Partial<ClientConfig>) {
  return client.withConfig(customConfig || {})
}
