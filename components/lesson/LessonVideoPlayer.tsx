"use client";

import React, { useMemo, useEffect, useRef, useCallback } from "react";
import {
  trackVideoPlayed,
  trackVideoWatchDepth,
  trackResumeUsed,
} from "@/lib/analytics/events";
import { useLearnerProgress } from "@/components/providers/LearnerProgressProvider";

interface LessonVideoPlayerProps {
  videoUrl: string;
  startSeconds?: number;
  title?: string;
  thumbnailUrl?: string;
  lessonSlug?: string;
  courseTitle?: string;
  courseSlug?: string;
  durationSeconds?: number;
}

type VideoProvider = "youtube" | "vimeo" | "bunny" | "other";

function detectProvider(url: string): VideoProvider {
  if (!url) return "other";
  if (url.includes("youtube") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo")) return "vimeo";
  if (url.includes("bunnycdn") || url.includes("mediadelivery.net")) return "bunny";
  return "other";
}

/**
 * Parses video provider and returns responsive embed URL with timestamp support.
 * Strictly adheres to AGENTS.md Section 7:
 * "Playback stays on the site through a provider embed. Videos are YouTube, Vimeo, or Bunny embeds shown
 * on the lesson page with the provider's own player. Do not build a custom player. A result links to the
 * lesson page with a start seconds query param, and the embed starts at that second using the provider's
 * own start parameter. Never send the learner out to the provider."
 */
function resolveEmbedUrl(url: string, startSeconds?: number): string | null {
  if (!url) return null;

  const start = startSeconds && startSeconds > 0 ? Math.floor(startSeconds) : 0;

  // 1. YouTube
  const youtubeMatch =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/) ||
    url.match(/[?&]v=([\w-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&start=${start}&enablejsapi=1&rel=0`;
  }

  // 2. Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    const timeParam = start > 0 ? `#t=${start}s` : "";
    return `https://player.vimeo.com/video/${videoId}${timeParam}`;
  }

  // 3. Bunny Stream
  const bunnyMatch = url.match(
    /(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/
  );
  if (bunnyMatch && bunnyMatch[1] && bunnyMatch[2]) {
    const libraryId = bunnyMatch[1];
    const videoId = bunnyMatch[2];
    const timeParam = start > 0 ? `&t=${start}` : "";
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false${timeParam}`;
  }

  // If already an embed URL, append start parameter if applicable
  if (url.includes("embed") || url.includes("player")) {
    const separator = url.includes("?") ? "&" : "?";
    return start > 0 ? `${url}${separator}start=${start}&t=${start}` : url;
  }

  return url;
}

export function LessonVideoPlayer({
  videoUrl,
  startSeconds = 0,
  title = "Lesson video player",
  lessonSlug = "",
  courseTitle = "",
  courseSlug = "",
  durationSeconds,
}: LessonVideoPlayerProps) {
  const { markLessonCompleted } = useLearnerProgress();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const provider = useMemo(() => detectProvider(videoUrl), [videoUrl]);
  const embedUrl = useMemo(
    () => resolveEmbedUrl(videoUrl, startSeconds),
    [videoUrl, startSeconds]
  );

  const hasFiredPlayRef = useRef(false);
  const hasFiredResumeRef = useRef(false);
  const milestonesFiredRef = useRef<Set<number>>(new Set());

  // Reset tracking state if lessonSlug or video changes
  useEffect(() => {
    hasFiredPlayRef.current = false;
    hasFiredResumeRef.current = false;
    milestonesFiredRef.current.clear();
  }, [lessonSlug, videoUrl]);

  const handlePlayDetected = useCallback(
    (totalSec?: number) => {
      if (!hasFiredPlayRef.current) {
        hasFiredPlayRef.current = true;
        trackVideoPlayed({
          lesson_slug: lessonSlug,
          lesson_title: title,
          course_title: courseTitle,
          video_url: videoUrl,
          provider,
          start_seconds: startSeconds,
          duration_seconds: totalSec || durationSeconds,
          resume_used: startSeconds > 0,
        });

        if (startSeconds > 0 && !hasFiredResumeRef.current) {
          hasFiredResumeRef.current = true;
          trackResumeUsed({
            lesson_slug: lessonSlug,
            lesson_title: title,
            course_title: courseTitle,
            start_seconds: startSeconds,
            source: "video_timestamp_seek",
          });
        }
      }
    },
    [lessonSlug, title, courseTitle, videoUrl, provider, startSeconds, durationSeconds]
  );

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!duration || duration <= 0) return;
      const percent = Math.min(100, Math.floor((currentTime / duration) * 100));

      const milestones: (25 | 50 | 75 | 90 | 100)[] = [25, 50, 75, 90, 100];
      for (const m of milestones) {
        if (percent >= m && !milestonesFiredRef.current.has(m)) {
          milestonesFiredRef.current.add(m);
          trackVideoWatchDepth({
            lesson_slug: lessonSlug,
            lesson_title: title,
            course_title: courseTitle,
            video_url: videoUrl,
            provider,
            watch_depth: `${m}%`,
            depth_percentage: m,
            current_seconds: Math.floor(currentTime),
            duration_seconds: Math.floor(duration),
          });

          if (m === 100) {
            if (lessonSlug) {
              markLessonCompleted({
                lessonSlug,
                courseSlug,
                lessonTitle: title,
                courseTitle,
                completionTrigger: "video_ended",
              });
            }
          }
        }
      }
    },
    [lessonSlug, title, courseTitle, courseSlug, videoUrl, provider, markLessonCompleted]
  );

  // Listen to postMessage from YouTube and Vimeo embeds
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }

        if (!data) return;

        // 1. YouTube Message format
        if (data.event === "onStateChange" || typeof data.info === "number") {
          const playerState =
            typeof data.info === "number" ? data.info : data.data;
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
          if (playerState === 1) {
            handlePlayDetected();
          } else if (playerState === 0) {
            handleProgress(100, 100);
          }
        } else if (data.event === "infoDelivery" && data.info) {
          const { currentTime, duration } = data.info;
          if (currentTime && duration) {
            handlePlayDetected(duration);
            handleProgress(currentTime, duration);
          }
        }

        // 2. Vimeo Message format
        if (data.event === "play") {
          handlePlayDetected();
        } else if (data.event === "timeupdate" && data.data) {
          const { seconds, duration } = data.data;
          handlePlayDetected(duration);
          handleProgress(seconds, duration);
        } else if (data.event === "ended") {
          handleProgress(100, 100);
        }
      } catch {
        // Silently ignore cross-origin or non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handlePlayDetected, handleProgress]);

  // Hook up iframe postMessage handshake when iframe loads
  const handleIframeLoad = () => {
    try {
      if (provider === "youtube") {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "listening" }),
          "*"
        );
      } else if (provider === "vimeo") {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: "addEventListener", value: "play" }),
          "*"
        );
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: "addEventListener", value: "timeupdate" }),
          "*"
        );
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: "addEventListener", value: "ended" }),
          "*"
        );
      }
    } catch {
      // Safe noop
    }
  };

  return (
    <div
      onClick={() => handlePlayDetected()}
      className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-black shadow-lg border border-[#E2E8F0]/80 group"
    >
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          onLoad={handleIframeLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A] text-[#94A3B8] text-[15px] font-sans">
          <span>No video source available for this lesson.</span>
        </div>
      )}
    </div>
  );
}
