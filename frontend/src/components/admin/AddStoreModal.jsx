import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { storesAPI } from '../../api/stores';
import { adminAPI } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Store, Loader2 } from 'lucide-react';

export const AddStoreModal = ({ isOpen, onClose, onStoreCreated }) => {
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Fetch store owners to populate the select dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchOwners = async () => {
        try {
          setLoadingOwners(true);
          const res = await adminAPI.getUsers({ role: 'STORE_OWNER' });
          if (res.success && res.data) {
            setOwners(res.data);
            if (res.data.length > 0) {
              setFormData((prev) => ({ ...prev, ownerId: res.data[0].id }));
            }
          }
        } catch (err) {
          console.error('Failed to load store owners:', err);
        } finally {
          setLoadingOwners(false);
        }
      };
      fetchOwners();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors([]);
  };

  const validate = () => {
    const errs = [];
    if (!formData.name.trim()) {
      errs.push('Store name is required.');
    } else if (formData.name.trim().length > 100) {
      errs.push('Store name must not exceed 100 characters.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errs.push('Please enter a valid store email address.');
    }

    if (!formData.address.trim()) {
      errs.push('Store address is required.');
    } else if (formData.address.length > 400) {
      errs.push('Store address must not exceed 400 characters.');
    }

    if (!formData.ownerId) {
      errs.push('Please select a Store Owner.');
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
      setSubmitting(true);
      await storesAPI.createStore({
        ...formData,
        ownerId: parseInt(formData.ownerId, 10),
      });
      success(`Store "${formData.name}" was registered successfully!`);
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerId: owners.length > 0 ? owners[0].id : '',
      });
      if (onStoreCreated) {
        onStoreCreated();
      }
      onClose();
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const msg = err.response?.data?.message || err.message || 'Failed to create store';
      if (backendErrors && Array.isArray(backendErrors)) {
        setFormErrors(backendErrors);
      } else {
        setFormErrors([msg]);
      }
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Store (Admin)">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formErrors.length > 0 && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
            {formErrors.map((err, i) => (
              <p key={i}>• {err}</p>
            ))}
          </div>
        )}

        {/* Store Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Store Name
            </label>
            <span className="text-[11px] text-slate-400">
              {formData.name.trim().length}/100 chars
            </span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Apex Hardware & Home Store"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
            required
          />
        </div>

        {/* Store Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Store Contact Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="store@domain.com"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
            required
          />
        </div>

        {/* Store Address */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Physical Address
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
            placeholder="123 Main Street, Suite 100, City, State"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors resize-none"
            required
          />
        </div>

        {/* Store Owner Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Designated Store Owner
          </label>
          {loadingOwners ? (
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
              <span>Loading registered store owners...</span>
            </div>
          ) : owners.length === 0 ? (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
              No users with the STORE_OWNER role exist yet. Please create a Store Owner user first!
            </div>
          ) : (
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors font-medium text-slate-800"
              required
            >
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          )}
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
            disabled={submitting || owners.length === 0}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm shadow-brand-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
            <span>Create Store</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStoreModal;
