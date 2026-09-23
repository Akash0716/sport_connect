import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, Calendar, Trophy, Filter, PieChart as PieChartIcon } from 'lucide-react';

const AdminReportsPage = () => {
  const toast = useToast();

  const [period, setPeriod] = useState('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = { period };
      if (period === 'custom') {
        if (!customStart || !customEnd) {
          setLoading(false);
          return;
        }
        params.customStart = customStart;
        params.customEnd = customEnd;
      }

      const res = await reportService.getAnalytics(params);
      setReportData(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to generate analytics report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom') {
      fetchReports();
    }
  }, [period]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (period === 'custom') {
      fetchReports();
    }
  };

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white">Analytics & Reports (Admin)</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real PostgreSQL database statistics on sports popularity and session activity over time.
        </p>
      </div>

      {/* Time Period Filter Panel */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase text-slate-300">Select Time Horizon</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['7d', '30d', '3m', 'custom'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  period === p
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {p === '7d'
                  ? 'Last 7 Days'
                  : p === '30d'
                  ? 'Last 30 Days'
                  : p === '3m'
                  ? 'Last 3 Months'
                  : 'Custom Range'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Form */}
        {period === 'custom' && (
          <form
            onSubmit={handleCustomSubmit}
            className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-end gap-3"
          >
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                required
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Generate Report
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <LoadingSpinner fullPage label="Calculating database analytics..." />
      ) : (
        <div className="space-y-8">
          {/* Summary Metric */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Sessions Played / Created in Period
              </span>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">
                {reportData?.totalSessionsInPeriod || 0} match session(s)
              </h3>
            </div>
            <div className="text-right text-xs text-slate-400">
              <span>Date Window: </span>
              <strong className="text-slate-200">
                {reportData?.dateRange?.startDate} to {reportData?.dateRange?.endDate}
              </strong>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Sports Popularity */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Popularity of Sports (Session Count)
                </h3>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData?.sportPopularity || []}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="sessionCount" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Status Breakdown */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-cyan-400" />
                  Session Status Breakdown
                </h3>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData?.statusChartData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(reportData?.statusChartData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-slate-300 font-bold">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Popularity Breakdown Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Detailed Sport Popularity Ranking
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-extrabold">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Sport Name</th>
                    <th className="p-3 text-right">Total Sessions in Selected Horizon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {(reportData?.sportPopularity || []).map((sp, idx) => (
                    <tr key={sp.name} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-3 font-bold text-white">{sp.name}</td>
                      <td className="p-3 text-right font-black text-emerald-400">{sp.sessionCount} match(es)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
