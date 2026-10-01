import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Star, Mail, Lock, Eye, EyeOff, Loader2, Shield, User, Briefcase } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors([]);
  };

  const handleDemoFill = (email, password) => {
    setFormData({ email, password });
    setFormErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);

    if (!formData.email.trim() || !formData.password) {
      setFormErrors(['Please fill in both email and password.']);
      return;
    }

    try {
      setLoading(true);
      const user = await login(formData);
      success(`Welcome back, ${user.name}!`);

      // Determine redirect path
      const fromPath = location.state?.from?.pathname;
      if (fromPath) {
        navigate(fromPath);
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'STORE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const errs = err.response?.data?.errors;
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      if (errs && Array.isArray(errs)) {
        setFormErrors(errs);
      } else {
        setFormErrors([msg]);
      }
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/30 mb-3">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to RateMate
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to access your dashboard and rate stores
          </p>
        </div>

        {/* Demo Fast-Login Helpers */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Quick Demo Accounts (One-Click Auto-Fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@example.com', 'Admin@123')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 transition-colors text-center text-slate-700 hover:text-rose-700"
            >
              <Shield className="w-4 h-4 text-rose-500" />
              <span className="text-[11px] font-bold">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('user@example.com', 'User@123')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors text-center text-slate-700 hover:text-emerald-700"
            >
              <User className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-bold">Normal User</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('owner@example.com', 'Owner@123')}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-colors text-center text-slate-700 hover:text-amber-700"
            >
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-bold">Store Owner</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
              {formErrors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-md shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
          </button>
        </form>

        {/* Footer link to sign up */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
