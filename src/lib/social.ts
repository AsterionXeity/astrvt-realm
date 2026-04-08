export async function getYouTubeSubs(link: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;
  
  const handleMatch = link.match(/@([^/?]+)/);
  if (!handleMatch) return null;
  const handle = handleMatch[1];
  
  try {
    const searchRes = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${apiKey}`, { next: { revalidate: 3600 } });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const channelId = searchData.items?.[0]?.snippet?.channelId;
    if (!channelId) return null;

    const statsRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`, { next: { revalidate: 3600 } });
    if (!statsRes.ok) return null;
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
  if (!clientId || !clientSecret) return null;
  
  const loginMatch = link.match(/twitch\.tv\/([^/?]+)/);
  if (!loginMatch) return null;
  const login = loginMatch[1];

  try {
    const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: "POST", next: { revalidate: 3600 } });
    if (!tokenRes.ok) return null;
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
      headers: {
        "Client-Id": clientId,
        "Authorization": `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    });
    if (!userRes.ok) return null;
    const userData = await userRes.json();
    const userId = userData.data?.[0]?.id;
    if (!userId) return null;

    const followRes = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
      headers: {
        "Client-Id": clientId,
        "Authorization": `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    });
    if (!followRes.ok) return null;
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
