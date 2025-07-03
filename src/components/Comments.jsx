
import React, { useEffect, useState } from "react";

const API_KEY = 'AIzaSyDiW4rfz2LWwDVeIvC6ux1NBCyqlyk7K1I';
const CHANNEL_ID = 'UCHS2nXpt5ajujLIOiyL0Crg';

function Comments() {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  // Helper function to fetch channel data (including videoCount)
  async function fetchChannelData() {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        return {
          videoCount: parseInt(data.items[0].statistics.videoCount, 10)
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function loadComments() {
      setLoading(true);

      // Helper function to fetch uploads playlist ID
      async function fetchUploadsPlaylistId() {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const data = await res.json();
          return data.items[0].contentDetails.relatedPlaylists.uploads;
        } catch {
          return null;
        }
      }

      // Helper function to fetch latest video ID from uploads playlist
      async function fetchLatestVideoId(playlistId) {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=1&key=${API_KEY}`;
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const data = await res.json();
          return data.items[0].snippet.resourceId.videoId;
        } catch {
          return null;
        }
      }

      // Fetch all comments with pagination
      async function fetchAllComments(videoId) {
        let allComments = [];
        let nextPageToken = '';
        do {
          const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&pageToken=${nextPageToken}&key=${API_KEY}`;
          const res = await fetch(url);
          if (!res.ok) break;
          const data = await res.json();
          const comments = data.items.map(item => ({
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
            text: item.snippet.topLevelComment.snippet.textDisplay,
          }));
          allComments = allComments.concat(comments);
          nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);
        return allComments;
      }

      // First fetch channel data to get latest video ID
      const channelData = await fetchChannelData();
      if (channelData && channelData.videoCount > 0) {
        const uploadsPlaylistId = await fetchUploadsPlaylistId();
        if (uploadsPlaylistId) {
          const latestVideoId = await fetchLatestVideoId(uploadsPlaylistId);
          if (latestVideoId) {
            const commentsData = await fetchAllComments(latestVideoId);
            setComments(commentsData);
          }
        }
      }
      setLoading(false);
    }

    loadComments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, idx) => (
            <li key={idx} className="flex items-start space-x-3 bg-gray-50 p-3 rounded">
              <img
                src={comment.authorProfileImageUrl}
                alt={comment.author}
                width={32}
                height={32}
                className="rounded-full border border-gray-300"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <strong className="text-gray-800">{comment.author}</strong>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.publishedAt).toLocaleString()}
                  </span>
                </div>
                <span
                  className="block mt-1 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;
