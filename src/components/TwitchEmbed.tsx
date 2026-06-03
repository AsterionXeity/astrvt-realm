"use client";

import { useEffect, useState } from "react";

export const TwitchEmbed = () => {
  const [hostname, setHostname] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  if (!hostname) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "var(--neutral-alpha-weak)",
          borderRadius: "var(--radius-l)",
        }}
      />
    );
  }

  // Construct the Twitch player URL using the current host domain as parent
  const embedUrl = `https://player.twitch.tv/?channel=asterionvt&parent=${hostname}&enableExtensions=true&muted=true&player=popout&quality=1080p60&volume=0.57`;

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
        height="100%"
        width="100%"
        allowFullScreen
        scrolling="no"
        style={{ border: "none" }}
      />
    </div>
  );
};
