import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  X, 
  Target, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileDown, 
  Lock, 
  Mail, 
  RotateCcw, 
  LogOut, 
  Sparkles, 
  Cpu, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { NavTab } from './Navbar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: NavTab) => void;
  onRefreshAll: () => void;
}

interface UserStats {
  userId: string;
  email: string;
  createdAt?: string;
  totalAttempts: number;
  correctCount: number;
  accuracy: number;
  totalTimeSeconds: number;
  skillsSolid: number;
  skillsDeveloping: number;
  skillsNovice: number;
  totalSkills: number;
  currentGoal?: any;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onRefreshAll,
}) => {
  const { user, currentGoal, logout, updateUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings'>('overview');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Email update state
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset progress state
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!isOpen) return;
    try {
      setLoadingStats(true);
      const data = await api.getUserStats();
      setStats(data);
      if (user?.email) {
        setEmailInput(user.email);
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      setEmailMessage(null);
      setPasswordMessage(null);
      setResetMessage(null);
    }
  }, [isOpen, user]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);
    if (!emailInput || !emailInput.includes('@')) {
      setEmailMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    try {
      setEmailSaving(true);
      const res = await api.updateProfile({ email: emailInput.trim() });
      updateUser(res.user);
      setEmailMessage({ type: 'success', text: 'Email updated successfully.' });
      onRefreshAll();
    } catch (err: any) {
      setEmailMessage({ type: 'error', text: err.message || 'Failed to update email.' });
    } finally {
      setEmailSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
      setPasswordSaving(true);
      await api.updateProfile({ currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleResetProgress = async () => {
    if (!confirm('Are you sure you want to reset your practice attempts and mastery calculations? This cannot be undone.')) {
      return;
    }
    try {
      setResetting(true);
      await api.resetUserProgress();
      setResetMessage('Your diagnostic trace attempts have been reset.');
      fetchStats();
      onRefreshAll();
    } catch (err: any) {
      setResetMessage(err.message || 'Failed to reset progress.');
    } finally {
      setResetting(false);
    }
  };

  const handleExportTranscript = async () => {
    try {
      const [masteries, attempts] = await Promise.all([
        api.getMastery(),
        api.getAttempts(),
      ]);

      const transcript = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user?.id,
          email: user?.email,
          createdAt: user?.createdAt,
        },
        currentGoal: currentGoal?.goal?.name || 'Machine Learning Engineer',
        stats: stats || {},
        masteryMatrix: masteries.map((m) => ({
          skillId: m.skillId,
          skillName: m.skillName,
          domain: m.domain,
          masteryScore: m.masteryScore,
          status: m.interpretation,
          bktEstimate: m.bktEstimate,
        })),
        interactionHistory: attempts.map((a) => ({
          questionId: a.questionId,
          correct: a.correct,
          confidence: a.confidence,
          timeTakenSeconds: a.timeTakenSeconds,
          timestamp: a.createdAt,
        })),
      };

      const blob = new Blob([JSON.stringify(transcript, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learntrace-transcript-${user?.id || 'learner'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export transcript:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header Profile Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-600/20 ring-2 ring-white">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{user?.email || 'Learner Account'}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="font-mono text-[11px] text-slate-400">ID: {user?.id}</span>
                <span>•</span>
                <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}</span>
              </div>
            </div>
          </div>

          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-4 text-xs font-semibold">
          <button
            id="profile-tab-overview"
            onClick={() => setActiveSubTab('overview')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Learning Summary & Analytics</span>
          </button>

          <button
            id="profile-tab-settings"
            onClick={() => setActiveSubTab('settings')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Account Security & Management</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: OVERVIEW & DIAGNOSTIC ANALYTICS */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Attempts</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {loadingStats ? '...' : stats?.totalAttempts ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400">Total answered</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Accuracy</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-700">
                    {loadingStats ? '...' : `${stats?.accuracy ?? 0}%`}
                  </div>
                  <div className="text-[10px] text-slate-400">{stats?.correctCount ?? 0} correct</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Solid Skills</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {loadingStats ? '...' : `${stats?.skillsSolid ?? 0}/${stats?.totalSkills ?? 8}`}
                  </div>
                  <div className="text-[10px] text-slate-400">Mastery ≥ 70%</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Active Time</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {loadingStats ? '...' : `${Math.round((stats?.totalTimeSeconds ?? 0) / 60)}m`}
                  </div>
                  <div className="text-[10px] text-slate-400">Time spent</div>
                </div>
              </div>

              {/* Active Curriculum Goal Section */}
              <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>Current Active Target Goal</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {currentGoal?.goal?.name || 'Machine Learning Engineer (MLE)'}
                  </p>
                </div>

                <button
                  id="btn-profile-change-goal"
                  onClick={() => {
                    onClose();
                    onNavigateToTab('goals');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-300 text-indigo-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                  Change Curriculum Goal
                </button>
              </div>

              {/* Export Diagnostic Data */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-900">Learner Knowledge Transcript</div>
                  <p className="text-[11px] text-slate-500">
                    Download full diagnostic JSON data including mastery matrix, BKT parameters, and interaction traces.
                  </p>
                </div>

                <button
                  id="btn-export-transcript"
                  onClick={handleExportTranscript}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FileDown className="w-4 h-4 text-slate-600" />
                  <span>Export JSON</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: ACCOUNT SETTINGS & SECURITY */}
          {activeSubTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Update Email Form */}
              <form onSubmit={handleUpdateEmail} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Update Account Email</span>
                </div>

                {emailMessage && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    emailMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {emailMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{emailMessage.text}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="input-profile-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-600"
                    placeholder="learner@learntrace.ai"
                  />
                  <button
                    id="btn-save-email"
                    type="submit"
                    disabled={emailSaving || emailInput === user?.email}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    {emailSaving ? 'Saving...' : 'Save Email'}
                  </button>
                </div>
              </form>

              {/* Change Password Form */}
              <form onSubmit={handleUpdatePassword} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Change Password</span>
                </div>

                {passwordMessage && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {passwordMessage.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Current Password (optional for demo)</label>
                    <input
                      id="input-profile-current-pass"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-600"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600">New Password</label>
                      <input
                        id="input-profile-new-pass"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-600"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600">Confirm New Password</label>
                      <input
                        id="input-profile-confirm-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white focus:border-indigo-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-save-password"
                    type="submit"
                    disabled={passwordSaving || !newPassword}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              {/* Reset Diagnostic Progress Section */}
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Diagnostic Progress</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Clear all diagnostic attempts and recalculate baseline skill masteries for this account.
                </p>

                {resetMessage && (
                  <div className="p-2.5 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs">
                    {resetMessage}
                  </div>
                )}

                <button
                  id="btn-reset-user-progress"
                  onClick={handleResetProgress}
                  disabled={resetting}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  {resetting ? 'Resetting Progress...' : 'Reset My Progress'}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            id="btn-profile-logout"
            onClick={() => {
              onClose();
              logout();
            }}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-600 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>

      </motion.div>
    </div>
  );
};
