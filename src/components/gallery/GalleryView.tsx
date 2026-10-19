"use client";

import { useMemo, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize zoom state to elevate the enlarged card and its masonry column above all siblings
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let activeColumn: HTMLElement | null = null;
    let activeWrapper: HTMLElement | null = null;

    const updateZoomState = () => {
      const zoomOutEl = container.querySelector(".cursor-zoom-out");
      if (zoomOutEl) {
        document.documentElement.classList.add("gallery-zoom-active");
        document.body.classList.add("gallery-zoom-active");

        const wrapper = zoomOutEl.closest(".gallery-card-wrapper") as HTMLElement | null;
        if (wrapper && wrapper !== activeWrapper) {
          if (activeWrapper) activeWrapper.classList.remove("is-enlarged");
          wrapper.classList.add("is-enlarged");
          activeWrapper = wrapper;

          const parentCol = wrapper.parentElement as HTMLElement | null;
          if (parentCol && parentCol !== activeColumn) {
            if (activeColumn) activeColumn.classList.remove("is-enlarged-column");
            parentCol.classList.add("is-enlarged-column");
            activeColumn = parentCol;
          }
        }
      } else {
        document.documentElement.classList.remove("gallery-zoom-active");
        document.body.classList.remove("gallery-zoom-active");
        if (activeWrapper) {
          activeWrapper.classList.remove("is-enlarged");
          activeWrapper = null;
        }
        if (activeColumn) {
          activeColumn.classList.remove("is-enlarged-column");
          activeColumn = null;
        }
      }
    };

    const observer = new MutationObserver(updateZoomState);
    observer.observe(container, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("gallery-zoom-active");
      document.body.classList.remove("gallery-zoom-active");
      if (activeWrapper) activeWrapper.classList.remove("is-enlarged");
      if (activeColumn) activeColumn.classList.remove("is-enlarged-column");
    };
  }, []);

  // Sort gallery images so the newest artworks (based on file creation date) appear at the top and oldest at the bottom
  const sortedImages = useMemo(() => {
    return [...imageList].sort((a: GalleryImage, b: GalleryImage) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [imageList]);

  return (
    <div ref={containerRef} className="gallery-masonry-root" style={{ width: "100%" }}>
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
    </div>
  );
}


