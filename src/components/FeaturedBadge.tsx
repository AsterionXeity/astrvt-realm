"use client";

import { useEffect, useState } from "react";
import { Column, Row, Text, Button, IconButton, Avatar } from "@once-ui-system/core";
import { home, person } from "@/resources";
import { TwitchStatus, YouTubeLiveStatus } from "@/lib/social";

interface FeaturedBadgeProps {
  latestVideoId: string | null;
  twitchStatus: TwitchStatus;
  youtubeLiveStatus: YouTubeLiveStatus;
}

export const FeaturedBadge = ({ latestVideoId, twitchStatus, youtubeLiveStatus }: FeaturedBadgeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeNotification, setActiveNotification] = useState<'twitch' | 'youtube' | 'new_content' | null>(null);

  useEffect(() => {
    // Priority logic:
    // 1. Twitch Live
    // 2. YouTube Live
    // 3. New Content Alert
    if (twitchStatus.isLive) {
      setActiveNotification('twitch');
      setIsVisible(true);
    } else if (youtubeLiveStatus.isLive) {
      setActiveNotification('youtube');
      setIsVisible(true);
    } else {
      // 1. Check if it's the first time visiting the site in this session
      const hasVisitedBefore = sessionStorage.getItem("visited_portfolio");

      if (!hasVisitedBefore) {
        // Delay showing the notification slightly for better UX (1.2s after load)
        const timer = setTimeout(() => {
          setActiveNotification('new_content');
          setIsVisible(true);
          sessionStorage.setItem("visited_portfolio", "true");
        }, 1200);
        return () => clearTimeout(timer);
      } else if (latestVideoId) {
        // Subsequent load: show only if there is a new video ID
        const lastSeenId = localStorage.getItem("last_seen_video_id");
        if (lastSeenId !== latestVideoId) {
          const timer = setTimeout(() => {
            setActiveNotification('new_content');
            setIsVisible(true);
          }, 1200);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [latestVideoId, twitchStatus.isLive, youtubeLiveStatus.isLive]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    // Wait for the exit animation (400ms) before removing from DOM
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      if (activeNotification === 'new_content' && latestVideoId) {
        localStorage.setItem("last_seen_video_id", latestVideoId);
      }
    }, 400);
  };

  const handleView = () => {
    if (activeNotification === 'new_content' && latestVideoId) {
      localStorage.setItem("last_seen_video_id", latestVideoId);
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 400);
  };

  if (!isVisible || !home.featured.display || !activeNotification) return null;

  let titleText = "";
  let descText = "";
  let buttonLabel = "";
  let buttonHref = "";

  if (activeNotification === 'twitch') {
    titleText = "🔴 Live on Twitch";
    descText = twitchStatus.title || "AsterionVT is live now!";
    buttonLabel = "Watch Stream";
    buttonHref = "https://www.twitch.tv/asterionvt";
  } else if (activeNotification === 'youtube') {
    titleText = "🔴 Live on YouTube";
    descText = youtubeLiveStatus.title || "AsterionVT is live now!";
    buttonLabel = "Watch Stream";
    buttonHref = youtubeLiveStatus.videoId
      ? `https://youtube.com/watch?v=${youtubeLiveStatus.videoId}`
      : "https://youtube.com/@AsterionVT";
  } else {
    titleText = "New Content Alert!";
    descText = "Check out my latest updates.";
    buttonLabel = "View Content";
    buttonHref = home.featured.href;
  }

  return (
    <div className={`notification-container ${isClosing ? "closing" : ""}`}>
      <Column className="notification-card" padding="16" gap="12" fillWidth>
        <Row vertical="center" gap="12" fillWidth>
          <Avatar src={person.avatar} size="m" />
          <Column gap="2" flex={1}>
            <Text weight="strong" variant="body-default-m" onBackground="neutral-strong">
              {titleText}
            </Text>
            <Text
              variant="body-default-xs"
              onBackground="neutral-weak"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {descText}
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
            href={buttonHref}
            onClick={handleView}
            label={buttonLabel}
            size="s"
            variant="primary"
          />
        </Row>
      </Column>
    </div>
  );
};
