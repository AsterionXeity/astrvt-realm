"use client";

import { useEffect, useState } from "react";
import { Column, Row, Text, Button, IconButton, Avatar } from "@once-ui-system/core";
import { home, person } from "@/resources";

interface FeaturedBadgeProps {
  latestVideoId: string | null;
}

export const FeaturedBadge = ({ latestVideoId }: FeaturedBadgeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // 1. Check if it's the first time visiting the site
    const hasVisitedBefore = localStorage.getItem("visited_portfolio");

    if (!hasVisitedBefore) {
      // Delay showing the notification slightly for better UX (1.2s after load)
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem("visited_portfolio", "true");
      }, 1200);
      return () => clearTimeout(timer);
    } else if (latestVideoId) {
      // Subsequent load: show only if there is a new video ID
      const lastSeenId = localStorage.getItem("last_seen_video_id");
      if (lastSeenId !== latestVideoId) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [latestVideoId]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    // Wait for the exit animation (400ms) before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      if (latestVideoId) {
        localStorage.setItem("last_seen_video_id", latestVideoId);
      }
    }, 400);
  };

  const handleView = () => {
    if (latestVideoId) {
      localStorage.setItem("last_seen_video_id", latestVideoId);
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 400);
  };

  if (!isVisible || !home.featured.display) return null;

  return (
    <div className={`notification-container ${isClosing ? "closing" : ""}`}>
      <Column className="notification-card" padding="16" gap="12" fillWidth>
        <Row vertical="center" gap="12" fillWidth>
          <Avatar src={person.avatar} size="m" />
          <Column gap="2" flex={1}>
            <Text weight="strong" variant="body-default-m" onBackground="neutral-strong">
              New Content Alert!
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Check out my latest updates.
            </Text>
          </Column>
          <IconButton
            icon="close"
            size="s"
            variant="ghost"
            onClick={handleClose}
            aria-label="Dismiss notification"
          />
        </Row>
        <Row fillWidth horizontal="end" gap="8">
          <Button
            href={home.featured.href}
            onClick={handleView}
            label="View Content"
            size="s"
            variant="primary"
          />
        </Row>
      </Column>
    </div>
  );
};
