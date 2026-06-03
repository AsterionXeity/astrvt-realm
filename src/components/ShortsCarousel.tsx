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
    setActiveIndex((prev) => (prev + 2) % shorts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 2 + shorts.length) % shorts.length);
  };

  if (!shorts || shorts.length === 0) return null;

  const firstShort = shorts[activeIndex];
  const secondShort = shorts[(activeIndex + 1) % shorts.length];

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
          <Row gap="12" fillWidth horizontal="center" style={{ maxWidth: "520px" }}>
            {/* First Short */}
            <SmartLink
              href={`https://www.youtube.com/shorts/${firstShort.id}`}
              style={{ textDecoration: "none", flex: 1, minWidth: "0" }}
            >
              <Column className="material-card" radius="l" overflow="hidden" fillWidth>
                <Media src={firstShort.thumbnail} alt={firstShort.title} aspectRatio="9/16" fillWidth />
                <Column padding="12" gap="8" fillWidth>
                  <Text
                    variant="body-default-s"
                    weight="strong"
                    onBackground="neutral-strong"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.4rem",
                    }}
                  >
                    {firstShort.title}
                  </Text>
                  <Row fillWidth horizontal="between" vertical="center" paddingTop="4">
                    <span style={{ pointerEvents: "none", fontSize: "var(--font-size-body-xs)", color: "var(--neutral-on-background-weak)", background: "var(--neutral-alpha-weak)", padding: "2px 6px", borderRadius: "4px" }}>
                      Watch
                    </span>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {new Date(firstShort.publishedAt).toLocaleDateString()}
                    </Text>
                  </Row>
                </Column>
              </Column>
            </SmartLink>

            {/* Second Short */}
            <SmartLink
              href={`https://www.youtube.com/shorts/${secondShort.id}`}
              style={{ textDecoration: "none", flex: 1, minWidth: "0" }}
            >
              <Column className="material-card" radius="l" overflow="hidden" fillWidth>
                <Media src={secondShort.thumbnail} alt={secondShort.title} aspectRatio="9/16" fillWidth />
                <Column padding="12" gap="8" fillWidth>
                  <Text
                    variant="body-default-s"
                    weight="strong"
                    onBackground="neutral-strong"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.4rem",
                    }}
                  >
                    {secondShort.title}
                  </Text>
                  <Row fillWidth horizontal="between" vertical="center" paddingTop="4">
                    <span style={{ pointerEvents: "none", fontSize: "var(--font-size-body-xs)", color: "var(--neutral-on-background-weak)", background: "var(--neutral-alpha-weak)", padding: "2px 6px", borderRadius: "4px" }}>
                      Watch
                    </span>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {new Date(secondShort.publishedAt).toLocaleDateString()}
                    </Text>
                  </Row>
                </Column>
              </Column>
            </SmartLink>
          </Row>

          {/* Navigation Controls */}
          <Row gap="16" vertical="center" horizontal="center" fillWidth>
            <IconButton
              icon="chevronLeft"
              onClick={handlePrev}
              variant="secondary"
              aria-label="Previous Shorts"
            />
            <Text variant="body-default-s" onBackground="neutral-weak">
              {Math.floor(activeIndex / 2) + 1} / {Math.ceil(shorts.length / 2)}
            </Text>
            <IconButton
              icon="chevronRight"
              onClick={handleNext}
              variant="secondary"
              aria-label="Next Shorts"
            />
          </Row>
        </Column>
      </div>
    </Column>
  );
};
