import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sessionService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import SessionCard from '../../components/sessions/SessionCard';
import SessionDetailsModal from '../../components/sessions/SessionDetailsModal';
import CancelSessionModal from '../../components/sessions/CancelSessionModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, PlusCircle, FolderOpen, Flame, Trophy, CheckCircle, ArrowRight } from 'lucide-react';

const PlayerDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [availableSessions, setAvailableSessions] = useState([]);
  const [createdSessions, setCreatedSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const [joiningId, setJoiningId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [allRes, createdRes, joinedRes] = await Promise.all([
        sessionService.getAll(),
        sessionService.getMyCreated(),
        sessionService.getMyJoined(),
      ]);

      setAvailableSessions(allRes.data.data);
      setCreatedSessions(createdRes.data.data);
      setJoinedSessions(joinedRes.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleJoin = async (sessionId) => {
    setJoiningId(sessionId);
    try {
      await sessionService.join(sessionId);
      toast.success('Successfully joined the session!');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Unable to join session.');
    } finally {
      setJoiningId(null);
    }
  };

  const handleConfirmCancel = async (cancellationReason) => {
    if (!sessionToCancel) return;
    setCancelling(true);
    try {
      await sessionService.cancel(sessionToCancel.id, { cancellationReason });
      toast.success('Session cancelled successfully.');
      setIsCancelOpen(false);
      setSessionToCancel(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel session.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Loading your sports dashboard..." />;
  }

  const upcomingMatches = availableSessions.filter((s) => !s.isPast && s.status !== 'CANCELLED');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-emerald-400" />
            Player Overview
          </span>
          <h1 className="text-2xl lg:text-3xl font-black text-white">
            Welcome back, <span className="text-emerald-400">{user?.name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse upcoming matches, organize new sports sessions, and keep track of your registrations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/create-session"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Session</span>
          </Link>
          <Link
            to="/sessions"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Browse Sessions</span>
          </Link>
          <Link
            to="/my-sessions"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>My Sessions</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Matches"
          value={upcomingMatches.length}
          icon={Calendar}
          color="emerald"
          trend="Active"
        />
        <StatCard
          title="Joined Sessions"
          value={joinedSessions.length}
          icon={CheckCircle}
          color="cyan"
        />
        <StatCard
          title="Created Sessions"
          value={createdSessions.length}
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Total Available"
          value={availableSessions.length}
          icon={FolderOpen}
          color="indigo"
        />
      </div>

      {/* Upcoming Sessions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Upcoming Sport Sessions</h2>
            <p className="text-xs text-slate-400">Matches open for player participation</p>
          </div>
          <Link
            to="/sessions"
            className="text-xs font-extrabold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingMatches.length === 0 ? (
          <EmptyState
            title="No Upcoming Matches"
            description="There are currently no upcoming sports sessions scheduled. Be the first to host one!"
            action={
              <Link
                to="/create-session"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                Create Session
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.slice(0, 6).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={handleJoin}
                isJoining={joiningId === session.id}
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
      </div>

      {/* Modals */}
      <SessionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        session={selectedSession}
        onJoin={handleJoin}
        isJoining={joiningId === selectedSession?.id}
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

export default PlayerDashboard;
