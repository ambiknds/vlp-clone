import type { ChapterMarker } from '../types'
import { generateSanityKey } from '../utils/id-helper'
import { parseTimestampToSeconds } from './vtt-srt-parser'

/**
 * Parses timestamped chapter markers from raw text (such as YouTube descriptions).
 * Examples:
 * - 00:00 Introduction
 * - 01:25 Server vs Client Components
 * - [05:10] Data Fetching Patterns
 * - 1:12:30 Performance Optimization
 */
export function parseChaptersFromText(rawText: string): ChapterMarker[] {
  if (!rawText) return []

  const chapters: ChapterMarker[] = []
  const lines = rawText.split(/\r?\n/)

  // Matches timestamps like "00:00", "[01:30]", "1:23:45", "02:15 - "
  const timestampRegex = /(?:\[|\()?((\d{1,2}:)?\d{1,2}:\d{2})(?:\]|\))?[\s\-:]+(.+)/

  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(timestampRegex)
    if (match) {
      const timeStr = match[1]
      const label = match[3].replace(/^[\s\-:]+/, '').trim()

      if (label && label.length > 1) {
        const seconds = parseTimestampToSeconds(timeStr)
        chapters.push({
          _key: generateSanityKey('ch', chapters.length),
          startSeconds: Math.floor(seconds),
          label,
        })
      }
    }
  }

  // Sort chronologically
  chapters.sort((a, b) => a.startSeconds - b.startSeconds)

  // Ensure first chapter starts at 0 if none at 0
  if (chapters.length > 0 && chapters[0].startSeconds > 30) {
    chapters.unshift({
      _key: generateSanityKey('ch', 0),
      startSeconds: 0,
      label: 'Introduction',
    })
  }

  return chapters
}

/**
 * Parses WebVTT chapters (e.g. standard WebVTT chapters track file)
 */
export function parseWebVTTChapters(vttContent: string): ChapterMarker[] {
  const chapters: ChapterMarker[] = []
  const lines = vttContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  let i = 0
  const timeRegex = /((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{3})?)\s+-->\s+((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{3})?)/

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line || line.startsWith('WEBVTT') || line.startsWith('NOTE')) {
      i++
      continue
    }

    const match = line.match(timeRegex)
    if (match) {
      const start = parseTimestampToSeconds(match[1])
      i++

      const labelLines: string[] = []
      while (i < lines.length && lines[i].trim() !== '') {
        labelLines.push(lines[i].trim())
        i++
      }

      const label = labelLines.join(' ').replace(/<[^>]+>/g, '').trim()
      if (label) {
        chapters.push({
          _key: generateSanityKey('ch', chapters.length),
          startSeconds: Math.floor(start),
          label,
        })
      }
    } else {
      i++
    }
  }

  chapters.sort((a, b) => a.startSeconds - b.startSeconds)
  return chapters
}

/**
 * Fallback chapter generator when video lacks explicit chapter tracks.
 * Generates structured table of contents using key points and lesson title.
 */
export function generateFallbackChapters(
  title: string,
  keyPoints: string[] = [],
  totalDurationSeconds = 300
): ChapterMarker[] {
  const chapters: ChapterMarker[] = [
    {
      _key: generateSanityKey('ch', 0),
      startSeconds: 0,
      label: 'Overview & Context',
    },
  ]

  const points = keyPoints.filter(Boolean)
  if (points.length > 0) {
    const step = Math.floor(totalDurationSeconds / (points.length + 1))
    points.forEach((point, idx) => {
      chapters.push({
        _key: generateSanityKey('ch', idx + 1),
        startSeconds: Math.min(totalDurationSeconds - 10, (idx + 1) * step),
        label: point,
      })
    })
  } else {
    // Generate standard instructional milestones
    chapters.push(
      {
        _key: generateSanityKey('ch', 1),
        startSeconds: Math.floor(totalDurationSeconds * 0.3),
        label: `Core Concepts: ${title}`,
      },
      {
        _key: generateSanityKey('ch', 2),
        startSeconds: Math.floor(totalDurationSeconds * 0.7),
        label: 'Implementation & Practical Takeaways',
      }
    )
  }

  return chapters
}
