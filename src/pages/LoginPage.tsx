import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  Sparkles, 
  Cpu, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ShieldAlert, 
  KeyRound,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';

interface LoginPageProps {
  onSwitchToRegister: (prefillEmail?: string) => void;
  initialEmail?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister, initialEmail = '' }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState<string>(initialEmail || '');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const validateForm = (): boolean => {
    setErrorMessage(null);
    setErrorCode(null);

    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      setErrorCode('CLIENT_EMPTY_EMAIL');
      return false;
    }

    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email format (e.g. learner@learntrace.ai).');
      setErrorCode('CLIENT_INVALID_EMAIL');
      return false;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      setErrorCode('CLIENT_EMPTY_PASSWORD');
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
      await login(email.trim(), password);
    } catch (err: any) {
      const code = err.code || (err.message?.toLowerCase().includes('password') ? 'INCORRECT_PASSWORD' : 'USER_NOT_FOUND');
      setErrorCode(code);
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    setErrorCode(null);
    try {
      setDemoLoading(true);
      await loginAsDemo();
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo authentication failed.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('learner@learntrace.ai');
    setPassword('password123');
    setErrorMessage(null);
    setErrorCode(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const isUserNotFound = errorCode === 'USER_NOT_FOUND' || 
    (errorMessage?.toLowerCase().includes("don't have an account") || 
     errorMessage?.toLowerCase().includes("no user") || 
     errorMessage?.toLowerCase().includes("no account"));

  const isIncorrectPassword = errorCode === 'INCORRECT_PASSWORD' || 
    errorMessage?.toLowerCase().includes("incorrect password");

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-7 sm:p-8 shadow-sm space-y-6 relative">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <BrandLogo 
            size="lg" 
            showText={true}
            subtitle="Cognitive Knowledge Graph & Adaptive Mastery Platform"
            className="flex-col !gap-2 text-center"
          />
        </div>

        {/* Dynamic Contextual Error Alert Banners */}
        {isUserNotFound ? (
          <div 
            id="alert-unregistered-user"
            className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-900">Don't have an account?</p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  No account was found for <strong className="font-semibold">{email.trim()}</strong>. Please register to create your personalized learning graph.
                </p>
              </div>
            </div>
            <div className="pt-1.5 flex justify-end">
              <button
                id="btn-quick-register-prompt"
                type="button"
                onClick={() => onSwitchToRegister(email.trim())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register this Email</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : isIncorrectPassword ? (
          <div 
            id="alert-incorrect-password"
            className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 text-xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-900">Incorrect Password</p>
                <p className="text-rose-800 text-[11px] leading-relaxed">
                  The password you entered does not match our records for this account. Please re-check and try again.
                </p>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-rose-700 font-medium">Demo password is: <code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-900">password123</code></span>
              <button
                type="button"
                onClick={() => {
                  setPassword('');
                  const el = document.getElementById('input-login-password');
                  if (el) el.focus();
                }}
                className="text-rose-700 hover:text-rose-900 font-semibold underline cursor-pointer"
              >
                Clear & Retry
              </button>
            </div>
          </div>
        ) : errorMessage ? (
          <div 
            id="alert-general-error"
            className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        ) : null}

        {/* CapsLock Warning */}
        {capsLockActive && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Caps Lock is ON</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="input-login-email" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Registered user email</span>
            </label>
            <input
              id="input-login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              autoComplete="email"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border ${
                isUserNotFound ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'
              } focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-xs outline-none transition-all`}
              placeholder="learner@learntrace.ai"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="input-login-password" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </span>
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
            </label>
            <div className="relative">
              <input
                id="input-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyDown}
                required
                autoComplete="current-password"
                className={`w-full px-3.5 py-2.5 pr-10 rounded-lg bg-slate-50 border ${
                  isIncorrectPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                } focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-xs outline-none transition-all`}
                placeholder="••••••••"
              />
              <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading || demoLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to LearnTrace</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Fast Access</span>
        </div>

        {/* Demo Fast Access & Helper */}
        <div className="space-y-2.5">
          <button
            id="btn-login-demo"
            type="button"
            onClick={handleDemoLogin}
            disabled={loading || demoLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {demoLoading ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Loading Demo Environment...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Launch Demo Learner Session</span>
              </>
            )}
          </button>
          
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>Test account:</span>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100/80 px-2 py-0.5 rounded transition-colors"
            >
              <Key className="w-3 h-3 text-indigo-500" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            id="btn-switch-register"
            type="button"
            onClick={() => onSwitchToRegister(email.trim())}
            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Don't have an account?</span>
            <strong className="text-indigo-600 underline font-semibold ml-0.5">Register now</strong>
            <ArrowRight className="w-3 h-3 text-indigo-600" />
          </button>
        </div>

      </div>
    </div>
  );
};
