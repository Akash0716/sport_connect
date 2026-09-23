import React, { useState, useEffect } from 'react';
import { sessionService, sportService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SessionCard from '../../components/sessions/SessionCard';
import SessionDetailsModal from '../../components/sessions/SessionDetailsModal';
import CancelSessionModal from '../../components/sessions/CancelSessionModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search, Filter, Calendar, RefreshCw } from 'lucide-react';

const BrowseSessionsPage = () => {
  const toast = useToast();

  const [sessions, setSessions] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals state
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const [joiningId, setJoiningId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchSports = async () => {
    try {
      const res = await sportService.getAll();
      setSports(res.data.data);
    } catch (err) {
      console.error('Failed to load sports list:', err);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedSport) params.sportId = selectedSport;
      if (selectedDate) params.date = selectedDate;
      if (selectedStatus) params.status = selectedStatus;
      params.sort = sortOrder;

      const res = await sessionService.getAll(params);
      setSessions(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [selectedSport, selectedDate, selectedStatus, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSport('');
    setSelectedDate('');
    setSelectedStatus('');
    setSortOrder('asc');
  };

  const handleJoin = async (sessionId) => {
    setJoiningId(sessionId);
    try {
      await sessionService.join(sessionId);
      toast.success('Successfully joined the sport match!');
      fetchSessions();
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
      fetchSessions();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel session.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white">Available Sports Sessions</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore upcoming matches hosted by fellow players, filter by sport or venue, and join open slots.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by venue, sport name, or creator..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          {/* Sport Filter */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Sports</option>
              {sports.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open Only</option>
              <option value="FULL">Full Only</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Sort By Date</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="asc">Earliest First</option>
              <option value="desc">Latest First</option>
            </select>
          </div>
        </div>

        {/* Filter Reset */}
        {(selectedSport || selectedDate || selectedStatus || searchQuery) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:underline font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <LoadingSpinner fullPage label="Searching available matches..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No Sessions Match Your Search"
          description="Try resetting your search query or date filters to find open matches."
          action={
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
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

export default BrowseSessionsPage;
