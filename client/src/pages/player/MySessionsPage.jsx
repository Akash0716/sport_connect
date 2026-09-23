import React, { useState, useEffect } from 'react';
import { sessionService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SessionCard from '../../components/sessions/SessionCard';
import SessionDetailsModal from '../../components/sessions/SessionDetailsModal';
import CancelSessionModal from '../../components/sessions/CancelSessionModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Trophy, CheckCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MySessionsPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'joined'

  const [createdSessions, setCreatedSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const [cancelling, setCancelling] = useState(false);

  const fetchMySessions = async () => {
    setLoading(true);
    try {
      const [createdRes, joinedRes] = await Promise.all([
        sessionService.getMyCreated(),
        sessionService.getMyJoined(),
      ]);

      setCreatedSessions(createdRes.data.data);
      setJoinedSessions(joinedRes.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch your sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySessions();
  }, []);

  const handleConfirmCancel = async (cancellationReason) => {
    if (!sessionToCancel) return;
    setCancelling(true);
    try {
      await sessionService.cancel(sessionToCancel.id, { cancellationReason });
      toast.success('Session cancelled successfully.');
      setIsCancelOpen(false);
      setSessionToCancel(null);
      fetchMySessions();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel session.');
    } finally {
      setCancelling(false);
    }
  };

  const displayedSessions = activeTab === 'created' ? createdSessions : joinedSessions;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white">My Sport Sessions</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage match sessions you have organized and track sessions you are participating in.
        </p>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('created')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            activeTab === 'created'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>My Created Sessions ({createdSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
            activeTab === 'joined'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>My Joined Sessions ({joinedSessions.length})</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner fullPage label="Loading your session history..." />
      ) : displayedSessions.length === 0 ? (
        <EmptyState
          title={activeTab === 'created' ? 'No Sessions Created Yet' : 'No Sessions Joined Yet'}
          description={
            activeTab === 'created'
              ? 'You have not hosted any sport sessions yet. Host a session and invite players!'
              : 'You have not joined any upcoming matches yet. Browse available sessions and sign up!'
          }
          action={
            <Link
              to={activeTab === 'created' ? '/create-session' : '/sessions'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              {activeTab === 'created' ? 'Create a Session' : 'Browse Sessions'}
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onJoin={() => {}}
              onViewDetails={(s) => {
                setSelectedSession(s);
                setIsDetailsOpen(true);
              }}
              onCancel={(s) => {
                setSessionToCancel(s);
                setIsCancelOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SessionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        session={selectedSession}
        onJoin={() => {}}
      />

      <CancelSessionModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        isCancelling={cancelling}
      />
    </div>
  );
};

export default MySessionsPage;
