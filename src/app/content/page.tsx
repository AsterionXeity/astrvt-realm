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
import { getTwitchLiveStatus, type TwitchStatus } from "@/lib/social";
import { TwitchEmbed, ShortsCarousel, MarkContentSeen, ScrollReveal } from "@/components";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Cache for 60 seconds

export async function generateMetadata() {
  const twitchStatus = await getTwitchLiveStatus("asterionvt").catch(() => ({
    isLive: false,
    title: undefined as string | undefined,
  }));
  const isLive = Boolean(twitchStatus?.isLive);

  const title = isLive
    ? `🔴 LIVE NOW: ${person.name} | Content & Streams`
    : `Content & Streams – ${person.name}`;

  const ogParams = new URLSearchParams();
  ogParams.set("title", title);
  if (isLive) {
    ogParams.set("live", "true");
    ogParams.set("platform", "Twitch");
    if (twitchStatus.title) ogParams.set("streamTitle", twitchStatus.title);
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
}

interface YouTubeMedia {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  isShort: boolean;
}

interface YouTubeData {
  isLive: boolean;
  liveTitle: string;
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

// YouTube fetch helpers
async function getYouTubeContentAndLive(handle: string, apiKey?: string): Promise<YouTubeData> {
  if (apiKey) {
    try {
      // 1. Resolve Channel ID
      const searchRes = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const channelId = searchData.items?.[0]?.snippet?.channelId;
        if (channelId) {
          // 2. Check Live Status
          let isLive = false;
          let liveTitle = "";
          try {
            const liveRes = await fetch(
              `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`,
              { next: { revalidate: 60 } }
            );
            if (liveRes.ok) {
              const liveData = await liveRes.json();
              if (liveData.items && liveData.items.length > 0) {
                isLive = true;
                liveTitle = liveData.items[0].snippet?.title || "";
              }
            }
          } catch (e) {
            console.error("YouTube Live check failed:", e);
          }

          // 3. Fetch Uploads Playlist ID
          const channelRes = await fetch(
            `https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
            { next: { revalidate: 3600 } }
          );
          if (channelRes.ok) {
            const channelData = await channelRes.json();
            const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
            if (uploadsPlaylistId) {
              // 4. Fetch Latest 30 uploads
              const playlistRes = await fetch(
                `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=30&key=${apiKey}`,
                { next: { revalidate: 300 } }
              );
              if (playlistRes.ok) {
                const playlistData = await playlistRes.json();
                const items: PlaylistItem[] = playlistData.items || [];

                // 5. Fetch durations to filter shorts vs videos
                const videoIds = items
                  .map((item: PlaylistItem) => item.snippet?.resourceId?.videoId)
                  .filter((id): id is string => typeof id === "string");

                let videosDetails: VideoDetail[] = [];
                if (videoIds.length > 0) {
                  const videosRes = await fetch(
                    `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`,
                    { next: { revalidate: 300 } }
                  );
                  if (videosRes.ok) {
                    const videosData = await videosRes.json();
                    videosDetails = videosData.items || [];
                  }
                }

                const durationMap = new Map<string, string>(
                  videosDetails
                    .map((v: VideoDetail) => {
                      const id = v.id;
                      const duration = v.contentDetails?.duration;
                      return id && duration ? [id, duration] as [string, string] : null;
                    })
                    .filter((entry): entry is [string, string] => entry !== null)
                );

                const mediaList = items.map((item: PlaylistItem) => {
                  const videoId = item.snippet?.resourceId?.videoId || "";
                  const durationISO = durationMap.get(videoId) || "";
                  const durationSeconds = parseISO8601Duration(durationISO);
                  return {
                    id: videoId,
                    title: item.snippet?.title || "Untitled Video",
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
                  return { isLive, liveTitle, shorts, videos };
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("YouTube API failed, falling back to RSS:", e);
    }
  }

  // Graceful fallback to YouTube public RSS feed (no API key needed)
  const rssData = await getYouTubeFromRss("UCUCNgIlApBB0eCZ34LSskyw");
  return {
    isLive: false,
    liveTitle: "",
    shorts: rssData.shorts,
    videos: rssData.videos,
  };
}

export default async function Content() {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  // Parallel fetches for Twitch status and YouTube content/status
  const [twitchStatus, youtubeData] = await Promise.all([
    getTwitchLiveStatus("asterionvt"),
    getYouTubeContentAndLive("AsterionVT", youtubeApiKey),
  ]);

  const latestVideoId = youtubeData.videos[0]?.id || youtubeData.shorts[0]?.id || null;

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
            style={{ transition: "all 0.25s ease" }}
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
              {youtubeData.isLive ? (
                <Badge background="danger-alpha-strong" onBackground="danger-strong" style={{ animation: "pulse 2s infinite" }}>
                  LIVE
                </Badge>
              ) : (
                <Badge background="neutral-alpha-weak" onBackground="neutral-weak">
                  Offline
                </Badge>
              )}
            </Row>

            {youtubeData.isLive && (
              <Column gap="8" fillWidth borderTop="neutral-alpha-weak" paddingTop="16">
                <Text variant="body-default-s" weight="strong" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {youtubeData.liveTitle}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  🔴 Live right now!
                </Text>
              </Column>
            )}

            <Row fillWidth horizontal="end" paddingTop="8">
              <Button
                href="https://www.youtube.com/@AsterionVT"
                label="Go to YouTube"
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
