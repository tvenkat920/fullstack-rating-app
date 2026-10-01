import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import {
  Store,
  Users,
  LayoutDashboard,
  LogOut,
  KeyRound,
  LogIn,
  UserPlus,
  Shield,
  Briefcase,
  User as UserIcon,
  Menu,
  X,
  Star,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const roleBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          <Shield className="w-3 h-3" /> Admin
        </span>
      );
    }
    if (isOwner) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Briefcase className="w-3 h-3" /> Store Owner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <UserIcon className="w-3 h-3" /> User
      </span>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                  <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                    Rate<span className="text-brand-600">Mate</span>
                  </span>
                  <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Platform
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Stores Directory</span>
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/admin/dashboard')
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Overview</span>
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/admin/users')
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Users</span>
                    </Link>
                    <Link
                      to="/admin/stores"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive('/admin/stores')
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Store Admin</span>
                    </Link>
                  </>
                )}

                {isOwner && (
                  <Link
                    to="/owner/dashboard"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive('/owner/dashboard')
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Store Ratings</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Action Area */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 pl-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
                      {user?.name ? user.name.slice(0, 2) : 'US'}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                        {user?.name}
                      </span>
                      {roleBadge()}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Change Password"
                    aria-label="Change Password"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20 transition-all hover:shadow"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-slate-100 bg-white">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Store className="w-4 h-4 text-slate-500" />
              <span>Stores Directory</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Admin Overview</span>
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/admin/stores"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Store className="w-4 h-4 text-slate-500" />
                  <span>Manage Stores</span>
                </Link>
              </>
            )}

            {isOwner && (
              <Link
                to="/owner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>My Store Ratings</span>
              </Link>
            )}

            <div className="pt-3 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1">
                    <span className="text-xs font-bold text-slate-700">{user?.name}</span>
                    {roleBadge()}
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPasswordModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Change Password Dialog */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
