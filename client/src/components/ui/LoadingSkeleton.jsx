import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="space-y-3 pt-4">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="h-4 bg-slate-200 rounded w-1/5" />
              <div className="h-4 bg-slate-200 rounded w-2/5" />
              <div className="h-4 bg-slate-200 rounded w-1/5" />
              <div className="h-4 bg-slate-200 rounded w-1/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(count || 4)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
          <div className="pt-4 flex justify-between items-center">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-9 bg-slate-200 rounded-xl w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};
