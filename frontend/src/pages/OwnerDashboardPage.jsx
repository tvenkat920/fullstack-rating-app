import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../api/owner';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Store,
  Star,
  Users,
  Calendar,
  Mail,
  MapPin,
  TrendingUp,
  MessageSquare,
  Award,
} from 'lucide-react';

export const OwnerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);
      const res = await ownerAPI.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load store owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="pb-8 border-b border-slate-200/80 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/70 mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Store Owner Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Store Performance & Customer Feedback
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your customer satisfaction scores and read all submitted ratings in real-time
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading your store analytics..." />
      ) : !data?.hasStore ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Store Assigned Yet</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Your account is verified as a Store Owner, but an administrator has not yet assigned a store to your profile. Please contact the platform admin to link your business.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Store Info Banner & Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {data.store.name}
                </h2>
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{data.store.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{data.store.address}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                Registered storefront on RateMate
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Average Customer Rating
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                      {data.averageRating !== null ? data.averageRating : '—'}
                    </span>
                    <span className="text-lg font-bold text-slate-400">/ 5.0</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <StarRating rating={data.averageRating || 0} size="md" />
                <span className="text-xs font-bold text-amber-600">
                  {data.averageRating >= 4
                    ? 'Excellent reputation'
                    : data.averageRating >= 3
                    ? 'Average satisfaction'
                    : data.averageRating !== null
                    ? 'Needs improvement'
                    : 'Awaiting reviews'}
                </span>
              </div>
            </div>

            {/* Total Ratings Count Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Customer Reviews
                  </p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-2">
                    {data.totalRatings}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Unique customer ratings</span>
                <span className="font-bold text-brand-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live Feedback
                </span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Customer Ratings Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed review history from customers who visited your store
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {data.ratings.length} Entries
              </span>
            </div>

            {data.ratings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Customer Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Rating Given</th>
                      <th className="py-4 px-6 text-right">Date Reviewed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.ratings.map((review) => (
                      <tr key={review.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-brand-600 flex items-center justify-center text-xs font-extrabold uppercase shrink-0">
                              {review.userName.slice(0, 2)}
                            </div>
                            <span className="truncate max-w-[200px]">{review.userName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          <span className="truncate max-w-[200px]">{review.userEmail}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="font-extrabold text-xs text-slate-800">
                              {review.rating}★
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-xs text-slate-500 font-medium">
                          {new Date(review.updatedAt || review.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-700">No ratings yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When customers rate your store on RateMate, their scores and review timestamps will appear right here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboardPage;
