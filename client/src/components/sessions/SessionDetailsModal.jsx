import React from 'react';
import Modal from '../common/Modal';
import { Calendar, Clock, MapPin, User, Users, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SessionDetailsModal = ({ isOpen, onClose, session, onJoin, isJoining }) => {
  const { user } = useAuth();
  if (!session) return null;

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
  const canJoin = !isCreator && !isJoined && status !== 'CANCELLED' && !isPast && remainingSlots > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${sport?.name || 'Sport'} Match Details`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Status Header Banner */}
        {status === 'CANCELLED' ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
            <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              SESSION CANCELLED
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              <strong>Reason:</strong> {cancellationReason || 'No reason provided.'}
            </p>
          </div>
        ) : isPast ? (
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold text-center">
            This match session has completed.
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Status</span>
              <h4 className="text-base font-extrabold text-emerald-300">
                {status === 'FULL' ? 'Session Full' : 'Open for Registration'}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">{remainingSlots}</span>
              <span className="text-xs text-slate-400 block font-medium">Slots Remaining</span>
            </div>
          </div>
        )}

        {/* Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Match Date</p>
              <p className="font-bold text-slate-200">{date}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Start Time</p>
              <p className="font-bold text-slate-200">{startTime}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 sm:col-span-2">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Venue Location</p>
              <p className="font-bold text-slate-200">{venue}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 sm:col-span-2">
            <User className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Organizer / Creator</p>
              <p className="font-bold text-slate-200">{creator?.name} ({creator?.email})</p>
            </div>
          </div>
        </div>

        {/* Participant Roster List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Registered Participants ({participants.length} / {totalSlots})
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              Needs {additionalPlayersNeeded} additional player(s)
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {participants.map((p, index) => (
              <div
                key={p.id || index}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    {p.user?.name ? p.user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200">{p.user?.name}</span>
                    {p.user?.id === creator?.id && (
                      <span className="ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        CREATOR
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-slate-400 text-[11px]">
                  {p.joinedAt ? new Date(p.joinedAt).toLocaleDateString() : 'Joined'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Close
          </button>
          {canJoin && (
            <button
              onClick={() => {
                onJoin(id);
                onClose();
              }}
              disabled={isJoining}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              {isJoining ? 'Joining...' : 'Confirm Join Match'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SessionDetailsModal;
