import React, { useState } from 'react';
import Modal from '../common/Modal';
import PasswordRequirements from '../common/PasswordRequirements';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);

    const errors = [];
    if (!formData.currentPassword) {
      errors.push('Current password is required.');
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      errors.push('New password must be 8-16 characters and contain at least one uppercase letter and one special character.');
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errors.push('New password and confirmation do not match.');
    }
    if (formData.currentPassword === formData.newPassword) {
      errors.push('New password must be different from current password.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(formData);
      if (res.success) {
        success('Password updated successfully! Please use your new password next time.');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
      }
    } catch (err) {
      const errs = err.response?.data?.errors;
      const msg = err.response?.data?.message || err.message || 'Failed to update password';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Change Account Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formErrors.length > 0 && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
            {formErrors.map((err, i) => (
              <p key={i}>• {err}</p>
            ))}
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="8-16 chars, uppercase, special character"
              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <PasswordRequirements password={formData.newPassword} />

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat new password"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
            required
          />
        </div>

        {/* Action Buttons */}
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
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
