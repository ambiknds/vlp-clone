import fs from 'node:fs'
import path from 'node:path'
import type {
  VideoProvider,
  SanityVideoDocument,
  ChapterMarker,
  TranscriptChunk,
  ChunkingOptions,
} from './types'
import { deriveVideoDocumentId } from './utils/id-helper'
import { parseSubtitles } from './parsers/vtt-srt-parser'
import { chunkSubtitleCues, chunkTextWithDuration } from './parsers/chunker'
import {
  parseChaptersFromText,
  parseWebVTTChapters,
  generateFallbackChapters,
} from './parsers/chapter-parser'
import {
  extractYouTubeId,
  fetchYouTubeCaptions,
  fetchYouTubeDescriptionChapters,
} from './providers/youtube'
import { extractVimeoId } from './providers/vimeo'
import { extractBunnyIds } from './providers/bunny'

export interface ProcessVideoParams {
  url: string
  provider?: VideoProvider
  transcriptSource?: string // File path, URL, or raw string content
  chaptersSource?: string // File path, URL, or raw string content
  lessonContext?: {
    title?: string
    keyPoints?: string[]
    durationSeconds?: number
    notesText?: string[]
  }
  chunkingOptions?: ChunkingOptions
}

/**
 * Detects the video provider and extracts the provider-specific video ID.
 */
export function resolveProviderAndId(
  url: string,
  preferredProvider?: VideoProvider
): { provider: VideoProvider; videoId: string } {
  // 1. YouTube
  const ytId = extractYouTubeId(url)
  if (ytId && (!preferredProvider || preferredProvider === 'youtube')) {
    return { provider: 'youtube', videoId: ytId }
  }

  // 2. Vimeo
  const vmId = extractVimeoId(url)
  if (vmId && (!preferredProvider || preferredProvider === 'vimeo')) {
    return { provider: 'vimeo', videoId: vmId }
  }

  // 3. Bunny Stream
  const bn = extractBunnyIds(url)
  if (bn && (!preferredProvider || preferredProvider === 'bunny')) {
    return { provider: 'bunny', videoId: `${bn.libraryId}_${bn.videoId}` }
  }

  // Generic fallback
  const fallbackProvider = preferredProvider || 'youtube'
  const fallbackId = ytId || vmId || (bn ? `${bn.libraryId}_${bn.videoId}` : 'unknown')
  return { provider: fallbackProvider, videoId: fallbackId }
}

/**
 * Loads text content from a file path, URL, or raw string.
 */
async function loadSourceContent(source?: string): Promise<string | null> {
  if (!source) return null
  const trimmed = source.trim()

  // Remote URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const res = await fetch(trimmed, { signal: AbortSignal.timeout(6000) })
      return res.ok ? await res.text() : null
    } catch {
      return null
    }
  }

  // Local file path
  try {
    const resolvedPath = path.isAbsolute(trimmed)
      ? trimmed
      : path.resolve(process.cwd(), trimmed)
    if (fs.existsSync(resolvedPath)) {
      return fs.readFileSync(resolvedPath, 'utf8')
    }
  } catch {
    // Not a file, treat as inline content
  }

  // Treat as inline raw content
  return trimmed
}

/**
 * Core Ingestion Pipeline: builds a complete Sanity video document
 * with timestamped transcript chunks and chapter markers.
 */
export async function processVideoIngestion(
  params: ProcessVideoParams
): Promise<SanityVideoDocument> {
  const { url, preferredProvider, transcriptSource, chaptersSource, lessonContext, chunkingOptions } = {
    ...params,
    preferredProvider: params.provider,
  }

  if (!url) {
    throw new Error('Video URL is required for ingestion')
  }

  const { provider, videoId } = resolveProviderAndId(url, preferredProvider)
  const docId = deriveVideoDocumentId(url, provider, videoId)

  // 1. Ingest Transcript & Create Chunks
  let chunks: TranscriptChunk[] = []
  const rawTranscript = await loadSourceContent(transcriptSource)

  if (rawTranscript) {
    const cues = parseSubtitles(rawTranscript)
    if (cues.length > 0) {
      chunks = chunkSubtitleCues(cues, chunkingOptions)
    }
  }

  // If no chunks yet and provider is YouTube, attempt public captions
  if (chunks.length === 0 && provider === 'youtube' && videoId) {
    const ytCues = await fetchYouTubeCaptions(videoId)
    if (ytCues && ytCues.length > 0) {
      chunks = chunkSubtitleCues(ytCues, chunkingOptions)
    }
  }

  // Fallback: If no captions were extracted, use lesson notes or structured points
  if (chunks.length === 0) {
    const totalSecs = lessonContext?.durationSeconds || 300
    const textBlocks: string[] = []

    if (lessonContext?.notesText && lessonContext.notesText.length > 0) {
      textBlocks.push(...lessonContext.notesText)
    } else if (lessonContext?.keyPoints && lessonContext.keyPoints.length > 0) {
      lessonContext.keyPoints.forEach((kp) => {
        textBlocks.push(
          `In this segment on ${lessonContext.title || 'this lesson'}, we explore ${kp}.`
        )
      })
    } else {
      textBlocks.push(
        `Introduction and foundational concepts for ${lessonContext?.title || videoId}.`,
        `Hands-on implementation and core architectural patterns.`,
        `Key takeaways, edge cases, and best practices.`
      )
    }

    chunks = chunkTextWithDuration(textBlocks, totalSecs)
  }

  // 2. Ingest Chapters (Table of Contents)
  let chapters: ChapterMarker[] = []
  const rawChapters = await loadSourceContent(chaptersSource)

  if (rawChapters) {
    if (rawChapters.startsWith('WEBVTT') || rawChapters.includes('-->')) {
      chapters = parseWebVTTChapters(rawChapters)
    } else {
      chapters = parseChaptersFromText(rawChapters)
    }
  }

  // If no chapters yet and provider is YouTube, attempt description chapters
  if (chapters.length === 0 && provider === 'youtube' && videoId) {
    chapters = await fetchYouTubeDescriptionChapters(videoId)
  }

  // Fallback: Generate table of contents from lesson key points or title
  if (chapters.length === 0) {
    chapters = generateFallbackChapters(
      lessonContext?.title || 'Lesson Overview',
      lessonContext?.keyPoints || [],
      lessonContext?.durationSeconds || 300
    )
  }

  // Final document assembly strictly adhering to studio/schemaTypes/documents/video.ts
  const videoDocument: SanityVideoDocument = {
    _id: docId,
    _type: 'video',
    videoId,
    url,
    provider,
    chapters: chapters.map((ch, idx) => ({
      _key: ch._key || `ch_${idx}`,
      startSeconds: ch.startSeconds,
      label: ch.label,
    })),
    chunks: chunks.map((ck, idx) => ({
      _key: ck._key || `chunk_${idx}`,
      startSeconds: ck.startSeconds,
      text: ck.text,
    })),
  }

  return videoDocument
}
