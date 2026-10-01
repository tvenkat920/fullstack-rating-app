import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api/admin';
import AddUserModal from '../components/admin/AddUserModal';
import AddStoreModal from '../components/admin/AddStoreModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200/80 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            System Overview & Metrics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time platform statistics, user accounts, and store management
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs hover:border-slate-300 transition-all"
          >
            <UserPlus className="w-4 h-4 text-brand-600" />
            <span>Add User</span>
          </button>
          <button
            onClick={() => setIsAddStoreOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 hover:shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Store</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading administrative metrics..." />
      ) : (
        <div className="space-y-10">
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Registered Users
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Admins, Owners & Users</span>
                <Link
                  to="/admin/users"
                  className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Total Stores */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Active Stores
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                    {stats.totalStores}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Verified storefronts</span>
                <Link
                  to="/admin/stores"
                  className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Total Ratings */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Ratings Submitted
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                    {stats.totalRatings}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Community feedback</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Management Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Users section card */}
            <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">User Directory</h3>
                    <p className="text-xs text-slate-500">
                      Search, inspect, and register users across all roles
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  View individual user information, filter by roles (Admin, User, Store Owner), inspect store owner customer feedback, and add new verified platform members.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60">
                <Link
                  to="/admin/users"
                  className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Browse Users Table
                </Link>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-2xs"
                >
                  + Add User
                </button>
              </div>
            </div>

            {/* Stores section card */}
            <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Store Management</h3>
                    <p className="text-xs text-slate-500">
                      Review registered stores and create new store profiles
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Maintain the directory of local businesses, manage assigned store owners, monitor average ratings, and ensure business records stay up to date.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60">
                <Link
                  to="/admin/stores"
                  className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Browse Stores Table
                </Link>
                <button
                  onClick={() => setIsAddStoreOpen(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  + Add Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={fetchStats}
      />

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onStoreCreated={fetchStats}
      />
    </div>
  );
};

export default AdminDashboardPage;
