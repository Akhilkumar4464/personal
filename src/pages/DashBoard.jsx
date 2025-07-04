import { useEffect, useState } from "react";
import { fetchChannelData } from "../utils/YouTubeApi";
import Header from "../components/Header";
import StatsCard from "../components/Statscard";
import CommentsFeed from "../components/Comments";
import ShortsFeed from "../components/ShortsFeed";
import VideosFeed from "../components/VideosFeed";
import ChannelProgressChart from "../components/ChannelProgressChart";

export default function DashBoard() {
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchChannelData();
        setChannelData(data);
        setError(null);

        setHistory((prevHistory) => {
          const newEntry = {
            timestamp: new Date().toLocaleTimeString(),
            subscriberCount: Number(data.subscriberCount),
            viewCount: Number(data.viewCount),
            videoCount: Number(data.videoCount),
          };
          const updatedHistory = [...prevHistory, newEntry];
          // Keep only last 12 entries
          if (updatedHistory.length > 12) {
            updatedHistory.shift();
          }
          return updatedHistory;
        });
      } catch {
        setError("Failed to load channel data.");
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, []); // Removed setChannelData from dependencies

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  if (!channelData) {
    return <div>Loading...</div>;
  }

  // Prepare data for chart
  const labels = history.map((entry) => entry.timestamp);
  const subscriberData = history.map((entry) => entry.subscriberCount);
  const viewData = history.map((entry) => entry.viewCount);
  const videoData = history.map((entry) => entry.videoCount);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-10 py-10 max-w-6xl mx-auto w-full">
        {/* Header & Stats */}
        <div className="mb-8">
          <Header channelName={channelData.title} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { title: "Subscribers", value: channelData.subscriberCount },
              { title: "Total Views", value: channelData.viewCount },
              { title: "Total Videos", value: channelData.videoCount },
            ].map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                className="bg-gray-800 hover:bg-gray-700 transition rounded-lg p-4 shadow"
              />
            ))}
          </div>
          <ChannelProgressChart
            labels={labels}
            subscriberData={subscriberData}
            viewData={viewData}
            videoData={videoData}
          />
        </div>

        {/* Comments Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-5">Recent Comments</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow p-6">
            <CommentsFeed />
          </div>
        </section>

        {/* Shorts Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-200 mb-5">Latest Shorts</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow p-6">
            <ShortsFeed />
          </div>
        </section>

        {/* Videos Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-200 mb-5">Latest Videos</h2>
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow p-6">
            <VideosFeed />
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-gray-400 text-center py-4 mt-8">
        &copy; {new Date().getFullYear()} code with nitesh sharma . All rights reserved.
      </footer>
    </div>
  );
}
