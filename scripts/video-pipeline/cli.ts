#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import type { VideoProvider, SanityVideoDocument } from './types'
import { processVideoIngestion } from './pipeline'
import { fetchLessonsForIngestion, commitVideoBatch } from './sanity-client'

interface ParsedArgs {
  url?: string
  provider?: VideoProvider
  transcript?: string
  chapters?: string
  scanLessons?: boolean
  commit?: boolean
  dryRun?: boolean
  output?: string
  limit?: number
  concurrency?: number
}

function parseCliArgs(): ParsedArgs {
  const args = process.argv.slice(2)
  const result: ParsedArgs = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--url' && args[i + 1]) {
      result.url = args[++i]
    } else if (arg === '--provider' && args[i + 1]) {
      result.provider = args[++i] as VideoProvider
    } else if (arg === '--transcript' && args[i + 1]) {
      result.transcript = args[++i]
    } else if (arg === '--chapters' && args[i + 1]) {
      result.chapters = args[++i]
    } else if (arg === '--output' && args[i + 1]) {
      result.output = args[++i]
    } else if (arg === '--limit' && args[i + 1]) {
      result.limit = parseInt(args[++i], 10)
    } else if (arg === '--concurrency' && args[i + 1]) {
      result.concurrency = parseInt(args[++i], 10)
    } else if (arg === '--scan-lessons') {
      result.scanLessons = true
    } else if (arg === '--commit') {
      result.commit = true
    } else if (arg === '--dry-run') {
      result.dryRun = true
    } else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  // If neither --commit nor --dry-run is specified, default to dry-run for safety
  if (!result.commit && !result.dryRun) {
    result.dryRun = true
  }

  return result
}

function printHelp() {
  console.log(`
Vertex Video Ingestion Pipeline (Offline Tooling)
Usage:
  npx tsx scripts/video-pipeline/cli.ts [options]

Options:
  --url <url>            Ingest a single video by URL (YouTube, Vimeo, Bunny)
  --provider <name>      Override provider ('youtube', 'vimeo', 'bunny')
  --transcript <path>    Path to WebVTT, SRT, or JSON transcript file
  --chapters <path>      Path to chapters file (.vtt or timestamped text)
  --scan-lessons         Scan all lessons from Sanity and ingest their videos
  --commit               Commit mutations directly to Sanity dataset
  --dry-run              Run parsing and validation without writing to Sanity (default)
  --output <file>        Save generated video documents to a local JSON file
  --help, -h             Show this help screen
`)
}

async function main() {
  console.log('\n=============================================================')
  console.log('       VERTEX LMS - OFFLINE VIDEO INGESTION PIPELINE         ')
  console.log('=============================================================\n')

  const args = parseCliArgs()
  const documents: SanityVideoDocument[] = []

  if (args.url) {
    console.log(`Processing single video: ${args.url}`)
    const doc = await processVideoIngestion({
      url: args.url,
      provider: args.provider,
      transcriptSource: args.transcript,
      chaptersSource: args.chapters,
    })

    documents.push(doc)
    console.log(`\nIngestion Summary for [${doc.videoId}]:`)
    console.log(`  Document ID : ${doc._id}`)
    console.log(`  Provider    : ${doc.provider}`)
    console.log(`  Chapters    : ${doc.chapters.length}`)
    doc.chapters.slice(0, 4).forEach((c) => {
      const min = Math.floor(c.startSeconds / 60)
      const sec = c.startSeconds % 60
      console.log(`    - ${min}:${sec.toString().padStart(2, '0')} : ${c.label}`)
    })
    console.log(`  Chunks      : ${doc.chunks.length}`)
    doc.chunks.slice(0, 2).forEach((ck) => {
      console.log(`    - @${ck.startSeconds}s : "${ck.text.slice(0, 80)}..."`)
    })
  } else if (args.scanLessons) {
    console.log('Scanning Sanity dataset for all published lessons...')
    const lessons = await fetchLessonsForIngestion()
    console.log(`Found ${lessons.length} lessons with video URLs.\n`)

    // Group lessons by unique video URL to avoid duplicate work
    const uniqueVideos = new Map<string, typeof lessons[0]>()
    for (const les of lessons) {
      if (les.videoUrl && !uniqueVideos.has(les.videoUrl)) {
        uniqueVideos.set(les.videoUrl, les)
      }
    }

    let videoList = Array.from(uniqueVideos.entries())
    if (args.limit && args.limit > 0) {
      videoList = videoList.slice(0, args.limit)
      console.log(`Limited to first ${videoList.length} videos.`)
    }

    console.log(`Processing ${videoList.length} unique video sources...`)
    const concurrency = Math.min(args.concurrency || 8, 16)
    let completedCount = 0

    // Process with bounded concurrency
    const queue = [...videoList]
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (queue.length > 0) {
        const item = queue.shift()
        if (!item) break
        const [videoUrl, lesson] = item

        try {
          const doc = await processVideoIngestion({
            url: videoUrl,
            lessonContext: {
              title: lesson.title,
              keyPoints: lesson.keyPoints,
              durationSeconds: lesson.durationSeconds,
              notesText: lesson.notesText,
            },
          })
          documents.push(doc)
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          console.warn(`  Warning: failed to process video [${videoUrl}]:`, message)
        }

        completedCount++
        if (completedCount % 10 === 0 || completedCount === videoList.length) {
          console.log(`  Processed ${completedCount}/${videoList.length} videos...`)
        }
      }
    })

    await Promise.all(workers)
  } else {
    console.error('Please specify either --url <videoUrl> or --scan-lessons')
    printHelp()
    process.exit(1)
  }

  // Save to file if --output specified
  if (args.output) {
    const outPath = path.isAbsolute(args.output)
      ? args.output
      : path.resolve(process.cwd(), args.output)
    fs.writeFileSync(outPath, JSON.stringify(documents, null, 2), 'utf8')
    console.log(`\nSaved ${documents.length} video documents to: ${outPath}`)
  }

  // Commit to Sanity if --commit specified
  if (args.commit) {
    console.log(`\nCommitting ${documents.length} video documents to Sanity...`)
    const result = await commitVideoBatch(documents)
    console.log(`Commit result: ${result.success} succeeded, ${result.failed} failed.`)
  } else {
    console.log(`\n[DRY RUN COMPLETE] ${documents.length} video documents validated. No mutations committed.`)
    console.log(`To commit to Sanity, pass the --commit flag.`)
  }

  console.log('\n=============================================================\n')
}

main().catch((err) => {
  console.error('\nPipeline execution failed:', err)
  process.exit(1)
})
