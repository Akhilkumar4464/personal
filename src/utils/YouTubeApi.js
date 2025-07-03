const API_KEY = 'AIzaSyDiW4rfz2LWwDVeIvC6ux1NBCyqlyk7K1I';
const CHANNEL_ID = 'UCHS2nXpt5ajujLIOiyL0Crg';

let API_URL = "";
if (API_KEY && CHANNEL_ID) {
  API_URL = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
} else {
  console.log("Missing API_KEY or CHANNEL_ID environment variable.");
}

export async function fetchChannelData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.log(
        `YouTube API error: HTTP ${res.status} - ${res.statusText}`
      );
      return null;
    }
    const data = await res.json();

    console.log("YouTube API response:", data);

    if (!data.items || data.items.length === 0) {
      console.log("YouTube API log: No items found in response");
      return null;
    }

    const stats = data.items[0].statistics;
    const snippet = data.items[0].snippet;

    return {
      title: snippet.title,
      thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "",
      subscriberCount: stats.subscriberCount,
      viewCount: stats.viewCount,
      videoCount: stats.videoCount,
    };
  } catch (error) {
    console.log("YouTube API error:", error);
    return null;
  }
}


export async function fetchAllVideos(pageToken = '') {
  // Fetch all videos from uploads playlist with details
  try {
    // First get uploads playlist ID
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
    if (!channelRes.ok) {
      console.log(`YouTube API error: HTTP ${channelRes.status} - ${channelRes.statusText}`);
      return { videos: [], nextPageToken: null };
    }
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch videos from uploads playlist
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`);
    if (!playlistRes.ok) {
      console.log(`YouTube API error: HTTP ${playlistRes.status} - ${playlistRes.statusText}`);
      return { videos: [], nextPageToken: null };
    }
    const playlistData = await playlistRes.json();

    // Extract video IDs to fetch durations
    const videoIds = playlistData.items.map(item => item.contentDetails.videoId).join(',');

    // Fetch video details including duration
    const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`);
    if (!videosRes.ok) {
      console.log(`YouTube API error: HTTP ${videosRes.status} - ${videosRes.statusText}`);
      return { videos: [], nextPageToken: null };
    }
    const videosData = await videosRes.json();

    // Map videos with details
    const videos = videosData.items.map(video => ({
      id: video.id,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.medium.url,
      duration: video.contentDetails.duration,
      publishedAt: video.snippet.publishedAt,
    }));

    return { videos, nextPageToken: playlistData.nextPageToken || null };
  } catch (error) {
    console.log("YouTube Videos fetch error:", error);
    return { videos: [], nextPageToken: null };
  }
}

export async function fetchShortsVideos(pageToken = '') {
  // Fetch videos from uploads playlist with duration, filter shorts (duration < 60 seconds)
  try {
    // First get uploads playlist ID
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
    if (!channelRes.ok) {
      console.log(`YouTube API error: HTTP ${channelRes.status} - ${channelRes.statusText}`);
      return { videos: [], nextPageToken: null };
    }
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch videos from uploads playlist
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`);
    if (!playlistRes.ok) {
      console.log(`YouTube API error: HTTP ${playlistRes.status} - ${playlistRes.statusText}`);
      return { videos: [], nextPageToken: null };
    }
    const playlistData = await playlistRes.json();

    // Extract video IDs to fetch durations
    const videoIds = playlistData.items.map(item => item.contentDetails.videoId).join(',');

    // Fetch video details including duration
    const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`);
    if (!videosRes.ok) {
      console.log(`YouTube API error: HTTP ${videosRes.status} - ${videosRes.statusText}`);
      return { videos: [], nextPageToken: null };
    }
    const videosData = await videosRes.json();

    // Filter shorts (duration < 60 seconds)
    const shorts = videosData.items.filter(video => {
      const duration = video.contentDetails.duration; // ISO 8601 duration
      // Convert ISO 8601 duration to seconds
      const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return false;
      const minutes = parseInt(match[1] || '0', 10);
      const seconds = parseInt(match[2] || '0', 10);
      const totalSeconds = minutes * 60 + seconds;
      return totalSeconds < 60;
    }).map(video => ({
      id: video.id,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.medium.url,
      duration: video.contentDetails.duration,
      publishedAt: video.snippet.publishedAt,
    }));

    return { videos: shorts, nextPageToken: playlistData.nextPageToken || null };
  } catch (error) {
    console.log("YouTube Shorts fetch error:", error);
    return { videos: [], nextPageToken: null };
  }
}
