import React, { useState } from 'react';
import Modal from '../common/Modal';

const CreateSportModal = ({ isOpen, onClose, onSave, isSubmitting }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Sport name is required.');
      return;
    }
    setError('');
    onSave({ name: name.trim(), description: description.trim() }, () => {
      setName('');
      setDescription('');
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Sport (Admin)" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
            Sport Name <span className="text-emerald-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Squash, Pickleball, Swimming..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {error && <p className="text-xs text-rose-400 font-bold mt-1.5">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of match rules or court requirements..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? 'Creating...' : 'Create Sport'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSportModal;
