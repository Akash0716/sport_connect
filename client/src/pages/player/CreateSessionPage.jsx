import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sportService, sessionService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, MapPin, Users, PlusCircle, ArrowLeft } from 'lucide-react';

const CreateSessionPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);

  // Form Fields
  const [sportId, setSportId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [venue, setVenue] = useState('');
  const [additionalPlayersNeeded, setAdditionalPlayersNeeded] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSports = async () => {
      try {
        const res = await sportService.getAll();
        setSports(res.data.data);
        if (res.data.data.length > 0) {
          setSportId(res.data.data[0].id);
        }
      } catch (err) {
        toast.error('Failed to load available sports.');
      } finally {
        setLoadingSports(false);
      }
    };

    loadSports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sportId || !date || !startTime || !venue.trim() || !additionalPlayersNeeded) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    // Client-side date check
    const selectedDateTime = new Date(`${date}T${startTime}`);
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime.getTime() < Date.now()) {
      setError('Session date and time must be set in the future.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await sessionService.create({
        sportId,
        date,
        startTime,
        venue: venue.trim(),
        additionalPlayersNeeded: parseInt(additionalPlayersNeeded, 10),
      });

      toast.success('Match session created successfully!');
      navigate('/my-sessions');
    } catch (err) {
      setError(err.message || 'Failed to create session.');
      toast.error(err.message || 'Failed to create session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white">Organize New Sport Session</h1>
          <p className="text-xs text-slate-400 mt-0.5">Post a match and invite players to join your roster</p>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sport Selection */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Select Sport <span className="text-emerald-400">*</span>
            </label>
            {loadingSports ? (
              <p className="text-xs text-slate-400">Loading sports catalog...</p>
            ) : (
              <select
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {sports.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} {sp.description ? `- ${sp.description}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Match Date <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Start Time (HH:mm 24hr) <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Venue Location */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Venue / Location <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Campus Outdoor Football Turf / Court A"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Additional Players Needed */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              Additional Players Needed <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <Users className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max="50"
                required
                value={additionalPlayersNeeded}
                onChange={(e) => setAdditionalPlayersNeeded(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Total session capacity will be{' '}
              <strong className="text-emerald-400">{parseInt(additionalPlayersNeeded || 0, 10) + 1} players</strong>{' '}
              (including yourself as host).
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing Session...' : 'Publish Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;
