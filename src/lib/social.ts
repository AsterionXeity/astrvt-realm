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
    const searchRes = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${apiKey}`, { cache: 'no-store' });
    if (!searchRes.ok) {
      console.error("YouTube Search API Error:", searchRes.status, await searchRes.text());
      return null;
    }
    const searchData = await searchRes.json();
    const channelId = searchData.items?.[0]?.snippet?.channelId;
    if (!channelId) return null;

    const statsRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`, { cache: 'no-store' });
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
    const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: "POST", cache: 'no-store' });
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
      cache: 'no-store'
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
      cache: 'no-store'
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
