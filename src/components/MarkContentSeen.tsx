"use client";

import { useEffect } from "react";

interface MarkContentSeenProps {
  latestVideoId: string | null;
}

export const MarkContentSeen = ({ latestVideoId }: MarkContentSeenProps) => {
  useEffect(() => {
    if (latestVideoId) {
      localStorage.setItem("last_seen_video_id", latestVideoId);
      localStorage.setItem("visited_portfolio", "true");
    }
  }, [latestVideoId]);

  return null;
};
