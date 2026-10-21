// YouTube Data API returns HTML-escaped strings (e.g. "&amp;", "&#39;")
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export async function getYouTubeSubs(link: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("YouTube Fetch Skipped: YOUTUBE_API_KEY is missing from .env.local");
    return null;
  }
  
  const handleMatch = link.match(/@([^/?]+)/);
  if (!handleMatch) return null;
  const handle = handleMatch[1];
  
  try {
    const statsRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&forHandle=@${handle}&key=${apiKey}`, { next: { revalidate: 300 } });
    if (!statsRes.ok) {
      console.error("YouTube Stats API Error:", statsRes.status, await statsRes.text());
      return null;
    }
    const statsData = await statsRes.json();
    const subCount = statsData.items?.[0]?.statistics?.subscriberCount;
    if (!subCount) return null;
    
    const count = parseInt(subCount, 10);
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toString();
  } catch(e) {
    console.error("YouTube Fetch Error:", e);
    return null;
  }
}

export async function getTwitchFollowers(link: string): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.warn("Twitch Fetch Skipped: TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is missing from .env.local");
    return null;
  }
  
  const loginMatch = link.match(/twitch\.tv\/([^/?]+)/);
  if (!loginMatch) return null;
  const login = loginMatch[1];

  try {
    const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: "POST", next: { revalidate: 3600 } });
    if (!tokenRes.ok) {
      console.error("Twitch Token API Error:", tokenRes.status, await tokenRes.text());
      return null;
    }
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
      headers: {
        "Client-Id": clientId,
        "Authorization": `Bearer ${token}`
      },
      next: { revalidate: 86400 }
    });
    if (!userRes.ok) {
      console.error("Twitch User API Error:", userRes.status, await userRes.text());
      return null;
    }
    const userData = await userRes.json();
    const userId = userData.data?.[0]?.id;
    if (!userId) return null;

    const followRes = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
      headers: {
        "Client-Id": clientId,
        "Authorization": `Bearer ${token}`
      },
      next: { revalidate: 300 }
    });
    if (!followRes.ok) {
      console.error("Twitch Followers API Error:", followRes.status, await followRes.text());
      return null;
    }
    const followData = await followRes.json();
    const followCount = followData.total;
    if (typeof followCount !== 'number') return null;

    const count = followCount;
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count.toString();
  } catch(e) {
    console.error("Twitch Fetch Error:", e);
    return null;
  }
}

export interface TwitchStatus {
  isLive: boolean;
  title?: string;
  viewerCount?: number;
}

export async function getTwitchLiveStatus(login: string): Promise<TwitchStatus> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return { isLive: false };

  try {
    const tokenRes = await fetch(
      "https://id.twitch.tv/oauth2/token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
        next: { revalidate: 3600 },
      }
    );
    if (!tokenRes.ok) return { isLive: false };
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    const streamRes = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${login}`,
      {
        headers: {
          "Client-Id": clientId,
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!streamRes.ok) return { isLive: false };
    const streamData = await streamRes.json();
    if (streamData.data && streamData.data.length > 0) {
      return {
        isLive: true,
        title: streamData.data[0].title,
        viewerCount: streamData.data[0].viewer_count,
      };
    }
  } catch (e) {
    console.error("Twitch Live Status Fetch Error:", e);
  }
  return { isLive: false };
}

// ---------------------------------------------------------------------------
// YouTube helpers — quota-friendly
// `search` costs 100 units per call; `channels`, `playlistItems` and `videos`
// cost 1 unit each. Everything below avoids `search` entirely.
// ---------------------------------------------------------------------------
const YT_API = "https://youtube.googleapis.com/youtube/v3";

// Known channel IDs (skip the lookup entirely for these)
const KNOWN_CHANNEL_IDS: Record<string, string> = {
  asterionvt: "UCUCNgIlApBB0eCZ34LSskyw",
};

