import React from 'react';

function Statscard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl shadow-lg p-8 text-white min-w-[220px] text-center transition-transform font-sans">
      <h3 className="mb-2 text-xl font-semibold tracking-wide">{title}</h3>
      <p className="m-0 text-4xl font-bold tracking-wider">{value}</p>
    </div>
  );
}

export default Statscard;
