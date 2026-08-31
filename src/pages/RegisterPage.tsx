import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Sparkles, 
  Cpu, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';

interface RegisterPageProps {
  onSwitchToLogin: (prefillEmail?: string) => void;
  initialEmail?: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, initialEmail = '' }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState<string>(initialEmail || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Real-time password criteria
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Strength score
  const strengthScore = (hasMinLength ? 1 : 0) + (hasLetter ? 1 : 0) + (hasNumberOrSymbol ? 1 : 0) + (password.length >= 10 ? 1 : 0);

  const getStrengthLabel = () => {
    if (password.length === 0) return { text: '', color: 'bg-slate-200' };
    if (strengthScore <= 1) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
    if (strengthScore <= 3) return { text: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const validateForm = (): boolean => {
    setErrorMessage(null);
    setErrorCode(null);

    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setErrorMessage('Please enter an email address.');
      setErrorCode('CLIENT_EMPTY_EMAIL');
      return false;
    }

    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email format (e.g. learner@example.com).');
      setErrorCode('CLIENT_INVALID_EMAIL');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      setErrorCode('CLIENT_WEAK_PASSWORD');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      setErrorCode('CLIENT_PASSWORD_MISMATCH');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrorMessage(null);
      setErrorCode(null);
      await register(email.trim(), password);
    } catch (err: any) {
      const code = err.code || (err.message?.toLowerCase().includes('already exists') ? 'USER_EXISTS' : 'REGISTRATION_ERROR');
      setErrorCode(code);
      setErrorMessage(err.message || 'Registration failed. Please check details or try another email.');
    } finally {
      setLoading(false);
    }
  };

  const isUserExists = errorCode === 'USER_EXISTS' || 
    (errorMessage?.toLowerCase().includes('already exists') || 
     errorMessage?.toLowerCase().includes('already registered'));

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-8 shadow-sm space-y-6 relative">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <BrandLogo 
            size="lg" 
            showText={true}
            subtitle="Create an account to begin adaptive knowledge tracing"
            className="flex-col !gap-2 text-center"
          />
        </div>

        {/* Dynamic Contextual Error Alerts */}
        {isUserExists ? (
          <div 
            id="alert-user-exists"
            className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-900 text-xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-blue-950">Account Already Exists</p>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  An account is already registered with <strong className="font-semibold">{email.trim()}</strong>. You can sign in directly with your password.
                </p>
              </div>
            </div>
            <div className="pt-1.5 flex justify-end">
              <button
                id="btn-quick-signin-prompt"
                type="button"
                onClick={() => onSwitchToLogin(email.trim())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to this Account</span>
              </button>
            </div>
          </div>
        ) : errorMessage ? (
          <div 
            id="alert-register-error"
            className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label htmlFor="input-register-email" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Primary account ID</span>
            </label>
            <input
              id="input-register-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              autoComplete="email"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-xs outline-none transition-all"
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="input-register-password" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer font-medium"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <input
              id="input-register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-xs outline-none transition-all"
              placeholder="Create password (min. 6 characters)"
            />

            {/* Password strength visual indicator */}
            {password.length > 0 && (
              <div className="pt-1 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Password Strength:</span>
                  <span className={`font-semibold ${getStrengthLabel().textColor || 'text-slate-600'}`}>
                    {getStrengthLabel().text}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 1 ? getStrengthLabel().color : 'bg-transparent'} w-1/3`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 2 ? getStrengthLabel().color : 'bg-transparent'} w-1/3`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 4 ? getStrengthLabel().color : 'bg-transparent'} w-1/3`} />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-0.5">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    {hasMinLength ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block ml-0.5 mr-1" />}
                    At least 6 characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    {hasNumberOrSymbol ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block ml-0.5 mr-1" />}
                    Numbers or symbols
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="input-register-confirm-password" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Confirm Password</span>
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer font-medium"
              >
                {showConfirmPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <input
              id="input-register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              autoComplete="new-password"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? 'border-rose-300 bg-rose-50/20'
                  : confirmPassword.length > 0 && passwordsMatch
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-200'
              } focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-xs outline-none transition-all`}
              placeholder="Re-enter password"
            />
            {confirmPassword.length > 0 && (
              <div className="text-[11px] pt-0.5">
                {passwordsMatch ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <X className="w-3 h-3" /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            id="btn-register-submit"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {loading ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Initializing Student Graph & Mastery Matrix...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            id="btn-switch-login"
            type="button"
            onClick={() => onSwitchToLogin(email.trim())}
            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 text-slate-400" />
            <span>Already have an account?</span>
            <strong className="text-indigo-600 underline font-semibold ml-0.5">Sign in</strong>
          </button>
        </div>

      </div>
    </div>
  );
};
