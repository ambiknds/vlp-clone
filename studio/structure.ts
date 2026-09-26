import type { StructureResolver } from 'sanity/structure'
import {
  MasterDetailIcon,
  DocumentVideoIcon,
  UserIcon,
  TagIcon,
  PlayIcon,
  CogIcon,
  ActivityIcon,
} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Vertex Content Studio')
    .items([
      S.listItem()
        .title('Courses')
        .icon(MasterDetailIcon)
        .schemaType('course')
        .child(S.documentTypeList('course').title('Course Catalog')),

      S.listItem()
        .title('Lessons')
        .icon(DocumentVideoIcon)
        .schemaType('lesson')
        .child(S.documentTypeList('lesson').title('Course Lessons')),

      S.listItem()
        .title('Instructors')
        .icon(UserIcon)
        .schemaType('instructor')
        .child(S.documentTypeList('instructor').title('Instructors')),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),

      S.divider(),

      S.listItem()
        .title('Video Intelligence')
        .icon(PlayIcon)
        .schemaType('video')
        .child(
          S.documentTypeList('video')
            .title('Video Documents (Chapters & Chunks)')
        ),

      S.listItem()
        .title('Agent Search Config')
        .icon(CogIcon)
        .schemaType('agentContext')
        .child(
          S.documentTypeList('agentContext')
            .title('Sanity Context MCP Configurations')
        ),

      S.listItem()
        .title('Learner Progress')
        .icon(ActivityIcon)
        .schemaType('progressRecord')
        .child(
          S.documentTypeList('progressRecord')
            .title('Learner Progress Records (Clerk Users)')
        ),
    ])
