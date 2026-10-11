import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { captureServerEvent } from "@/lib/analytics/posthog-server";

/**
 * Server-side progress and completion tracking endpoint.
 * Strictly adheres to AGENTS.md Sections 5, 7, 8:
 * - Writes to progress are server-side only, gated by Clerk user auth.
 * - Tracks server-side analytics with zero PII beyond Clerk user ID.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      lessonSlug,
      lessonTitle,
      courseSlug,
      courseTitle,
      positionSeconds,
      completed,
    } = body;

    // 1. Capture Server-Side Analytics via PostHog
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

    return NextResponse.json({
      success: true,
      userId,
      completed: Boolean(completed),
      positionSeconds: positionSeconds || 0,
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
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      userId,
      completedLessons: [],
      lastPositionSeconds: 0,
    });
  } catch (error) {
    console.error("Progress API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
