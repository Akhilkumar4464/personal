const API_KEY ='AIzaSyDiW4rfz2LWwDVeIvC6ux1NBCyqlyk7K1I';
const CHANNEL_ID ='UCHS2nXpt5ajujLIOiyL0Crg';




console.log(
  " API_KEY:",
  API_KEY,
  "CHANNEL_ID:",
  CHANNEL_ID,
  "SECRET_KEY:",

);

let API_URL = "";
if (API_KEY && CHANNEL_ID) {
  API_URL = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=UCHS2nXpt5ajujLIOiyL0Crg&key=AIzaSyDiW4rfz2LWwDVeIvC6ux1NBCyqlyk7K1I`;
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

export async function fetchComments(videoId) {
  const COMMENTS_API_URL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=10&order=relevance`;
  try {
    const res = await fetch(COMMENTS_API_URL);
    if (!res.ok) {
      console.log(
        `YouTube Comments API error: HTTP ${res.status} - ${res.statusText}`
      );
      return [];
    }
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      console.log("YouTube Comments API log: No comments found");
      return [];
    }
    // Extract relevant comment data
    return data.items.map(item => {
      const comment = item.snippet.topLevelComment.snippet;
      return {
        author: comment.authorDisplayName,
        text: comment.textDisplay,
        publishedAt: comment.publishedAt,
        authorProfileImageUrl: comment.authorProfileImageUrl,
      };
    });
  } catch (error) {
    console.log("YouTube Comments API error:", error);
    return [];
  }
}
