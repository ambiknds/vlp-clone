import type { SubtitleCue } from '../types'

/**
 * Parses timestamp string into floating seconds.
 * Supports:
 * - 00:01:23.456 / 00:01:23,456 (HH:MM:SS.mmm)
 * - 01:23.456 / 01:23,456 (MM:SS.mmm)
 * - 01:23 (MM:SS)
 * - 1:23:45 (H:MM:SS)
 */
export function parseTimestampToSeconds(timestamp: string): number {
  if (!timestamp) return 0
  const clean = timestamp.trim().replace(',', '.')
  const parts = clean.split(':').map((p) => parseFloat(p))

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    return Math.max(0, hours * 3600 + minutes * 60 + seconds)
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return Math.max(0, minutes * 60 + seconds)
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return Math.max(0, parts[0])
  }
  return 0
}

/**
 * Sanitizes caption text:
 * - Decodes basic HTML entities
 * - Strips WebVTT voice/formatting tags (<v ...>, <b>, <i>, etc.)
 * - Strips inline timestamp tags (<00:00:01.000>)
 * - Cleans repetitive sound effects ([Music], [Applause])
 */
export function sanitizeSubtitleText(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/<[^>]+>/g, '') // Remove HTML/VTT tags
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\[(music|applause|laughter|cheering|chatter)\]/gi, '')
    .replace(/\((music|applause|laughter|cheering|chatter)\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Parses WebVTT content into SubtitleCue items.
 */
export function parseWebVTT(vttContent: string): SubtitleCue[] {
  const cues: SubtitleCue[] = []
  const lines = vttContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  let i = 0
  const timeRegex = /((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{3})?)\s+-->\s+((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{3})?)/

  while (i < lines.length) {
    const line = lines[i].trim()

    // Skip empty lines, headers, and comments
    if (!line || line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE')) {
      i++
      continue
    }

    const match = line.match(timeRegex)
    if (match) {
      const start = parseTimestampToSeconds(match[1])
      const end = parseTimestampToSeconds(match[2])
      i++

      const textLines: string[] = []
      while (i < lines.length && lines[i].trim() !== '') {
        textLines.push(lines[i].trim())
        i++
      }

      const text = sanitizeSubtitleText(textLines.join(' '))
      if (text) {
        cues.push({ startSeconds: Math.round(start * 10) / 10, endSeconds: Math.round(end * 10) / 10, text })
      }
    } else {
      i++
    }
  }

  return cues
}

/**
 * Parses SubRip (.srt) content into SubtitleCue items.
 */
export function parseSRT(srtContent: string): SubtitleCue[] {
  const cues: SubtitleCue[] = []
  const blocks = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\s*\n/)

  const timeRegex = /(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s+-->\s+(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})/

  for (const block of blocks) {
    const lines = block.trim().split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) continue

    // Find the line with the timestamp arrow
    const timeLineIndex = lines.findIndex((l) => timeRegex.test(l))
    if (timeLineIndex === -1) continue

    const match = lines[timeLineIndex].match(timeRegex)
    if (!match) continue

    const start = parseTimestampToSeconds(match[1])
    const end = parseTimestampToSeconds(match[2])
    const textLines = lines.slice(timeLineIndex + 1)
    const text = sanitizeSubtitleText(textLines.join(' '))

    if (text) {
      cues.push({ startSeconds: Math.round(start * 10) / 10, endSeconds: Math.round(end * 10) / 10, text })
    }
  }

  return cues
}

/**
 * Parses JSON caption format (e.g. [{ start: 0, dur: 3.5, text: "..." }])
 */
export function parseJSONCaptions(jsonContent: string): SubtitleCue[] {
  try {
    const data = JSON.parse(jsonContent)
    if (!Array.isArray(data)) return []

    const cues: SubtitleCue[] = []
    for (const item of data) {
      const start = Number(item.start ?? item.startSeconds ?? item.offset ?? 0)
      const duration = Number(item.duration ?? item.dur ?? 3)
      const text = sanitizeSubtitleText(String(item.text ?? item.caption ?? ''))

      if (text) {
        cues.push({
          startSeconds: Math.round(start * 10) / 10,
          endSeconds: Math.round((start + duration) * 10) / 10,
          text,
        })
      }
    }
    return cues
  } catch {
    return []
  }
}

/**
 * Universal subtitle parser: detects WebVTT, SRT, or JSON and parses to SubtitleCue[]
 */
export function parseSubtitles(content: string): SubtitleCue[] {
  const trimmed = content.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseJSONCaptions(trimmed)
  }
  if (trimmed.startsWith('WEBVTT') || trimmed.includes('-->') && trimmed.includes('.')) {
    return parseWebVTT(trimmed)
  }
  return parseSRT(trimmed)
}
