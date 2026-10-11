import fs from 'node:fs'
import path from 'node:path'
import type { SanityVideoDocument } from './types'

export interface LessonForIngestion {
  _id: string
  title: string
  slug: { current: string }
  videoUrl: string
  durationSeconds?: number
  keyPoints?: string[]
  notesText?: string[]
}

export interface SanityConfig {
  projectId: string
  dataset: string
  token: string
}

/**
 * Loads Sanity credentials from process.env or .env.local
 */
export function getSanityConfig(): SanityConfig {
  let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  let dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  let token =
    process.env.SANITY_API_DEVELOPER_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_READ_TOKEN

  if (!projectId || !token) {
    const envPaths = [
      path.resolve(process.cwd(), '.env.local'),
      path.resolve(process.cwd(), '../.env.local'),
      path.resolve(process.cwd(), 'studio/.env.local'),
    ]

    const parsedEnv: Record<string, string> = {}
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8')
        for (const line of content.split(/\r?\n/)) {
          const idx = line.indexOf('=')
          if (idx !== -1) {
            const key = line.slice(0, idx).trim()
            const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
            parsedEnv[key] = val
          }
        }
      }
    }

    if (!projectId && parsedEnv.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      projectId = parsedEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
    }
    if (parsedEnv.NEXT_PUBLIC_SANITY_DATASET) {
      dataset = parsedEnv.NEXT_PUBLIC_SANITY_DATASET
    }
    token =
      parsedEnv.SANITY_API_DEVELOPER_TOKEN ||
      parsedEnv.SANITY_API_WRITE_TOKEN ||
      parsedEnv.SANITY_API_READ_TOKEN
  }

  if (!projectId) {
    projectId = 'zq8k8g90'
  }
  if (!token) {
    throw new Error(
      'Missing Sanity write token (SANITY_API_DEVELOPER_TOKEN or SANITY_API_WRITE_TOKEN) in environment'
    )
  }

  return { projectId, dataset, token }
}

/**
 * Queries all lessons from Sanity to scan video URLs and metadata.
 */
export async function fetchLessonsForIngestion(): Promise<LessonForIngestion[]> {
  const { projectId, dataset, token } = getSanityConfig()
  const query = encodeURIComponent(`
    *[_type == "lesson" && defined(videoUrl)] {
      _id,
      title,
      slug,
      videoUrl,
      durationSeconds,
      keyPoints,
      "notesText": pt::text(notes)
    }
  `)

  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch lessons from Sanity: HTTP ${res.status} ${await res.text()}`)
  }

  const json = await res.json()
  const rawLessons = json.result || []

  return rawLessons.map(
    (les: {
      _id: string
      title?: string
      slug?: { current: string }
      videoUrl: string
      durationSeconds?: number
      keyPoints?: string[]
      notesText?: string
    }) => ({
      _id: les._id,
      title: les.title || 'Untitled Lesson',
      slug: les.slug || { current: les._id },
      videoUrl: les.videoUrl,
      durationSeconds: les.durationSeconds || 300,
      keyPoints: Array.isArray(les.keyPoints) ? les.keyPoints : [],
      notesText: les.notesText ? [les.notesText] : [],
    })
  )
}

/**
 * Commits an array of video documents to Sanity via batch mutations.
 */
export async function commitVideoBatch(
  documents: SanityVideoDocument[],
  batchSize = 25
): Promise<{ success: number; failed: number }> {
  if (documents.length === 0) return { success: 0, failed: 0 }

  const { projectId, dataset, token } = getSanityConfig()
  const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`

  let success = 0
  let failed = 0

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize)
    const mutations = batch.map((doc) => ({
      createOrReplace: doc,
    }))

    try {
      const res = await fetch(mutateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mutations }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        console.error(`Mutation batch failed:`, data.error || res.statusText)
        failed += batch.length
      } else {
        success += batch.length
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`Network error committing batch:`, message)
      failed += batch.length
    }
  }

  return { success, failed }
}
