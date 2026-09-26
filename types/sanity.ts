import type { PortableTextBlock } from '@portabletext/react'

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImageReference {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: SanitySlug
  description?: string
  courseCount?: number
}

export interface Instructor {
  _id: string
  _type: 'instructor'
  name: string
  slug: SanitySlug
  photo?: SanityImageReference
  expertise: string
  bio?: string
}

export interface LearningOutcome {
  _key: string
  title: string
  description?: string
  icon?: string
}

export type ResourceType = 'PDF' | 'Code' | 'Guide' | 'Link' | 'Video'

export interface Resource {
  _key: string
  title: string
  description?: string
  type: ResourceType
  url: string
  fileSize?: string
}

export interface LessonSummary {
  _id: string
  title: string
  slug: SanitySlug
  duration: string
  durationSeconds?: number
  freePreview?: boolean
  studentCount?: number
  videoUrl?: string
}

export interface Lesson extends LessonSummary {
  _type: 'lesson'
  thumbnail?: SanityImageReference
  keyPoints?: string[]
  proTip?: string
  notes?: PortableTextBlock[]
  resources?: Resource[]
}

export interface Module {
  _key: string
  _type: 'module'
  title: string
  summary?: string
  lessons: LessonSummary[]
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'

export interface CourseCardItem {
  _id: string
  title: string
  slug: SanitySlug
  summary: string
  coverImage?: SanityImageReference
  badgeIcon?: string
  level: CourseLevel
  duration: string
  price: number
  popular?: boolean
  studentCount?: number
  instructor: {
    _id: string
    name: string
    expertise: string
    photo?: SanityImageReference
  }
  category: {
    _id: string
    title: string
    slug: SanitySlug
  }
  moduleCount: number
  lessonCount: number
}

export interface CourseDetail extends Omit<CourseCardItem, 'moduleCount' | 'lessonCount'> {
  _type: 'course'
  learningOutcomes?: LearningOutcome[]
  modules: {
    _key: string
    title: string
    summary?: string
    lessons: LessonSummary[]
  }[]
  instructor: Instructor
  category: Category
  moduleCount: number
  lessonCount: number
}

export interface LessonWithContext extends Lesson {
  course: {
    _id: string
    title: string
    slug: SanitySlug
    instructor: {
      name: string
      expertise: string
      photo?: SanityImageReference
    }
  }
  moduleIndex: number
  moduleTitle: string
  lessonIndex: number
  lessonLabel: string
  nextLesson?: {
    title: string
    slug: SanitySlug
  }
  previousLesson?: {
    title: string
    slug: SanitySlug
  }
}

export interface VideoDocument {
  _id: string
  _type: 'video'
  videoId: string
  url: string
  provider?: 'youtube' | 'vimeo' | 'bunny'
  chapters?: {
    _key: string
    startSeconds: number
    label: string
  }[]
  chunks?: {
    _key: string
    startSeconds: number
    text: string
  }[]
}

export interface AgentContextDocument {
  _id: string
  _type: 'agentContext'
  name: string
  scopeFilter: string
  instructions: string
}
