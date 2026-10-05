import { defineQuery } from 'next-sanity'

/**
 * Fetches all courses with instructor, category, and derived counts for the catalog view.
 */
export const allCoursesQuery = defineQuery(`
  *[_type == "course"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    summary,
    coverImage,
    badgeIcon,
    level,
    duration,
    price,
    popular,
    studentCount,
    "instructor": instructor->{
      _id,
      name,
      expertise,
      photo
    },
    "category": category->{
      _id,
      title,
      slug
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

/**
 * Fetches featured/popular courses for home page showcase.
 */
export const featuredCoursesQuery = defineQuery(`
  *[_type == "course"] | order(popular desc, _createdAt desc)[0...6] {
    _id,
    title,
    slug,
    summary,
    coverImage,
    badgeIcon,
    level,
    duration,
    price,
    popular,
    studentCount,
    "instructor": instructor->{
      _id,
      name,
      expertise,
      photo
    },
    "category": category->{
      _id,
      title,
      slug
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

/**
 * Fetches single course detail by slug, including full instructor, category,
 * learning outcomes, and modules with resolved lessons.
 */
export const courseBySlugQuery = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    summary,
    coverImage,
    badgeIcon,
    level,
    duration,
    price,
    popular,
    studentCount,
    "instructor": instructor->{
      _id,
      _type,
      name,
      slug,
      photo,
      expertise,
      bio
    },
    "category": category->{
      _id,
      _type,
      title,
      slug,
      description
    },
    learningOutcomes[]{
      _key,
      title,
      description,
      icon
    },
    modules[]{
      _key,
      _type,
      title,
      summary,
      lessons[]->{
        _id,
        title,
        slug,
        duration,
        durationSeconds,
        freePreview,
        studentCount,
        videoUrl
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)

/**
 * Fetches lesson by slug, deriving parent course, module info, and sidebar navigation via reverse reference.
 */
export const lessonBySlugQuery = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    videoUrl,
    thumbnail,
    duration,
    durationSeconds,
    freePreview,
    studentCount,
    keyPoints,
    proTip,
    notes,
    resources[]{
      _key,
      title,
      description,
      type,
      url,
      fileSize
    },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      slug,
      level,
      badgeIcon,
      "instructor": instructor->{
        name,
        expertise,
        photo
      },
      modules[]{
        _key,
        title,
        summary,
        lessons[]->{
          _id,
          title,
          slug,
          duration,
          durationSeconds,
          freePreview
        }
      }
    }
  }
`)

/**
 * Fetches all instructors.
 */
export const allInstructorsQuery = defineQuery(`
  *[_type == "instructor"] | order(name asc) {
    _id,
    _type,
    name,
    slug,
    photo,
    expertise,
    bio
  }
`)

/**
 * Fetches instructor by slug with all their authored courses.
 */
export const instructorBySlugQuery = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(_createdAt desc) {
      _id,
      title,
      slug,
      summary,
      coverImage,
      badgeIcon,
      level,
      duration,
      price,
      popular,
      studentCount,
      "category": category->{
        title,
        slug
      },
      "moduleCount": count(modules),
      "lessonCount": count(modules[].lessons[])
    }
  }
`)

/**
 * Fetches all categories with active course counts.
 */
export const allCategoriesQuery = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    _type,
    title,
    slug,
    description,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

/**
 * Fetches the showcase courses for the homepage grid.
 */
export const homepageCoursesQuery = defineQuery(`
  *[_type == "course" && slug.current in [
    "nextjs-app-router-in-depth",
    "nextjs-for-production",
    "devops-with-docker-and-kubernetes",
    "typescript-for-application-developers"
  ]] {
    _id,
    title,
    slug,
    summary,
    coverImage,
    badgeIcon,
    level,
    duration,
    price,
    popular,
    studentCount,
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[])
  }
`)
