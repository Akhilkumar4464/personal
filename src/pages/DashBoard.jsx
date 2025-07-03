import { useEffect, useState } from "react";
import { fetchChannelData} from "../utils/YouTubeApi";
import Header from "../components/Header";
import StatsCard from "../components/Statscard";
import CommentsFeed from "../components/Comments";
 

export default function DashBoard() {
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchChannelData();
      setChannelData(data);
    };

    loadData();
    const interval = setInterval(loadData, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, []); // Removed setChannelData from dependencies

  if (!channelData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 px-4 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Header channelName={channelData.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatsCard
            title="Subscribers"
            value={channelData.subscriberCount}
            className="bg-white shadow rounded-lg p-6"
          />
          <StatsCard
            title="Total Views"
            value={channelData.viewCount}
            className="bg-white shadow rounded-lg p-6"
          />
          <StatsCard
            title="Total Videos"
            value={channelData.videoCount}
            className="bg-white shadow rounded-lg p-6"
          />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Comments</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <CommentsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
