"use client";

import { useEffect, useState } from "react";
import { RevealFx, Badge, Row } from "@once-ui-system/core";
import { home } from "@/resources";

interface FeaturedBadgeProps {
  latestVideoId: string | null;
}

export const FeaturedBadge = ({ latestVideoId }: FeaturedBadgeProps) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // 1. Check if it's the first time visiting the site
    const hasVisitedBefore = localStorage.getItem("visited_portfolio");

    if (!hasVisitedBefore) {
      // First load: show the badge and set visited key
      setShouldShow(true);
      localStorage.setItem("visited_portfolio", "true");
    } else if (latestVideoId) {
      // Subsequent load: show only if there is a new video ID
      const lastSeenId = localStorage.getItem("last_seen_video_id");
      if (lastSeenId !== latestVideoId) {
        setShouldShow(true);
      }
    }
  }, [latestVideoId]);

  const handleBadgeClick = () => {
    if (latestVideoId) {
      localStorage.setItem("last_seen_video_id", latestVideoId);
    }
    setShouldShow(false);
  };

  if (!shouldShow || !home.featured.display) return null;

  return (
    <RevealFx
      fillWidth
      horizontal="center"
      paddingTop="16"
      paddingBottom="32"
      paddingLeft="12"
    >
      <div onClick={handleBadgeClick} style={{ cursor: "pointer", display: "inline-flex" }}>
        <Badge
          background="brand-alpha-weak"
          paddingX="12"
          paddingY="4"
          onBackground="neutral-strong"
          textVariant="label-default-s"
          arrow={false}
          href={home.featured.href}
        >
          <Row paddingY="2">{home.featured.title}</Row>
        </Badge>
      </div>
    </RevealFx>
  );
};
