import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../api/admin';
import AddUserModal from '../components/admin/AddUserModal';
import UserDetailModal from '../components/admin/UserDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  ArrowUpDown,
  Mail,
  MapPin,
  Shield,
  Briefcase,
  User as UserIcon,
  X,
} from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        name: searchName || undefined,
        email: searchEmail || undefined,
        address: searchAddress || undefined,
        role: roleFilter || undefined,
        sortBy,
        order,
      };
      const res = await adminAPI.getUsers(params);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [searchName, searchEmail, searchAddress, roleFilter, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleViewUser = (id) => {
    setSelectedUserId(id);
    setIsDetailOpen(true);
  };

  const renderRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Briefcase className="w-3 h-3" /> Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserIcon className="w-3 h-3" /> User
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200/80 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-600" />
            <span>User Directory & Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, view details, and register system accounts
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-500/20 hover:shadow transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
          <Filter className="w-3.5 h-3.5 text-brand-600" />
          <span>Search & Filter Directory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Name filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {/* Email filter */}
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {/* Address filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search by address..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {/* Role filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="USER">Normal User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner size="lg" text="Retrieving registered users..." />
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th
                    onClick={() => handleSortToggle('name')}
                    className="py-4 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Full Name</span>
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
                    onClick={() => handleSortToggle('role')}
                    className="py-4 px-6 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role</span>
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
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-600 uppercase shrink-0">
                        {u.name.slice(0, 2)}
                      </div>
                      <span className="truncate max-w-[220px]">{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{renderRoleBadge(u.role)}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs max-w-xs truncate">
                      {u.address || <span className="text-slate-300 italic">Not specified</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleViewUser(u.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">No users match your filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or clearing the role filter.
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={fetchUsers}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        userId={selectedUserId}
      />
    </div>
  );
};

export default AdminUsersPage;
