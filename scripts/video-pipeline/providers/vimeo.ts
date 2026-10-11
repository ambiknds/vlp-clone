import type { SubtitleCue } from '../types'
import { parseWebVTT } from '../parsers/vtt-srt-parser'

/**
 * Extracts numeric Vimeo video ID from URL.
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null
  const match =
    url.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/) ||
    url.match(/player\.vimeo\.com\/video\/(\d+)/)
  return match ? match[1] : null
}

/**
 * Fetches Vimeo oEmbed metadata (title, duration, description)
 */
export async function fetchVimeoMetadata(videoId: string): Promise<{
  title?: string
  duration?: number
  description?: string
} | null> {
  try {
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      duration: data.duration,
      description: data.description,
    }
  } catch {
    return null
  }
}

/**
 * Ingests Vimeo caption track from remote VTT URL or content string.
 */
export async function ingestVimeoCaptionsFromUrl(vttUrl: string): Promise<SubtitleCue[]> {
  try {
    const res = await fetch(vttUrl, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return []
    const content = await res.text()
    return parseWebVTT(content)
  } catch {
    return []
  }
}
