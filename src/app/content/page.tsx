import {
  Column,
  Heading,
  Text,
  Row,
  Line,
  Badge,
  SmartLink,
  Media,
  Flex,
  Avatar,
  Button,
  RevealFx,
  Grid,
  Meta,
} from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import {
  getTwitchLiveStatus,
  getYouTubeLiveStatus,
  getYouTubeChannelId,
  getUploadsPlaylistId,
  decodeHtmlEntities,
} from "@/lib/social";
import { TwitchEmbed, YouTubeEmbed, ShortsCarousel, MarkContentSeen, ScrollReveal } from "@/components";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function generateMetadata() {
  const [twitchStatus, youtubeLiveStatus] = await Promise.all([
    getTwitchLiveStatus("asterionvt").catch(() => ({ isLive: false, title: undefined as string | undefined })),
    getYouTubeLiveStatus("AsterionVT").catch(() => ({ isLive: false, title: undefined as string | undefined })),
  ]);
  const isLive = Boolean(twitchStatus?.isLive || youtubeLiveStatus?.isLive);
  const livePlatform = twitchStatus?.isLive ? "Twitch" : youtubeLiveStatus?.isLive ? "YouTube" : null;
  const liveTitle = twitchStatus?.isLive ? twitchStatus.title : youtubeLiveStatus?.title;

  const title = isLive
    ? `🔴 LIVE NOW: ${person.name} | Content & Streams`
    : `Content & Streams – ${person.name}`;

  const ogParams = new URLSearchParams();
  ogParams.set("title", title);
  if (isLive) {
    ogParams.set("live", "true");
    if (livePlatform) ogParams.set("platform", livePlatform);
    if (liveTitle) ogParams.set("streamTitle", liveTitle);
  }

  const meta = Meta.generate({
    title,
    description: `Watch live streams, YouTube videos, and content by ${person.name}.`,
    baseURL: baseURL,
    path: "/content",
    image: `/api/og/generate?${ogParams.toString()}`,
  });

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      siteName: `${person.name} Realm`,
    },
  };
}

interface PlaylistItem {
  snippet?: {
    resourceId?: {
      videoId?: string;
    };
    title?: string;
    publishedAt?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
      high?: { url?: string };
      standard?: { url?: string };
      maxres?: { url?: string };
    };
  };
}

interface VideoDetail {
  id?: string;
  contentDetails?: {
    duration?: string;
  };
  snippet?: {
    liveBroadcastContent?: string;
  };
}

interface YouTubeMedia {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  isShort: boolean;
}

interface YouTubeData {
  shorts: YouTubeMedia[];
  videos: YouTubeMedia[];
}



function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}



