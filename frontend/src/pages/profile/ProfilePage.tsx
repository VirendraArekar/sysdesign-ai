import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import apiClient from '../../services/api';
import { ApiResponse, User } from '../../types';
import { 
  User as UserIcon, 
  Briefcase, 
  Award, 
  Flame, 
  Target, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Senior Software Engineer');
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears ?? 3);
  const [preferredLevel, setPreferredLevel] = useState(user?.preferredLevel || 'INTERMEDIATE');
  const [targetCompanies, setTargetCompanies] = useState(
    user?.targetCompanies?.join(', ') || 'Google, Amazon, Meta, Netflix'
  );

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTargetRole(user.targetRole || 'Senior Software Engineer');
      setExperienceYears(user.experienceYears ?? 3);
      setPreferredLevel(user.preferredLevel || 'INTERMEDIATE');
      setTargetCompanies(user.targetCompanies?.join(', ') || 'Google, Amazon, Meta, Netflix');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const companiesArray = targetCompanies
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      const res = await apiClient.put<any, ApiResponse<User>>('/users/profile', {
        fullName,
        targetRole,
        experienceYears: Number(experienceYears),
        preferredLevel,
        targetCompanies: companiesArray,
      });

      if (res.success && res.data) {
        dispatch(updateUser(res.data));
        setSuccessMessage('Profile updated successfully!');
      } else {
        setErrorMessage(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Profile & Target</h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize your interview readiness goals, target roles, and company interview tracks.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {user?.interviewReadinessScore || '0.0'}%
            </div>
            <div className="text-xs text-slate-400 font-medium">Readiness Score</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{user?.dailyStreak || 0} Days</div>
            <div className="text-xs text-slate-400 font-medium">Daily Streak</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-white truncate max-w-[160px]">
              {user?.preferredLevel || 'INTERMEDIATE'}
            </div>
            <div className="text-xs text-slate-400 font-medium">Target Level</div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[#151C2E] rounded-2xl border border-[#1E293B] p-6 sm:p-8">
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1020] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-[#0B1020]/50 border border-[#1E293B] rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B1020] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Staff Software Engineer">Staff Software Engineer</option>
                  <option value="Principal Software Architect">Principal Software Architect</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Target Level
              </label>
              <select
                value={preferredLevel}
                onChange={(e) => setPreferredLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0B1020] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              >
                <option value="BEGINNER">Beginner (L3 / SDE I)</option>
                <option value="INTERMEDIATE">Intermediate (L4 / SDE II)</option>
                <option value="SENIOR">Senior (L5 / Senior SDE)</option>
                <option value="STAFF">Staff (L6 / Staff Engineer)</option>
                <option value="PRINCIPAL">Principal (L7 / Principal Architect)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Target Companies (comma-separated)
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                placeholder="Google, Amazon, Meta, Netflix, Uber, Stripe"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1020] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-[#6366F1]/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
