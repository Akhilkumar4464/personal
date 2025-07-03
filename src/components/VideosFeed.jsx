import React, { useEffect, useState } from "react";
import { fetchAllVideos } from "../utils/YouTubeApi";

function VideosFeed() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async (pageToken = '') => {
    setLoading(true);
    setError(null);
    try {
      const { videos: newVideos, nextPageToken: nextToken } = await fetchAllVideos(pageToken);
      setVideos(prev => pageToken ? [...prev, ...newVideos] : newVideos);
      setNextPageToken(nextToken);
    } catch {
      setError("Failed to load videos.");
    }
    setLoading(false);
  };

  const openVideo = (videoId) => {
    setPlayingVideoId(videoId);
  };

  const closeVideo = () => {
    setPlayingVideoId(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">All Videos</h2>
      {loading && <p className="text-center text-gray-500">Loading videos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {videos.map(video => (
          <div key={video.id} className="bg-gray-100 rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer" onClick={() => openVideo(video.id)}>
            <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate" title={video.title}>{video.title}</h3>
              <p className="text-xs text-gray-500">{new Date(video.publishedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
      {nextPageToken && !loading && (
        <div className="text-center mt-4">
          <button
            onClick={() => loadVideos(nextPageToken)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Load More Videos
          </button>
        </div>
      )}

      {/* Video Modal */}
      {playingVideoId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeVideo}>
          <div className="bg-black rounded-lg overflow-hidden max-w-3xl w-full relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-white text-2xl font-bold" onClick={closeVideo}>&times;</button>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideosFeed;
