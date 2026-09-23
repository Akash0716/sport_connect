import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">{label}</p>
      </div>
    );
  }

  return (
    <div className="py-8 flex flex-col items-center justify-center gap-2">
      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
