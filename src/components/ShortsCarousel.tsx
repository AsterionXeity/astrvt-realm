"use client";

import { useState } from "react";
import { Column, Row, Text, IconButton, Media, SmartLink, Grid } from "@once-ui-system/core";
import styles from "./ShortsCarousel.module.scss";

interface YouTubeMedia {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  isShort: boolean;
}

interface ShortsCarouselProps {
  shorts: YouTubeMedia[];
}

export const ShortsCarousel = ({ shorts }: ShortsCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % shorts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
  };

  const currentShort = shorts[activeIndex];

  if (!shorts || shorts.length === 0) return null;

  return (
    <Column fillWidth gap="16">
      {/* Desktop Grid Layout: Visible on desktop, hidden on mobile */}
      <div className={styles.desktopGrid}>
        <Grid
          columns="5"
          m={{ columns: "4" }}
          s={{ columns: "3" }}
          gap="16"
          fillWidth
        >
          {shorts.map((short) => (
            <SmartLink
              key={short.id}
              href={`https://www.youtube.com/shorts/${short.id}`}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <Column className="material-card" radius="l" overflow="hidden" fillWidth>
                <Media src={short.thumbnail} alt={short.title} aspectRatio="9/16" fillWidth />
                <Column padding="16" gap="12" fillWidth>
                  <Text
                    variant="body-default-m"
                    weight="strong"
                    onBackground="neutral-strong"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.8rem",
                    }}
                  >
                    {short.title}
                  </Text>
                  <Row fillWidth horizontal="between" vertical="center" paddingTop="8">
                    <span style={{ pointerEvents: "none", fontSize: "var(--font-size-body-s)", color: "var(--neutral-on-background-weak)", background: "var(--neutral-alpha-weak)", padding: "4px 8px", borderRadius: "4px" }}>
                      Watch
                    </span>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {new Date(short.publishedAt).toLocaleDateString()}
                    </Text>
                  </Row>
                </Column>
              </Column>
            </SmartLink>
          ))}
        </Grid>
      </div>

      {/* Mobile Slider Layout: Visible on mobile, hidden on desktop */}
      <div className={styles.mobileSlider}>
        <Column fillWidth gap="16" horizontal="center">
          <SmartLink
            href={`https://www.youtube.com/shorts/${currentShort.id}`}
            style={{ textDecoration: "none", width: "100%", maxWidth: "280px" }}
          >
            <Column className="material-card" radius="l" overflow="hidden" fillWidth>
              <Media src={currentShort.thumbnail} alt={currentShort.title} aspectRatio="9/16" fillWidth />
              <Column padding="16" gap="12" fillWidth>
                <Text
                  variant="body-default-m"
                  weight="strong"
                  onBackground="neutral-strong"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "2.8rem",
                  }}
                >
                  {currentShort.title}
                </Text>
                <Row fillWidth horizontal="between" vertical="center" paddingTop="8">
                  <span style={{ pointerEvents: "none", fontSize: "var(--font-size-body-s)", color: "var(--neutral-on-background-weak)", background: "var(--neutral-alpha-weak)", padding: "4px 8px", borderRadius: "4px" }}>
                    Watch
                  </span>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {new Date(currentShort.publishedAt).toLocaleDateString()}
                  </Text>
                </Row>
              </Column>
            </Column>
          </SmartLink>

          {/* Navigation Controls */}
          <Row gap="16" vertical="center" horizontal="center" fillWidth>
            <IconButton
              icon="chevronLeft"
              onClick={handlePrev}
              variant="secondary"
              aria-label="Previous Short"
            />
            <Text variant="body-default-s" onBackground="neutral-weak">
              {activeIndex + 1} / {shorts.length}
            </Text>
            <IconButton
              icon="chevronRight"
              onClick={handleNext}
              variant="secondary"
              aria-label="Next Short"
            />
          </Row>
        </Column>
      </div>
    </Column>
  );
};
