// LoadingSkeleton.jsx
import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4 animate-pulse">
        <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Body Skeleton */}
      <div className="space-y-3 pt-4 border-t border-slate-800 animate-pulse">
        <div className="h-3 bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
      </div>

      {/* Button Skeleton */}
      <div className="pt-2 animate-pulse">
        <div className="h-10 bg-indigo-950/50 border border-indigo-900/50 rounded-xl w-full"></div>
      </div>
    </div>
  );
}