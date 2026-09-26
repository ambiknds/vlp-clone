import { defineLive } from 'next-sanity/live'
import { client } from './client'
import { token } from '../env'

/**
 * Live content API for real-time draft and published updates.
 * Passing serverToken ensures server components can read the private dataset.
 * In accordance with AGENTS.md, no browserToken is passed to avoid token leakage.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
})
