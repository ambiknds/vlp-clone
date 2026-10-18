import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { captureServerEvent } from "@/lib/analytics/posthog-server";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * Server-side progress and completion tracking endpoint.
 * Strictly adheres to AGENTS.md Sections 5, 7, 8, 12:
 * - Writes to progress are server-side only, gated by Clerk user auth.
 * - Progress records in Sanity are keyed by Clerk userId.
 * - Tracks server-side analytics with zero PII beyond Clerk user ID.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    const body = await request.json().catch(() => ({}));
    const {
      lessonSlug,
      lessonTitle,
      courseSlug,
      courseTitle,
      positionSeconds,
      completed,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required", unauthenticated: true },
        { status: 401 }
      );
    }

    if (!lessonSlug) {
      return NextResponse.json(
        { error: "lessonSlug is required" },
        { status: 400 }
      );
    }

    // 1. Resolve lesson document in Sanity by slug
    const lessonDoc = await writeClient.fetch(
      `*[_type == "lesson" && slug.current == $lessonSlug][0]{ _id }`,
      { lessonSlug }
    );

    // Document ID sanitized for Sanity conventions
    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docId = `progress-${safeUserId}`;

    // 2. Ensure progressRecord document exists for this user
    await writeClient.createIfNotExists({
      _id: docId,
      _type: "progressRecord",
      userId,
      completedLessons: [],
      lastPositionSeconds: 0,
      updatedAt: new Date().toISOString(),
    });

    if (lessonDoc?._id) {
      if (completed === true) {
        // Add to completedLessons if not already present
        const currentRecord = await writeClient.fetch(
          `*[_id == $docId][0]{ "completedIds": completedLessons[]._ref }`,
          { docId }
        );
        const completedIds = new Set(currentRecord?.completedIds || []);

        if (!completedIds.has(lessonDoc._id)) {
          const key = `ref-${lessonDoc._id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
          await writeClient
            .patch(docId)
            .setIfMissing({ completedLessons: [] })
            .insert("after", "completedLessons[-1]", [
              {
                _type: "reference",
                _ref: lessonDoc._id,
                _key: key,
              },
            ])
            .set({
              lastLesson: { _type: "reference", _ref: lessonDoc._id },
              updatedAt: new Date().toISOString(),
              ...(typeof positionSeconds === "number" && positionSeconds > 0
                ? { lastPositionSeconds: positionSeconds }
                : {}),
            })
            .commit();
        }
      } else if (completed === false) {
        // Remove from completedLessons
        const currentRecord = await writeClient.fetch(
          `*[_id == $docId][0]{ completedLessons }`,
          { docId }
        );
        const filtered = (currentRecord?.completedLessons || []).filter(
          (ref: { _ref?: string }) => ref._ref !== lessonDoc._id
        );
        await writeClient
          .patch(docId)
          .set({
            completedLessons: filtered,
            updatedAt: new Date().toISOString(),
          })
          .commit();
      } else if (typeof positionSeconds === "number" && positionSeconds > 0) {
        // Only update last watched position
        await writeClient
          .patch(docId)
          .set({
            lastLesson: { _type: "reference", _ref: lessonDoc._id },
            lastPositionSeconds: positionSeconds,
            updatedAt: new Date().toISOString(),
          })
          .commit();
      }
    }

    // 3. Capture Server-Side Analytics via PostHog
    if (completed) {
      await captureServerEvent(userId, "lesson_completed", {
        lesson_slug: lessonSlug,
        lesson_title: lessonTitle,
        course_slug: courseSlug,
        course_title: courseTitle,
        completion_trigger: "server_api",
      });
    }

    if (typeof positionSeconds === "number" && positionSeconds > 0) {
      await captureServerEvent(userId, "lesson_progress_saved", {
        lesson_slug: lessonSlug,
        course_slug: courseSlug,
        position_seconds: positionSeconds,
      });
    }

    // 4. Fetch updated completed lesson slugs
    const updatedRecord = await writeClient.fetch(
      `*[_id == $docId][0]{ "completedLessonSlugs": completedLessons[]->slug.current }`,
      { docId }
    );

    return NextResponse.json({
      success: true,
      userId,
      completed: Boolean(completed),
      completedLessonSlugs: updatedRecord?.completedLessonSlugs || [],
    });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Failed to record progress" },
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
        completedLessonSlugs: [],
        lastLessonSlug: null,
        lastPositionSeconds: 0,
      });
    }

    const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docId = `progress-${safeUserId}`;

    const record = await writeClient.fetch(
      `*[_id == $docId][0]{
        userId,
        "completedLessonSlugs": completedLessons[]->slug.current,
        "lastLessonSlug": lastLesson->slug.current,
        lastPositionSeconds
      }`,
      { docId }
    );

    return NextResponse.json({
      userId,
      completedLessonSlugs: record?.completedLessonSlugs || [],
      lastLessonSlug: record?.lastLessonSlug || null,
      lastPositionSeconds: record?.lastPositionSeconds || 0,
    });
  } catch (error) {
    console.error("Progress API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
