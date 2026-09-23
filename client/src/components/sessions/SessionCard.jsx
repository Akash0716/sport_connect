import React from 'react';
import { Calendar, Clock, MapPin, User, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SessionCard = ({ session, onJoin, onViewDetails, onCancel, isJoining = false }) => {
  const { user } = useAuth();

  const {
    id,
    sport,
    creator,
    date,
    startTime,
    venue,
    additionalPlayersNeeded,
    status,
    cancellationReason,
    participants = [],
    isPast,
    remainingSlots,
    totalSlots,
  } = session;

  const isCreator = user?.id === creator?.id;
  const isJoined = user ? participants.some((p) => p.userId === user.id) : false;

  // Status badges mapping
  let statusBadge = (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      OPEN
    </span>
  );

  if (status === 'CANCELLED') {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <AlertCircle className="w-3.5 h-3.5" />
        CANCELLED
      </span>
    );
  } else if (isPast) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
        COMPLETED
      </span>
    );
  } else if (status === 'FULL' || remainingSlots === 0) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        FULL
      </span>
    );
  }

  // Determine Join Button Actionability
  const canJoin = !isCreator && !isJoined && status !== 'CANCELLED' && !isPast && remainingSlots > 0;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between relative group hover:shadow-2xl hover:shadow-emerald-500/5">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {sport?.name || 'Sport'}
              </span>
              <h4 className="text-lg font-extrabold text-white tracking-tight line-clamp-1">{venue}</h4>
            </div>
          </div>
          {statusBadge}
        </div>

        {/* Cancellation Notice Banner if Cancelled */}
        {status === 'CANCELLED' && cancellationReason && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <span className="font-bold">Cancellation Reason: </span>
            {cancellationReason}
          </div>
        )}

        {/* Session Meta Info */}
        <div className="space-y-2.5 my-4 py-3 border-y border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium text-slate-200">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium text-slate-200">{startTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium text-slate-200 truncate">{venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-400">
              Created by <strong className="text-slate-200">{creator?.name}</strong>
            </span>
          </div>
        </div>

        {/* Participants & Slot Status */}
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Players:</span>
            <div className="flex -space-x-2 overflow-hidden">
              {participants.slice(0, 4).map((p, idx) => (
                <div
                  key={p.id || idx}
                  title={p.user?.name}
                  className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-emerald-400 uppercase"
                >
                  {p.user?.name ? p.user.name.charAt(0) : '?'}
                </div>
              ))}
              {participants.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-200">
                  +{participants.length - 4}
                </div>
              )}
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            {remainingSlots > 0 ? (
              <span className="text-emerald-400">{remainingSlots} slot(s) left</span>
            ) : (
              <span className="text-amber-400">Full ({totalSlots}/{totalSlots})</span>
            )}
          </span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onViewDetails(session)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors text-center"
        >
          View Details
        </button>

        {isCreator && status !== 'CANCELLED' && !isPast && (
          <button
            onClick={() => onCancel(session)}
            className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors"
          >
            Cancel Session
          </button>
        )}

        {canJoin && (
          <button
            onClick={() => onJoin(id)}
            disabled={isJoining}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 text-center"
          >
            {isJoining ? 'Joining...' : 'Join Match'}
          </button>
        )}

        {isJoined && !isCreator && (
          <span className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Joined
          </span>
        )}

        {!canJoin && !isJoined && !isCreator && (
          <span className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-slate-400 font-extrabold text-xs border border-slate-800 text-center">
            {status === 'CANCELLED'
              ? 'Cancelled'
              : isPast
              ? 'Session Passed'
              : remainingSlots === 0
              ? 'Session Full'
              : 'Unavailable'}
          </span>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
