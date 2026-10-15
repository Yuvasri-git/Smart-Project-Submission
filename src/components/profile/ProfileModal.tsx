import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  KeyRound 
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUserProfile } = usePortal();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword) {
      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match.');
        return;
      }
    }

    updateCurrentUserProfile({
      name,
      phone,
      password: newPassword || currentUser.password,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/80 shadow-md"
            />
            <div>
              <h3 className="text-base font-bold tracking-tight">{currentUser.name}</h3>
              <p className="text-xs text-blue-200 capitalize">
                {currentUser.role} • {currentUser.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
          
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
              {passwordError}
            </div>
          )}

          {/* Account Details Readonly */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium block">Institutional ID</span>
              <span className="font-mono font-bold text-slate-800">
                {currentUser.rollNumber || currentUser.facultyId || 'FAC-ADM-01'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">College Role</span>
              <span className="font-bold text-blue-700 uppercase">
                {currentUser.role}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-medium block">Email Address</span>
              <span className="font-mono text-slate-700">{currentUser.email}</span>
            </div>
          </div>

          {/* Editable Fields */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contact Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
            />
          </div>

          {/* Password Change */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Change Password (Optional)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
