import React, { useState, useEffect, useCallback } from 'react';
import { storesAPI } from '../api/stores';
import AddStoreModal from '../components/admin/AddStoreModal';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Store,
  PlusCircle,
  Search,
  ArrowUpDown,
  Mail,
  MapPin,
  User,
  Star,
  X,
} from 'lucide-react';

export const AdminStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

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

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200/80 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Store className="w-8 h-8 text-brand-600" />
            <span>Store Registry & Directory</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor registered stores, review assigned business owners, and track overall ratings
          </p>
        </div>

        <button
          onClick={() => setIsAddStoreOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 hover:shadow transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Store</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores by name or location..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {stores.length} store{stores.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Retrieving store directory..." />
        ) : stores.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th
                    onClick={() => handleSortToggle('name')}
                    className="py-4 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Store Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortToggle('email')}
                    className="py-4 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Email</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortToggle('address')}
                    className="py-4 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Address</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-6">Store Owner</th>
                  <th
                    onClick={() => handleSortToggle('rating')}
                    className="py-4 px-6 cursor-pointer hover:text-slate-900 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Rating</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <span className="truncate max-w-[200px]">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs max-w-xs truncate">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{s.address}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {s.owner ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.owner.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <StarRating rating={s.overallRating || 0} size="sm" />
                        <span className="font-extrabold text-xs text-slate-800">
                          {s.overallRating !== null ? `${s.overallRating}★` : '—'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({s.totalRatings})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Store className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">No stores found</p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first store or clear your search term.
            </p>
          </div>
        )}
      </div>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onStoreCreated={fetchStores}
      />
    </div>
  );
};

export default AdminStoresPage;
