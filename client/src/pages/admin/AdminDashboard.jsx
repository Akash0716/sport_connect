import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService, sportService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Shield, Trophy, Calendar, Users, BarChart3, PlusCircle, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, sportsRes] = await Promise.all([
        reportService.getStats(),
        sportService.getAll(),
      ]);

      setStats(statsRes.data.data);
      setSports(sportsRes.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch admin overview metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage label="Gathering administrator statistics..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Shield className="w-4 h-4 text-cyan-400" />
            Administrator Control Center
          </span>
          <h1 className="text-2xl lg:text-3xl font-black text-white">Platform Administration Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage dynamic sports, monitor platform session analytics, and supervise user match activity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/sports"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Sports</span>
          </Link>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Analytics Reports</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Dynamic Sports"
          value={stats?.totalSports || 0}
          icon={Trophy}
          color="cyan"
        />
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Matches Scheduled"
          value={stats?.totalSessions || 0}
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Upcoming Sessions"
          value={stats?.upcomingSessions || 0}
          icon={Calendar}
          color="emerald"
          trend="Active"
        />
        <StatCard
          title="Completed Sessions"
          value={stats?.completedSessions || 0}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Cancelled Sessions"
          value={stats?.cancelledSessions || 0}
          icon={Calendar}
          color="rose"
        />
      </div>

      {/* Sports Summary Section */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              Dynamic Sports Catalog ({sports.length})
            </h2>
            <p className="text-xs text-slate-400">Sports created by administrators for player match creation</p>
          </div>
          <Link
            to="/admin/sports"
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {sports.map((sp) => (
            <div
              key={sp.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{sp.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{sp.description || 'Standard rules sport'}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
                {sp._count?.sessions || 0} sessions
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
