import fs from "fs";
import path from "path";
import { Flex, Meta, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person, home } from "@/resources";
import type { GalleryImage } from "@/types";

/**
 * Extracts the file's original creation / earliest modified timestamp from disk.
 */
function getFileTimestamp(src: string): string | undefined {
  try {
    const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
    const fullPath = path.join(process.cwd(), "public", cleanSrc);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      const birthMs = stat.birthtimeMs || 0;
      const modMs = stat.mtimeMs || 0;
      const valid = [birthMs, modMs].filter((t) => t > 0);
      if (valid.length > 0) {
        return new Date(Math.min(...valid)).toISOString();
      }
    }
  } catch {
    // ignore and allow fallback
  }
  return undefined;
}

export async function generateMetadata() {
  const meta = Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      siteName: `${person.name} Realm`,
    },
  };
}

export default function Gallery() {
  // Resolve actual file creation/modified dates from disk
  const imagesWithFileDates: GalleryImage[] = gallery.images.map((img) => ({
    ...img,
    createdAt: img.createdAt || getFileTimestamp(img.src),
  }));

  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={gallery.image || home.image}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryView images={imagesWithFileDates} />
    </Flex>
  );
}
