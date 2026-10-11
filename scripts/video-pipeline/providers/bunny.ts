import type { SubtitleCue } from '../types'
import { parseWebVTT } from '../parsers/vtt-srt-parser'

/**
 * Extracts Library ID and Video ID from Bunny Stream URL.
 */
export function extractBunnyIds(url: string): { libraryId: string; videoId: string } | null {
  if (!url) return null
  const match =
    url.match(/(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/)
  if (match && match[1] && match[2]) {
    return {
      libraryId: match[1],
      videoId: match[2],
    }
  }
  return null
}

/**
 * Ingests Bunny Stream caption track from remote or local VTT URL.
 */
export async function ingestBunnyCaptionsFromUrl(vttUrl: string): Promise<SubtitleCue[]> {
  try {
    const res = await fetch(vttUrl, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return []
    const content = await res.text()
    return parseWebVTT(content)
  } catch {
    return []
  }
}
