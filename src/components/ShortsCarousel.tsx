"use client";

import { useState } from "react";
import Image from "next/image";
import { Column, Row, Text, IconButton, SmartLink, Grid } from "@once-ui-system/core";
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
          columns="4"
          m={{ columns: "3" }}
          s={{ columns: "2" }}
          gap="8"
          fillWidth
        >
          {shorts.map((short) => (
            <SmartLink
              key={short.id}
              href={`https://www.youtube.com/shorts/${short.id}`}
              className={styles.cardLink}
            >
              <div className={styles.shortCard}>
                <div className={styles.thumbnailWrapper}>
                  <Image
                    src={short.thumbnail || "/images/og/home.jpg"}
                    alt={short.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={styles.thumbnailImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <p className={styles.shortTitle}>
                    {short.title}
                  </p>
                  <Row fillWidth horizontal="between" vertical="center" paddingTop="8">
                    <span className={styles.watchTag}>
                      Watch
                    </span>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {new Date(short.publishedAt).toLocaleDateString()}
                    </Text>
                  </Row>
                </div>
              </div>
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
              className={styles.cardLink}
              style={{ flex: 1, minWidth: "0" }}
            >
              <div className={styles.shortCard}>
                <div className={styles.thumbnailWrapper}>
                  <Image
                    src={firstShort.thumbnail || "/images/og/home.jpg"}
                    alt={firstShort.title}
                    fill
                    sizes="50vw"
                    className={styles.thumbnailImage}
                  />
                </div>
                <div className={styles.cardContentMobile}>
                  <p className={styles.shortTitleMobile}>
                    {firstShort.title}
                  </p>
                  <Row fillWidth horizontal="between" vertical="center" paddingTop="4">
                    <span className={styles.watchTagMobile}>
                      Watch
                    </span>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {new Date(firstShort.publishedAt).toLocaleDateString()}
                    </Text>
                  </Row>
                </div>
              </div>
            </SmartLink>

            {/* Second Short */}
            <SmartLink
              href={`https://www.youtube.com/shorts/${secondShort.id}`}
              className={styles.cardLink}
              style={{ flex: 1, minWidth: "0" }}
            >
              <div className={styles.shortCard}>
                <div className={styles.thumbnailWrapper}>
                  <Image
                    src={secondShort.thumbnail || "/images/og/home.jpg"}
                    alt={secondShort.title}
                    fill
                    sizes="50vw"
                    className={styles.thumbnailImage}
                  />
                </div>
                <div className={styles.cardContentMobile}>
                  <p className={styles.shortTitleMobile}>
                    {secondShort.title}
                  </p>
                  <Row fillWidth horizontal="between" vertical="center" paddingTop="4">
                    <span className={styles.watchTagMobile}>
                      Watch
                    </span>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {new Date(secondShort.publishedAt).toLocaleDateString()}
                    </Text>
                  </Row>
                </div>
              </div>
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
