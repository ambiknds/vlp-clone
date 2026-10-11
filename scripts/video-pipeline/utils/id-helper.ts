import type { VideoProvider } from '../types'

/**
 * Generates a deterministic document ID derived from a video URL.
 * Strictly adheres to AGENTS.md Section 9:
 * "keyed by an id derived from the video URL, stripping any characters the datastore rejects in ids."
 *
 * Sanity document IDs only allow alphanumeric characters, underscores, dashes, and periods: [a-zA-Z0-9_.-]
 */
export function deriveVideoDocumentId(
  url: string,
  provider?: VideoProvider,
  videoId?: string
): string {
  if (!url && !videoId) {
    throw new Error('Cannot derive video ID: both URL and videoId are missing')
  }

  // If provider and videoId are known, produce a clean provider-scoped ID
  if (provider && videoId) {
    const cleanId = videoId.replace(/[^a-zA-Z0-9_.-]/g, '_')
    if (provider === 'youtube') return `video.yt_${cleanId}`
    if (provider === 'vimeo') return `video.vm_${cleanId}`
    if (provider === 'bunny') return `video.bn_${cleanId}`
  }

  // Generic fallback derived directly from the URL
  const sanitized = url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120)

  return `video.${sanitized}`
}

/**
 * Generates a stable or random key for array items in Sanity documents.
 */
export function generateSanityKey(prefix = 'k', index?: number): string {
  if (typeof index === 'number') {
    return `${prefix}_${index.toString().padStart(3, '0')}`
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`
}
