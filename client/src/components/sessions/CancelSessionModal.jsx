import React, { useState } from 'react';
import Modal from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

const CancelSessionModal = ({ isOpen, onClose, onConfirm, isCancelling }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }
    if (reason.trim().length < 5) {
      setError('Reason must be at least 5 characters long.');
      return;
    }

    setError('');
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cancel Sport Session" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            Cancelling this session will inform all joined players and mark the match as cancelled in their session history.
          </p>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
            Cancellation Reason <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Weather forecast rain warning / Not enough players available..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-rose-500 transition-colors"
          />
          {error && <p className="text-xs text-rose-400 font-bold mt-1.5">{error}</p>}
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Keep Session
          </button>
          <button
            type="submit"
            disabled={isCancelling}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/20"
          >
            {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CancelSessionModal;
