import React, { useState, useEffect } from 'react';
import { sportService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CreateSportModal from '../../components/sports/CreateSportModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Trophy, PlusCircle, Trash2, Edit2, ShieldAlert } from 'lucide-react';

const ManageSportsPage = () => {
  const toast = useToast();

  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Mode
  const [editingSport, setEditingSport] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const fetchSports = async () => {
    setLoading(true);
    try {
      const res = await sportService.getAll();
      setSports(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load sports list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleCreateSport = async (data, resetForm) => {
    setIsSubmitting(true);
    try {
      await sportService.create(data);
      toast.success(`Sport "${data.name}" created successfully!`);
      resetForm();
      setIsModalOpen(false);
      fetchSports();
    } catch (err) {
      toast.error(err.message || 'Failed to create sport.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (sport) => {
    setEditingSport(sport);
    setEditName(sport.name);
    setEditDesc(sport.description || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      await sportService.update(editingSport.id, {
        name: editName.trim(),
        description: editDesc.trim(),
      });
      toast.success('Sport updated successfully!');
      setEditingSport(null);
      fetchSports();
    } catch (err) {
      toast.error(err.message || 'Failed to update sport.');
    }
  };

  const handleDeleteSport = async (sport) => {
    if (sport._count?.sessions > 0) {
      toast.error(`Cannot delete "${sport.name}" because it has ${sport._count.sessions} active session(s).`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${sport.name}"?`)) return;

    try {
      await sportService.delete(sport.id);
      toast.success(`Sport "${sport.name}" deleted.`);
      fetchSports();
    } catch (err) {
      toast.error(err.message || 'Failed to delete sport.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white">Manage Sports (Admin)</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create dynamic sport categories available for players to schedule sessions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Sport</span>
        </button>
      </div>

      {/* Inline Edit Form Modal / Box */}
      {editingSport && (
        <form onSubmit={handleSaveEdit} className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-400">Editing Sport: {editingSport.name}</h3>
            <button
              type="button"
              onClick={() => setEditingSport(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Sport Name"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description (optional)"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingSport(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Table / Grid */}
      {loading ? (
        <LoadingSpinner fullPage label="Fetching sports catalog..." />
      ) : sports.length === 0 ? (
        <EmptyState
          title="No Sports Created"
          description="Create your first sport category to allow players to organize sessions."
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Add Sport
            </button>
          }
        />
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Sport Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Created By</th>
                  <th className="p-4 text-center">Sessions Hosted</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {sports.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-cyan-400" />
                      {sp.name}
                    </td>
                    <td className="p-4 text-slate-400">{sp.description || 'N/A'}</td>
                    <td className="p-4 text-slate-400">{sp.creator?.name || 'Admin'}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-bold">
                        {sp._count?.sessions || 0}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(sp)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Sport"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSport(sp)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Sport"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Sport Modal */}
      <CreateSportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSport}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ManageSportsPage;
