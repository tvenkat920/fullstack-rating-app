import React, { useState } from 'react';
import Modal from '../common/Modal';
import PasswordRequirements from '../common/PasswordRequirements';
import { adminAPI } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
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

    if (!['ADMIN', 'USER', 'STORE_OWNER'].includes(formData.role)) {
      errs.push('Please select a valid role.');
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
      await adminAPI.createUser(formData);
      success(`User "${formData.name}" was successfully registered!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER',
      });
      if (onUserCreated) {
        onUserCreated();
      }
      onClose();
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const msg = err.response?.data?.message || err.message || 'Failed to create user';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User (Admin)">
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
            <span className="text-[11px] text-slate-400">
              {formData.name.trim().length}/60 chars (min 20)
            </span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alexander Jonathan Montgomery"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Initial Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8-16 chars, 1 uppercase, 1 special symbol"
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <PasswordRequirements password={formData.password} />

        {/* Role selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Assigned Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors font-medium text-slate-800"
          >
            <option value="USER">Normal User (can browse and rate stores)</option>
            <option value="STORE_OWNER">Store Owner (can own stores & view user ratings)</option>
            <option value="ADMIN">System Administrator (full system access)</option>
          </select>
        </div>

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
          <textarea
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter physical address (up to 400 characters)"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors resize-none"
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
            className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>Create User</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
