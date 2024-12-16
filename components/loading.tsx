// components/Loading.tsx

import React from "react";

export default function Loading() {
  return (
    <div className="h-screen bg-neutral-400 flex justify-center items-center">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="mb-16">
          <div className="spinner border-4 border-t-4 border-neutral-600 rounded-full w-14 h-14 animate-spin"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    </div>
  );
}
