import type { SubtitleCue, ChapterMarker } from '../types'
import { sanitizeSubtitleText } from '../parsers/vtt-srt-parser'
import { parseChaptersFromText } from '../parsers/chapter-parser'

/**
 * Extracts YouTube 11-character video ID from URL.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/) ||
    url.match(/[?&]v=([\w-]{11})/)
  return match ? match[1] : null
}

/**
 * Lightweight helper to fetch YouTube captions from public timedtext endpoints.
 * Returns SubtitleCue[] or null if captions are unavailable / restricted.
 */
export async function fetchYouTubeCaptions(videoId: string): Promise<SubtitleCue[] | null> {
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
    const pageRes = await fetch(watchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
    })

    if (!pageRes.ok) return null
    const html = await pageRes.text()

    // Look for captionTracks in ytInitialPlayerResponse
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});(?:var|\s*<\/script>)/)
    if (!playerResponseMatch) return null

    const playerResponse = JSON.parse(playerResponseMatch[1])
    const captionTracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks

    if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
      return null
    }

    // Prefer English captions (manual first, then auto-generated ASR)
    const enTrack =
      captionTracks.find((t: { languageCode: string; kind?: string }) => t.languageCode === 'en' && t.kind !== 'asr') ||
      captionTracks.find((t: { languageCode: string }) => t.languageCode === 'en') ||
      captionTracks[0]

    if (!enTrack?.baseUrl) return null

    // Fetch caption XML or JSON
    const captionRes = await fetch(`${enTrack.baseUrl}&fmt=json3`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(6000),
    })

    if (!captionRes.ok) return null
    const captionData = await captionRes.json()

    if (!Array.isArray(captionData?.events)) return null

    const cues: SubtitleCue[] = []
    for (const evt of captionData.events) {
      if (!evt.segs || !Array.isArray(evt.segs)) continue
      const startSec = (evt.tStartMs || 0) / 1000
      const durSec = (evt.dDurationMs || 0) / 1000
      const text = evt.segs.map((s: { utf8?: string }) => s.utf8 || '').join('').trim()
      const cleanText = sanitizeSubtitleText(text)

      if (cleanText) {
        cues.push({
          startSeconds: Math.round(startSec * 10) / 10,
          endSeconds: Math.round((startSec + durSec) * 10) / 10,
          text: cleanText,
        })
      }
    }

    return cues.length > 0 ? cues : null
  } catch {
    // Graceful fallback for offline, network, or restricted environments
    return null
  }
}

/**
 * Extracts chapters from YouTube watch page description or details.
 */
export async function fetchYouTubeDescriptionChapters(videoId: string): Promise<ChapterMarker[]> {
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
    const pageRes = await fetch(watchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
    })

    if (!pageRes.ok) return []
    const html = await pageRes.text()

    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});(?:var|\s*<\/script>)/)
    if (!playerResponseMatch) return []

    const playerResponse = JSON.parse(playerResponseMatch[1])
    const description = playerResponse?.videoDetails?.shortDescription || ''

    return parseChaptersFromText(description)
  } catch {
    return []
  }
}
