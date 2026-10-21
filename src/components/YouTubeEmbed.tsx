interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export const YouTubeEmbed = ({ videoId, title }: YouTubeEmbedProps) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        overflow: "hidden",
        borderRadius: "var(--radius-l)",
        border: "1px solid var(--neutral-alpha-weak)",
      }}
    >
      <iframe
        src={embedUrl}
        title={title || "YouTube live stream"}
        height="100%"
        width="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: "none" }}
      />
    </div>
  );
};
