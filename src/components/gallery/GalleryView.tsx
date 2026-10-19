"use client";

import { useMemo } from "react";
import { Media, MasonryGrid } from "@once-ui-system/core";
import { gallery } from "@/resources";
import type { GalleryImage } from "@/types";

/**
 * Checks whether an artwork was created within the last month (30 days).
 * Allows manual override via `isNew` boolean property.
 */
function isRecentImage(createdAt?: string, manualOverride?: boolean): boolean {
  if (manualOverride !== undefined) return manualOverride;
  if (!createdAt) return false;

  const createdTime = new Date(createdAt).getTime();
  if (isNaN(createdTime)) return false;

  const now = new Date().getTime();
  const diffMs = now - createdTime;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // New if created within the past 30 days (with a 24h future buffer for timezone tolerance)
  return diffMs >= -86400000 && diffMs <= thirtyDaysMs;
}

interface GalleryViewProps {
  images?: GalleryImage[];
}

export default function GalleryView({ images }: GalleryViewProps) {
  const imageList = images ?? gallery.images;

  // Sort gallery images so the newest artworks (based on file creation date) appear at the top and oldest at the bottom
  const sortedImages = useMemo(() => {
    return [...imageList].sort((a: GalleryImage, b: GalleryImage) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [imageList]);

  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {sortedImages.map((image, index) => {
        const isNew = isRecentImage(image.createdAt, image.isNew);
        const isGif = image.src.toLowerCase().endsWith(".gif");

        return (
          <div key={image.src || index} className="gallery-card-wrapper">
            <Media
              enlarge
              priority={index < 4}
              sizes="(max-width: 560px) 100vw, 50vw"
              radius="m"
              src={image.src}
              alt={image.alt}
              unoptimized={image.unoptimized ?? isGif}
              className="material-card"
            />
            {isNew && (
              <div className="gallery-new-badge" aria-label="New artwork">
                <span className="gallery-new-sparkle">✦</span>
                <span>NEW</span>
              </div>
            )}
          </div>
        );
      })}
    </MasonryGrid>
  );
}

