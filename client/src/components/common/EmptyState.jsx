import React from 'react';
import { CalendarX } from 'lucide-react';

const EmptyState = ({ title = 'No Sessions Found', description = 'There are no sessions matching your criteria.', action }) => {
  return (
    <div className="glass-card rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto my-6 border border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
        <CalendarX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