/** Resolve a handle (e.g. "AsterionVT") to a channel ID. 1 unit, cached 24h. */
export async function getYouTubeChannelId(handle: string): Promise<string | null> {
  const clean = handle.replace(/^@/, "");
  const known = KNOWN_CHANNEL_IDS[clean.toLowerCase()];
  if (known) return known;

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch(`${YT_API}/channels?part=id&forHandle=@${clean}&key=${apiKey}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      console.error("YouTube Channel Lookup Error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.items?.[0]?.id ?? null;
  } catch (e) {
    console.error("YouTube Channel Lookup Error:", e);
    return null;
  }
}

/** Every channel's uploads playlist is its channel ID with "UC" swapped for "UU". */
export function getUploadsPlaylistId(channelId: string): string {
  return `UU${channelId.slice(2)}`;
}

export async function getLatestYouTubeVideoId(handle: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = await getYouTubeChannelId(handle);

  if (apiKey && channelId) {
    try {
      // 1 unit, cached 5 minutes
      const res = await fetch(
        `${YT_API}/playlistItems?part=contentDetails&playlistId=${getUploadsPlaylistId(channelId)}&maxResults=1&key=${apiKey}`,
        { next: { revalidate: 300 } }
      );
      if (res.ok) {
        const data = await res.json();
        const latestVideoId = data.items?.[0]?.contentDetails?.videoId;
        if (latestVideoId) return latestVideoId;
      }
    } catch (e) {
      console.warn("YouTube API latest video fetch failed, falling back to RSS:", e);
    }
  }

  // Fallback to public RSS feed (free, no quota)
  try {
    const feedRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId ?? KNOWN_CHANNEL_IDS.asterionvt}`,
      { next: { revalidate: 300 } }
    );
    if (feedRes.ok) {
      const xml = await feedRes.text();
      const idMatch = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      if (idMatch?.[1]) return idMatch[1];
    }
  } catch (err) {
    console.error("YouTube RSS latest video fetch error:", err);
  }

  return null;
}

export interface YouTubeLiveStatus {
  isLive: boolean;
  title?: string;
  videoId?: string;
  viewerCount?: number;
}

/**
 * Live check costing 2 units (vs 100+ with search):
 *  1. playlistItems on the uploads playlist (active streams appear here)
 *  2. videos.list on those IDs → snippet.liveBroadcastContent === "live"
 * Both cached 60s and shared between every page that calls this.
 */
export async function getYouTubeLiveStatus(handle: string): Promise<YouTubeLiveStatus> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return { isLive: false };

  try {
    const channelId = await getYouTubeChannelId(handle);
    if (!channelId) return { isLive: false };

    const playlistRes = await fetch(
      `${YT_API}/playlistItems?part=contentDetails&playlistId=${getUploadsPlaylistId(channelId)}&maxResults=50&key=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!playlistRes.ok) {
      console.error("YouTube Live (playlist) API Error:", playlistRes.status, await playlistRes.text());
      return { isLive: false };
    }
    const playlistData = await playlistRes.json();
    const ids: string[] = (playlistData.items || [])
      .map((i: { contentDetails?: { videoId?: string } }) => i.contentDetails?.videoId)
      .filter(Boolean);
    if (ids.length === 0) return { isLive: false };

    const videosRes = await fetch(
      `${YT_API}/videos?part=snippet,liveStreamingDetails&id=${ids.join(",")}&key=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!videosRes.ok) {
      console.error("YouTube Live (videos) API Error:", videosRes.status, await videosRes.text());
      return { isLive: false };
    }
    const videosData = await videosRes.json();
    const live = (videosData.items || []).find(
      (v: { snippet?: { liveBroadcastContent?: string } }) => v.snippet?.liveBroadcastContent === "live"
    );
    if (live) {
      const viewers = Number(live.liveStreamingDetails?.concurrentViewers);
      return {
        isLive: true,
        title: decodeHtmlEntities(live.snippet?.title || ""),
        videoId: live.id,
        viewerCount: Number.isFinite(viewers) ? viewers : undefined,
      };
    }
  } catch (e) {
    console.error("Error fetching YouTube live status:", e);
  }
  return { isLive: false };
}

