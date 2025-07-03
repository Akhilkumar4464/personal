export default function Header({ channelName = "YouTube Channel" }) {
  return (
<header className="text-center py-6 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white shadow-lg flex flex-col items-center rounded-3xl">
      <svg xmlns="http://www.w3.org/2000/svg" className="mb-2" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 15l5.19-3L10 9v6zM21.8 7.2c-.2-.7-.8-1.2-1.5-1.3C18.3 5.5 12 5.5 12 5.5s-6.3 0-8.3.4c-.7.1-1.3.6-1.5 1.3-.2.7-.2 2-.2 2s0 1.3.2 2c.2.7.8 1.2 1.5 1.3 2 .4 8.3.4 8.3.4s6.3 0 8.3-.4c.7-.1 1.3-.6 1.5-1.3.2-.7.2-2 .2-2s0-1.3-.2-2z"/>
      </svg>
      <h1 className="text-4xl font-extrabold tracking-wide">{channelName}</h1>
      <p className="text-indigo-200 mt-1 text-lg">Live stats from YouTube Data API</p>
    </header>
  );
}