// Fallback YouTube RSS parser (works without API key)
async function getYouTubeFromRss(channelId = "UCUCNgIlApBB0eCZ34LSskyw"): Promise<{ shorts: YouTubeMedia[]; videos: YouTubeMedia[] }> {
  try {
    const feedRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 300 } }
    );
    if (!feedRes.ok) return { shorts: [], videos: [] };
    const xml = await feedRes.text();
    const entries = xml.split("<entry>").slice(1);

    const mediaList: YouTubeMedia[] = [];
    for (const e of entries) {
      const idMatch = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = e.match(/<title>([^<]+)<\/title>/);
      const linkMatch = e.match(/<link rel=["']alternate["'] href=["']([^"']+)["']/);
      const thumbMatch = e.match(/<media:thumbnail url=["']([^"']+)["']/);
      const publishedMatch = e.match(/<published>([^<]+)<\/published>/);

      const id = idMatch?.[1];
      if (!id) continue;

      const link = linkMatch?.[1] || "";
      const title = titleMatch?.[1] || "Untitled Video";
      const isShort =
        link.includes("/shorts/") ||
        title.toLowerCase().includes("#shorts") ||
        title.toLowerCase().includes("#short");

      mediaList.push({
        id,
        title,
        thumbnail:
          thumbMatch?.[1] ||
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: publishedMatch?.[1] || new Date().toISOString(),
        isShort,
      });
    }

    return {
      shorts: mediaList.filter((m) => m.isShort).slice(0, 10),
      videos: mediaList.filter((m) => !m.isShort).slice(0, 10),
    };
  } catch (err) {
    console.error("YouTube RSS Fallback Error:", err);
    return { shorts: [], videos: [] };
  }
}

// YouTube uploads fetch — 2 quota units per refresh (playlistItems + videos), no `search`
async function getYouTubeContent(handle: string, apiKey?: string): Promise<YouTubeData> {
  const channelId = await getYouTubeChannelId(handle);

  if (apiKey && channelId) {
    try {
      // 1. Fetch latest 30 uploads (1 unit)
      const playlistRes = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${getUploadsPlaylistId(channelId)}&maxResults=30&key=${apiKey}`,
        { next: { revalidate: 300 } }
      );
      if (playlistRes.ok) {
        const playlistData = await playlistRes.json();
        const items: PlaylistItem[] = playlistData.items || [];

        // 2. Fetch durations + broadcast state to split shorts/videos (1 unit)
        const videoIds = items
          .map((item: PlaylistItem) => item.snippet?.resourceId?.videoId)
          .filter((id): id is string => typeof id === "string");

        let videosDetails: VideoDetail[] = [];
        if (videoIds.length > 0) {
          const videosRes = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(",")}&key=${apiKey}`,
            { next: { revalidate: 300 } }
          );
          if (videosRes.ok) {
            const videosData = await videosRes.json();
            videosDetails = videosData.items || [];
          }
        }

        const detailMap = new Map<string, VideoDetail>(
          videosDetails.filter((v) => v.id).map((v) => [v.id as string, v])
        );

        const mediaList = items
          // Live/upcoming broadcasts are shown in the YouTube card, not the uploads grid
          .filter((item: PlaylistItem) => {
            const state = detailMap.get(item.snippet?.resourceId?.videoId || "")?.snippet?.liveBroadcastContent;
            return state !== "live" && state !== "upcoming";
          })
          .map((item: PlaylistItem) => {
            const videoId = item.snippet?.resourceId?.videoId || "";
            const durationISO = detailMap.get(videoId)?.contentDetails?.duration || "";
            const durationSeconds = parseISO8601Duration(durationISO);
            return {
              id: videoId,
              title: decodeHtmlEntities(item.snippet?.title || "Untitled Video"),
              thumbnail:
                item.snippet?.thumbnails?.maxres?.url ||
                item.snippet?.thumbnails?.standard?.url ||
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.medium?.url ||
                item.snippet?.thumbnails?.default?.url ||
                "/images/og/home.jpg",
              publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
              isShort: durationSeconds > 0 && durationSeconds <= 60,
            };
          });

        const shorts = mediaList.filter((m) => m.isShort).slice(0, 10);
        const videos = mediaList.filter((m) => !m.isShort).slice(0, 10);
        if (shorts.length > 0 || videos.length > 0) {
          return { shorts, videos };
        }
      }
    } catch (e) {
      console.warn("YouTube API failed, falling back to RSS:", e);
    }
  }

  // Graceful fallback to YouTube public RSS feed (no API key / quota needed)
  return getYouTubeFromRss(channelId ?? "UCUCNgIlApBB0eCZ34LSskyw");
}

