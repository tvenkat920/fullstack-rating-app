import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import StarRating from '../common/StarRating';
import { storesAPI } from '../../api/stores';
import { useToast } from '../../context/ToastContext';
import { Star, Loader2, Check } from 'lucide-react';

export const RateStoreModal = ({ isOpen, onClose, store, onRatingUpdated }) => {
  const { success, error } = useToast();
  const [selectedRating, setSelectedRating] = useState(store?.userRating || 5);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(store?.userRating);

  useEffect(() => {
    if (store?.userRating) {
      setSelectedRating(store.userRating);
    } else {
      setSelectedRating(5);
    }
  }, [store]);

  if (!store) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      error('Please select a star rating between 1 and 5');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await storesAPI.modifyRating(store.id, selectedRating);
        success(`Your rating for "${store.name}" has been updated to ${selectedRating} stars!`);
      } else {
        await storesAPI.submitRating(store.id, selectedRating);
        success(`Thank you! You rated "${store.name}" ${selectedRating} stars.`);
      }
      if (onRatingUpdated) {
        onRatingUpdated();
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit rating';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Modify Rating for ${store.name}` : `Rate ${store.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select your rating (1 to 5 stars)
          </p>
          <div className="flex justify-center my-3">
            <StarRating
              rating={selectedRating}
              interactive={true}
              size="xl"
              onChange={(val) => setSelectedRating(val)}
            />
          </div>
          <p className="text-base font-bold text-slate-800">
            {selectedRating === 5 && 'Outstanding - 5 Stars'}
            {selectedRating === 4 && 'Very Good - 4 Stars'}
            {selectedRating === 3 && 'Average - 3 Stars'}
            {selectedRating === 2 && 'Below Average - 2 Stars'}
            {selectedRating === 1 && 'Poor - 1 Star'}
          </p>
        </div>

        <div className="text-xs text-slate-500 text-center">
          {isEditing
            ? `Your previous rating was ${store.userRating} star${store.userRating > 1 ? 's' : ''}. Selecting a new score will replace it.`
            : 'You can modify your submitted rating at any time in the future.'}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isEditing ? 'Update Rating' : 'Submit Rating'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RateStoreModal;
