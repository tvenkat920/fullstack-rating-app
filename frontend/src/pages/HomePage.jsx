import React, { useState, useEffect, useCallback } from 'react';
import { storesAPI } from '../api/stores';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StoreCard from '../components/stores/StoreCard';
import RateStoreModal from '../components/stores/RateStoreModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Store as StoreIcon, Star, Sparkles, X } from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated, isNormalUser } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const [selectedStoreToRate, setSelectedStoreToRate] = useState(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      const res = await storesAPI.getStores({
        search: debouncedSearch,
        sortBy,
        order,
      });
      if (res.success && res.data) {
        setStores(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRateClick = (store) => {
    if (!isAuthenticated) {
      info('Please sign in as a user to submit or modify store ratings.');
      navigate('/login');
      return;
    }
    if (!isNormalUser) {
      info('Only regular customer accounts can submit ratings for stores.');
      return;
    }
    setSelectedStoreToRate(store);
    setIsRateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200/60 pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-bold tracking-wide mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community-Driven Store Reviews</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Discover Great Places,{' '}
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              Share Real Experiences
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Browse verified stores, explore transparent community ratings, and submit your own feedback to help shoppers everywhere.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/80 p-2 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by store name or address..."
                className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Controls: Total Count & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/60 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Available Stores</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {stores.length} store{stores.length === 1 ? '' : 's'} registered on the platform
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500">Sort by:</span>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field);
                  setOrder(dir);
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="rating-desc">Rating (Highest First)</option>
                <option value="rating-asc">Rating (Lowest First)</option>
                <option value="address-asc">Address (A → Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <LoadingSpinner size="lg" text="Finding stores near you..." />
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRateClick={handleRateClick}
                isAuthenticated={isAuthenticated}
                isNormalUser={isNormalUser}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/70 p-8 shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <StoreIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {searchTerm
                ? `No stores matched "${searchTerm}". Try checking your spelling or clear search filters.`
                : 'There are currently no stores available in the system.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      <RateStoreModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        store={selectedStoreToRate}
        onRatingUpdated={fetchStores}
      />
    </div>
  );
};

export default HomePage;
