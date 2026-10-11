export type VideoProvider = 'youtube' | 'vimeo' | 'bunny'

export interface SubtitleCue {
  startSeconds: number
  endSeconds: number
  text: string
}

export interface TranscriptChunk {
  _key?: string
  startSeconds: number
  text: string
}

export interface ChapterMarker {
  _key?: string
  startSeconds: number
  label: string
}

export interface ParsedVideoSource {
  videoId: string
  url: string
  provider: VideoProvider
  chapters: ChapterMarker[]
  chunks: TranscriptChunk[]
  metadata?: {
    title?: string
    durationSeconds?: number
    channel?: string
  }
}

export interface SanityVideoDocument {
  _id: string
  _type: 'video'
  videoId: string
  url: string
  provider: VideoProvider
  chapters: Array<{
    _key: string
    startSeconds: number
    label: string
  }>
  chunks: Array<{
    _key: string
    startSeconds: number
    text: string
  }>
}

export interface ChunkingOptions {
  /** Target chunk duration window in seconds (default ~30s) */
  targetDurationSeconds?: number
  /** Minimum duration in seconds before considering chunk completion */
  minDurationSeconds?: number
  /** Maximum duration in seconds after which a chunk must split */
  maxDurationSeconds?: number
  /** Maximum words per chunk */
  maxWordsPerChunk?: number
}

export interface IngestOptions {
  url?: string
  provider?: VideoProvider
  transcriptPath?: string
  chaptersPath?: string
  scanLessons?: boolean
  dryRun?: boolean
  commit?: boolean
  output?: string
  replace?: boolean
}