export default async function Content() {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  // Parallel fetches — the YouTube live check shares its cache with the home page
  const [twitchStatus, youtubeLive, youtubeData] = await Promise.all([
    getTwitchLiveStatus("asterionvt"),
    getYouTubeLiveStatus("AsterionVT"),
    getYouTubeContent("AsterionVT", youtubeApiKey),
  ]);

  const latestVideoId = youtubeData.videos[0]?.id || youtubeData.shorts[0]?.id || null;
  const youtubeLiveUrl = youtubeLive.videoId
    ? `https://www.youtube.com/watch?v=${youtubeLive.videoId}`
    : "https://www.youtube.com/@AsterionVT/live";

  return (
    <Column maxWidth="m" paddingTop="32" gap="m" fillWidth horizontal="center">
      <MarkContentSeen latestVideoId={latestVideoId} />
      {/* Floating Twitch Live Widget */}
      {twitchStatus.isLive && (
        <ScrollReveal translateY="8" fillWidth>
          <SmartLink
            href="https://www.twitch.tv/asterionvt"
            style={{ textDecoration: "none", marginBottom: "-8px" }}
          >
            <Row
              vertical="center"
              radius="full"
              paddingY="8"
              paddingX="16"
              gap="12"
              style={{
                background: "rgba(145, 70, 255, 0.2)",
                border: "1px solid rgba(145, 70, 255, 0.35)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 15px rgba(145, 70, 255, 0.2)",
                maxWidth: "100%",
              }}
              className="twitch-live-pill"
            >
              <Row gap="8" vertical="center">
                <Badge background="danger-alpha-strong" onBackground="danger-strong" style={{ borderRadius: "9999px" }}>
                  LIVE
                </Badge>
                <Text weight="strong" style={{ color: "#a970ff" }}>
                  Twitch
                </Text>
              </Row>
              <Line style={{ background: "rgba(145, 70, 255, 0.3)" }} vert height="16" />
              <Text
                variant="body-default-s"
                style={{
                  color: "#e6d6ff",
                  maxWidth: "12rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {twitchStatus.title || "AsterionVT is Live!"}
              </Text>
            </Row>
          </SmartLink>
        </ScrollReveal>
      )}

      {/* Floating YouTube Live Widget */}
      {youtubeLive.isLive && (
        <ScrollReveal translateY="8" fillWidth>
          <SmartLink
            href={youtubeLiveUrl}
            style={{ textDecoration: "none", marginBottom: "-8px" }}
          >
            <Row
              vertical="center"
              radius="full"
              paddingY="8"
              paddingX="16"
              gap="12"
              style={{
                background: "rgba(255, 48, 64, 0.18)",
                border: "1px solid rgba(255, 48, 64, 0.35)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 15px rgba(255, 48, 64, 0.2)",
                maxWidth: "100%",
              }}
              className="youtube-live-pill"
            >
              <Row gap="8" vertical="center">
                <Badge background="danger-alpha-strong" onBackground="danger-strong" style={{ borderRadius: "9999px" }}>
                  LIVE
                </Badge>
                <Text weight="strong" style={{ color: "#ff6b78" }}>
                  YouTube
                </Text>
              </Row>
              <Line style={{ background: "rgba(255, 48, 64, 0.3)" }} vert height="16" />
              <Text
                variant="body-default-s"
                style={{
                  color: "#ffd9dc",
                  maxWidth: "12rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {youtubeLive.title || "AsterionVT is Live!"}
              </Text>
            </Row>
          </SmartLink>
        </ScrollReveal>
      )}

      {/* Title */}
      <ScrollReveal translateY="8" fillWidth>
        <Column fillWidth gap="8" align="center">
          <Heading variant="display-strong-m">Content Hub</Heading>
          <Text onBackground="neutral-weak" variant="body-default-s">
            Check out the latest live streams, videos, and shorts
          </Text>
        </Column>
      </ScrollReveal>

      {/* Live Indicators Section */}
      <ScrollReveal translateY="12" fillWidth>
        <Grid
          columns="2"
          s={{ columns: "1" }}
          gap="16"
          fillWidth
        >
          {/* Twitch Card */}
          <Column
            className="material-card"
            background="page"
            border="neutral-alpha-weak"
            radius="l"
            padding="24"
            gap="16"
            style={{
              transition: "all 0.25s ease",
              gridColumn: twitchStatus.isLive ? "1 / -1" : undefined
            }}
          >
            <Row vertical="center" gap="16" fillWidth>
              <Avatar src={person.avatar} size="l" />
              <Column gap="4" flex={1}>
                <Text weight="strong" variant="heading-strong-m">
                  Twitch Stream
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  @asterionvt
                </Text>
              </Column>
              {twitchStatus.isLive ? (
                <Badge background="danger-alpha-strong" onBackground="danger-strong" style={{ animation: "pulse 2s infinite" }}>
                  LIVE
                </Badge>
              ) : (
                <Badge background="neutral-alpha-weak" onBackground="neutral-weak">
                  Offline
                </Badge>
              )}
            </Row>

            {twitchStatus.isLive && (
              <Column gap="12" fillWidth borderTop="neutral-alpha-weak" paddingTop="16">
                <Text variant="body-default-s" weight="strong" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {twitchStatus.title}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak" paddingBottom="4">
                  🔴 Watching with {twitchStatus.viewerCount} viewers
                </Text>
                <TwitchEmbed />
              </Column>
            )}

            <Row fillWidth horizontal="end" paddingTop="8">
              <Button
                href="https://www.twitch.tv/asterionvt"
                label="Go to Twitch"
                prefixIcon="twitch"
                suffixIcon="arrowUpRight"
                size="s"
                variant="secondary"
              />
            </Row>
          </Column>

          {/* YouTube Card */}
          <Column
            className="material-card"
            background="page"
            border="neutral-alpha-weak"
            radius="l"
            padding="24"
            gap="16"
            style={{
              transition: "all 0.25s ease",
              gridColumn: youtubeLive.isLive ? "1 / -1" : undefined
            }}
          >
            <Row vertical="center" gap="16" fillWidth>
              <Avatar src={person.avatar} size="l" />
              <Column gap="4" flex={1}>
                <Text weight="strong" variant="heading-strong-m">
                  YouTube Broadcast
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  @AsterionVT
                </Text>
              </Column>
              {youtubeLive.isLive ? (
                <Badge background="danger-alpha-strong" onBackground="danger-strong" style={{ animation: "pulse 2s infinite" }}>
                  LIVE
                </Badge>
              ) : (
                <Badge background="neutral-alpha-weak" onBackground="neutral-weak">
                  Offline
                </Badge>
              )}
            </Row>

            {youtubeLive.isLive && (
              <Column gap="12" fillWidth borderTop="neutral-alpha-weak" paddingTop="16">
                <Text variant="body-default-s" weight="strong" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {youtubeLive.title}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak" paddingBottom="4">
                  {typeof youtubeLive.viewerCount === "number"
                    ? `🔴 Watching with ${youtubeLive.viewerCount} viewers`
                    : "🔴 Live right now!"}
                </Text>
                {youtubeLive.videoId && (
                  <YouTubeEmbed videoId={youtubeLive.videoId} title={youtubeLive.title} />
                )}
              </Column>
            )}

            <Row fillWidth horizontal="end" paddingTop="8">
              <Button
                href={youtubeLive.isLive ? youtubeLiveUrl : "https://www.youtube.com/@AsterionVT"}
                label={youtubeLive.isLive ? "Watch on YouTube" : "Go to YouTube"}
                prefixIcon="youtube"
                suffixIcon="arrowUpRight"
                size="s"
                variant="secondary"
              />
            </Row>
          </Column>
        </Grid>
      </ScrollReveal>

      <Line background="neutral-alpha-weak" fillWidth />

      {/* Videos Section */}
      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-l" paddingLeft="8">
          Latest Videos
        </Heading>
        {youtubeData.videos.length > 0 ? (
          <Grid
            columns="3"
            m={{ columns: "2" }}
            s={{ columns: "1" }}
            gap="8"
            fillWidth
          >
            {youtubeData.videos.map((video: YouTubeMedia) => (
              <ScrollReveal key={video.id} translateY="12" fillWidth>
                <SmartLink
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <Column
                    className="material-card"
                    radius="l"
                    overflow="hidden"
                    fillWidth
                  >
                    <Media
                      src={video.thumbnail}
                      alt={video.title}
                      aspectRatio="16/9"
                      fillWidth
                    />
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
                        {video.title}
                      </Text>
                      <Row fillWidth horizontal="between" vertical="center" paddingTop="8">
                        <Button
                          label="Watch"
                          suffixIcon="arrowUpRight"
                          size="s"
                          variant="secondary"
                          style={{ pointerEvents: "none" }}
                        />
                        <Text variant="body-default-xs" onBackground="neutral-weak">
                          {new Date(video.publishedAt).toLocaleDateString()}
                        </Text>
                      </Row>
                    </Column>
                  </Column>
                </SmartLink>
              </ScrollReveal>
            ))}
          </Grid>
        ) : (
          <Row padding="24" horizontal="center" border="neutral-alpha-weak" radius="m" background="page" fillWidth>
            <Text variant="body-default-s" onBackground="neutral-weak">
              No videos found. Check back later!
            </Text>
          </Row>
        )}
      </Column>

      <Line background="neutral-alpha-weak" fillWidth />

      {/* Shorts Section */}
      <ScrollReveal translateY="12" fillWidth>
        <Column fillWidth gap="16">
          <Heading as="h2" variant="heading-strong-l" paddingLeft="8">
            Latest Shorts
          </Heading>
          {youtubeData.shorts.length > 0 ? (
            <ShortsCarousel shorts={youtubeData.shorts} />
          ) : (
            <Row padding="24" horizontal="center" border="neutral-alpha-weak" radius="m" background="page" fillWidth>
              <Text variant="body-default-s" onBackground="neutral-weak">
                No shorts found. Check back later!
              </Text>
            </Row>
          )}
        </Column>
      </ScrollReveal>
    </Column>
  );
}
