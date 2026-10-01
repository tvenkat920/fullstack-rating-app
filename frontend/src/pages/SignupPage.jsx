import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PasswordRequirements from '../components/common/PasswordRequirements';
import { Star, Mail, Lock, User, MapPin, Eye, EyeOff, Loader2 } from 'lucide-react';

export const SignupPage = () => {
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
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

  const validate = () => {
    const errs = [];
    const nameTrimmed = formData.name.trim();
    if (nameTrimmed.length < 20 || nameTrimmed.length > 60) {
      errs.push('Name must be between 20 and 60 characters long.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errs.push('Please enter a valid email address.');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      errs.push('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
    }

    if (formData.address && formData.address.length > 400) {
      errs.push('Address must not exceed 400 characters.');
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setFormErrors(errs);
      return;
    }

    try {
      setLoading(true);
      const newUser = await signup(formData);
      success(`Welcome to RateMate, ${newUser.name}! Your account has been created.`);
      navigate('/');
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      if (backendErrors && Array.isArray(backendErrors)) {
        setFormErrors(backendErrors);
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
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/30 mb-3">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join RateMate to review stores and help others
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
              {formErrors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <span
                className={`text-[11px] font-medium ${
                  formData.name.trim().length >= 20 && formData.name.trim().length <= 60
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {formData.name.trim().length}/60 chars (min 20)
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Jonathan Christopher Miller"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

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
                placeholder="8-16 chars, 1 uppercase, 1 special character"
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

          {/* Live password checklist */}
          <PasswordRequirements password={formData.password} />

          {/* Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Address (Optional)
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.address.length}/400 chars
              </span>
            </div>
            <div className="relative">
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter physical address (up to 400 characters)"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors resize-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-md shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? 'Creating Account...' : 'Register as Normal User'}</span>
          </button>
        </form>

        {/* Footer link to sign in */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
