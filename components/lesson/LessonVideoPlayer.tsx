"use client";

import React, { useMemo } from "react";

interface LessonVideoPlayerProps {
  videoUrl: string;
  startSeconds?: number;
  title?: string;
  thumbnailUrl?: string;
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
  const bunnyMatch = url.match(/(?:iframe\.mediadelivery\.net\/embed\/|video\.bunnycdn\.com\/play\/)([\w-]+)\/([\w-]+)/);
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
}: LessonVideoPlayerProps) {
  const embedUrl = useMemo(
    () => resolveEmbedUrl(videoUrl, startSeconds),
    [videoUrl, startSeconds]
  );

  return (
    <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-black shadow-lg border border-[#E2E8F0]/80">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
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
