import 'server-only'
import { client } from './client'
import type { QueryParams } from 'next-sanity'

export interface SanityFetchOptions {
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}

/**
 * Server-only fetch helper for querying the private Sanity dataset.
 * Automatically injects the server token and enforces Next.js cache revalidation tags.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? 0 : revalidate,
      tags,
    },
  })
}
