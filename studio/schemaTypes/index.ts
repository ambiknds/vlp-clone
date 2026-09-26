import { type SchemaTypeDefinition } from 'sanity'

// Document schemas
import { courseType } from './documents/course'
import { lessonType } from './documents/lesson'
import { instructorType } from './documents/instructor'
import { categoryType } from './documents/category'
import { videoType } from './documents/video'
import { agentContextType } from './documents/agentContext'
import { progressRecordType } from './documents/progressRecord'

// Object schemas
import { moduleType } from './objects/module'
import { learningOutcomeType } from './objects/learningOutcome'
import { resourceType } from './objects/resource'
import { blockContentType } from './objects/blockContent'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    courseType,
    lessonType,
    instructorType,
    categoryType,
    videoType,
    agentContextType,
    progressRecordType,

    // Objects
    moduleType,
    learningOutcomeType,
    resourceType,
    blockContentType,
  ],
}
