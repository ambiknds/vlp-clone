import type { SubtitleCue, TranscriptChunk, ChunkingOptions } from '../types'
import { generateSanityKey } from '../utils/id-helper'

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  targetDurationSeconds: 30,
  minDurationSeconds: 18,
  maxDurationSeconds: 50,
  maxWordsPerChunk: 80,
}

/**
 * Groups fine-grained subtitle cues into semantic, timestamped transcript chunks.
 *
 * Adheres strictly to AGENTS.md Section 8 & Section 9:
 * "Store the transcript as many short timestamped chunks, and store the source's chapter markers
 * as the table of contents. Keep whole transcripts out of anything the request path returns."
 */
export function chunkSubtitleCues(
  cues: SubtitleCue[],
  userOptions?: ChunkingOptions
): TranscriptChunk[] {
  if (!cues || cues.length === 0) return []

  const options = { ...DEFAULT_OPTIONS, ...userOptions }
  const chunks: TranscriptChunk[] = []

  let currentTexts: string[] = []
  let currentStartSeconds = cues[0].startSeconds
  let currentEndSeconds = cues[0].endSeconds

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i]
    currentTexts.push(cue.text)
    currentEndSeconds = cue.endSeconds

    const duration = currentEndSeconds - currentStartSeconds
    const fullText = currentTexts.join(' ').trim()
    const wordCount = fullText.split(/\s+/).length

    const isLastCue = i === cues.length - 1
    const endsWithPunctuation = /[.?!]$/.test(cue.text.trim())

    // Splitting condition:
    // 1. Reached max duration OR max words, OR
    // 2. Reached min duration AND ends with sentence punctuation, OR
    // 3. This is the last cue
    const shouldSplit =
      isLastCue ||
      duration >= options.maxDurationSeconds ||
      wordCount >= options.maxWordsPerChunk ||
      (duration >= options.minDurationSeconds && endsWithPunctuation)

    if (shouldSplit && fullText.length > 0) {
      chunks.push({
        _key: generateSanityKey('chunk', chunks.length),
        startSeconds: Math.floor(currentStartSeconds),
        text: fullText,
      })

      // Reset for next chunk
      currentTexts = []
      if (!isLastCue) {
        currentStartSeconds = cues[i + 1].startSeconds
      }
    }
  }

  return chunks
}

/**
 * Fallback chunker for authored notes or plain text transcripts without timestamps.
 * Distributes text chunks evenly across total duration.
 */
export function chunkTextWithDuration(
  textParagraphs: string[],
  totalDurationSeconds: number
): TranscriptChunk[] {
  const cleanParagraphs = textParagraphs
    .map((p) => p.trim())
    .filter((p) => p.length > 15)

  if (cleanParagraphs.length === 0) return []

  const stepSeconds = Math.max(
    10,
    Math.floor(totalDurationSeconds / (cleanParagraphs.length + 1))
  )

  return cleanParagraphs.map((txt, idx) => ({
    _key: generateSanityKey('chunk', idx),
    startSeconds: Math.min(totalDurationSeconds - 5, Math.max(0, (idx + 1) * stepSeconds)),
    text: txt,
  }))
}
