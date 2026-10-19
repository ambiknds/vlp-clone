import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { captureServerEvent } from "@/lib/analytics/posthog-server";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * Server-side course enrollment endpoint.
 * Strictly adheres to AGENTS.md Sections 5, 7, 8, 12:
 * - Writes to enrollment/progress are server-side only, gated by Clerk user auth.
 * - Progress records in Sanity are keyed by Clerk userId.
 * - Tracks server-side analytics with zero PII beyond Clerk user ID.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    const body = await request.json().catch(() => ({}));
    const { courseSlug, courseTitle } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required", unauthenticated: true },
        { status: 401 }
      );
    }

    if (!courseSlug) {
      return NextResponse.json(
        { error: "courseSlug is required" },
        { status: 400 }
      );
    }

    // Resolve course document in Sanity by slug, accounting for Next.js production alias
    const isNext =
      courseSlug === "nextjs-for-production" ||
      courseSlug === "nextjs-app-router-in-depth";

    const courseDoc = await writeClient.fetch(
      isNext
        ? `*[_type == "course" && (slug.current == $courseSlug || slug.current == "nextjs-app-router-in-depth" || slug.current == "nextjs-for-production")][0]{ _id, title, "slug": slug.current }`
        : `*[_type == "course" && slug.current == $courseSlug][0]{ _id, title, "slug": slug.current }`,
      { courseSlug }
    );

    // Document ID sanitized for Sanity conventions
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docId = `progress-${safeUserId}`;

    // Ensure progressRecord document exists for this user
    await writeClient.createIfNotExists({
      _id: docId,
      _type: "progressRecord",
      userId,
      completedLessons: [],
      enrolledCourses: [],
      lastPositionSeconds: 0,
      updatedAt: new Date().toISOString(),
    });

    if (courseDoc?._id) {
      const currentRecord = await writeClient.fetch(
        `*[_id == $docId][0]{ "enrolledIds": enrolledCourses[]._ref }`,
        { docId }
      );
      const enrolledIds = new Set(currentRecord?.enrolledIds || []);

      if (!enrolledIds.has(courseDoc._id)) {
        const key = `ref-${courseDoc._id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
        await writeClient
          .patch(docId)
          .setIfMissing({ enrolledCourses: [] })
          .insert("after", "enrolledCourses[-1]", [
            {
              _type: "reference",
              _ref: courseDoc._id,
              _key: key,
            },
          ])
          .set({
            updatedAt: new Date().toISOString(),
          })
          .commit();
      }
    }

    // Capture Server-Side Analytics via PostHog
    await captureServerEvent(userId, "course_enrolled", {
      course_slug: courseSlug,
      course_title: courseDoc?.title || courseTitle || courseSlug,
      enrollment_trigger: "server_api",
    });

    // Fetch updated enrolled course slugs
    const updatedRecord = await writeClient.fetch(
      `*[_id == $docId][0]{ "enrolledCourseSlugs": enrolledCourses[]->slug.current }`,
      { docId }
    );

    const enrolledSlugs = updatedRecord?.enrolledCourseSlugs || [];
    // If Next.js alias, ensure both are included in response for seamless client lookup
    if (isNext && !enrolledSlugs.includes("nextjs-for-production")) {
      enrolledSlugs.push("nextjs-for-production");
    }

    return NextResponse.json({
      success: true,
      userId,
      courseSlug,
      enrolledCourseSlugs: enrolledSlugs,
    });
  } catch (error) {
    console.error("Enroll API error:", error);
    return NextResponse.json(
      { error: "Failed to record enrollment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        userId: null,
        enrolledCourseSlugs: [],
      });
    }

    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docId = `progress-${safeUserId}`;

    const record = await writeClient.fetch(
      `*[_id == $docId][0]{
        userId,
        "enrolledCourseSlugs": enrolledCourses[]->slug.current
      }`,
      { docId }
    );

    return NextResponse.json({
      userId,
      enrolledCourseSlugs: record?.enrolledCourseSlugs || [],
    });
  } catch (error) {
    console.error("Enroll API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
