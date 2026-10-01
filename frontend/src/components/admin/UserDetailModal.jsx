import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import { adminAPI } from '../../api/admin';
import { User, Mail, MapPin, Shield, Briefcase, Store, Star } from 'lucide-react';

export const UserDetailModal = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchUserDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await adminAPI.getUserById(userId);
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to load user details');
        } finally {
          setLoading(false);
        }
      };
      fetchUserDetails();
    } else {
      setUser(null);
    }
  }, [isOpen, userId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile & Ratings Breakdown" maxWidth="max-w-2xl">
      {loading ? (
        <LoadingSpinner text="Retrieving user information..." />
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-800 rounded-xl text-sm border border-rose-200">
          {error}
        </div>
      ) : user ? (
        <div className="space-y-6">
          {/* Main User Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-md shadow-brand-500/20">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-slate-900 truncate">{user.name}</h4>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    user.role === 'ADMIN'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : user.role === 'STORE_OWNER'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{user.email}</span>
              </div>
              {user.address && (
                <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* If STORE_OWNER, render Store and Ratings breakdown */}
          {user.role === 'STORE_OWNER' && (
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600" />
                <span>Owned Stores & Customer Feedback</span>
              </h5>

              {user.stores && user.stores.length > 0 ? (
                user.stores.map((store) => (
                  <div
                    key={store.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h6 className="font-bold text-slate-800 text-sm">{store.name}</h6>
                        <p className="text-xs text-slate-500">{store.address}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 font-extrabold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>
                          {store.overallRating !== null
                            ? `${store.overallRating} / 5 (${store.totalRatings} ratings)`
                            : 'No ratings'}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown of individual ratings for this store */}
                    {store.ratings && store.ratings.length > 0 ? (
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="text-xs font-semibold text-slate-500 mb-2">
                          Customer Reviews:
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                          {store.ratings.map((r) => (
                            <div
                              key={r.id}
                              className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl"
                            >
                              <div>
                                <span className="font-semibold text-slate-800">
                                  {r.user.name}
                                </span>
                                <span className="text-slate-400 ml-1.5 text-[11px]">
                                  ({r.user.email})
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <StarRating rating={r.rating} size="sm" />
                                <span className="font-bold text-slate-700">{r.rating}★</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl text-center">
                        No customer ratings submitted yet for this store.
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  This user does not currently own any registered stores.
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default UserDetailModal;
