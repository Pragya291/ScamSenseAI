import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Shield,
  X
} from 'lucide-react';
import AuthBrandingPanel from './AuthBrandingPanel';

export default function SignInPage({ onNavigateToSignUp, onNavigateToForgotPassword, onBackToHome, onSuccessRedirect }) {
  const { signInWithEmail, signInWithGoogle, signInWithGoogleRedirect } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formError, setFormError] = useState('');
  const [canRedirect, setCanRedirect] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState('');
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState('');
  const [modalType, setModalType] = useState(null); // 'terms' | 'privacy' | null

  const validateForm = () => {
    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Please enter your password.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessInfo('');
    setUnauthorizedDomain('');
    setCanRedirect(false);

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setIsLoading(true);
    const result = await signInWithEmail(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      setSuccessInfo('Signed in successfully! Redirecting...');
      setTimeout(() => {
        if (onSuccessRedirect) onSuccessRedirect();
      }, 700);
    } else {
      setFormError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError('');
    setSuccessInfo('');
    setCanRedirect(false);
    setUnauthorizedDomain('');
    setGoogleLoading(true);

    try {
      const result = await signInWithGoogle();
      setGoogleLoading(false);

      if (result.success) {
        setSuccessInfo('Signed in with Google! Redirecting...');
        setTimeout(() => {
          if (onSuccessRedirect) onSuccessRedirect();
        }, 700);
      } else if (!result.redirecting) {
        setFormError(result.error);
        if (result.canUseRedirect) {
          setCanRedirect(true);
        }
        if (result.errorCode === 'auth/unauthorized-domain') {
          const host = typeof window !== 'undefined' ? window.location.hostname : '';
          setUnauthorizedDomain(host);
        }
      }
    } catch (err) {
      setGoogleLoading(false);
      setFormError('Google sign-in encountered an issue. Please try again or use email sign-in.');
    }
  };

  const handleRedirectSignIn = async () => {
    setFormError('');
    setGoogleLoading(true);
    await signInWithGoogleRedirect();
  };

  const handleCopyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-[#070B17] py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans relative overflow-x-hidden selection:bg-blue-600 selection:text-white transition-colors duration-200">
      
      {/* Ambient background curves & gradient light ripples */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft background blurred orbs */}
        <div className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] rounded-full bg-blue-400/8 dark:bg-blue-600/10 blur-[130px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/8 dark:bg-purple-600/10 blur-[140px]" />
        
        {/* Futuristic background wave vector lines */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-40 dark:opacity-15 stroke-blue-200/50 dark:stroke-blue-900/40" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none"
          viewBox="0 0 1440 900" 
          preserveAspectRatio="none"
        >
          <path d="M-100 200 C 300 100, 600 350, 1540 150" strokeWidth="1.5" />
          <path d="M-100 450 C 400 350, 800 650, 1540 400" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100 700 C 500 600, 900 850, 1540 650" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Main Authentication Container: 55% / 45% Desktop Split */}
      <div className="max-w-[1220px] w-full mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 justify-center relative z-10">
        
        {/* Left Column: Hero Branding Panel (~55% width) */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <AuthBrandingPanel />
        </div>

        {/* Right Column: Glass-like Login Card (~45% width) */}
        <div className="w-full lg:w-[45%] flex flex-col relative">
          
          {/* Subtle floating 3D spheres behind the card */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-200/40 via-blue-200/30 to-transparent blur-xl pointer-events-none" />
          <div className="absolute top-16 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-300/35 to-purple-400/20 blur-lg pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-300/25 blur-2xl pointer-events-none" />

          {/* Login Card */}
          <div className="bg-white dark:bg-[#0D1326] rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.08)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800/80 relative transition-all duration-300 h-full flex flex-col justify-between">
            
            {/* Top Bar: Back to Home + Email Pill Badge */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to Home</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-[#4338CA] dark:text-blue-300 text-xs font-semibold shadow-2xs">
                <Mail className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                <span>Sign in with Email</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 space-y-1">
              <h1 className="text-3xl sm:text-[34px] font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
                Welcome{' '}
                <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                  back
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">
                Sign in to your ScamSense AI account
              </p>
            </div>

            {/* Error Alert */}
            {formError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs font-medium space-y-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <span className="leading-relaxed">{formError}</span>
                </div>
                
                {unauthorizedDomain && (
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#111827]/80 border border-red-200 dark:border-red-900/50 space-y-1.5 text-[11px]">
                    <div className="text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between">
                      <span>Domain to whitelist: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">{unauthorizedDomain}</code></span>
                      <button
                        type="button"
                        onClick={handleCopyDomain}
                        className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold cursor-pointer"
                      >
                        {copiedDomain ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Firebase Console → Authentication → Settings → Authorized domains → Add Domain
                    </p>
                  </div>
                )}

                {canRedirect && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleRedirectSignIn}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Try Google Redirect Flow</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Success Alert */}
            {successInfo && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>{successInfo}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-wide mb-1.5">
                  Email ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pragya.mishra@scamsense.ai"
                    autoComplete="email"
                    className="w-full h-12 pl-10 pr-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#111827] text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 font-medium focus:bg-white dark:focus:bg-[#151D30] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-[#111827] text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 font-medium focus:bg-white dark:focus:bg-[#151D30] focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#2563EB] focus:ring-blue-500/20 accent-[#2563EB] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="font-semibold text-[#2563EB] dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 sm:h-14 mt-2 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#1D4ED8] hover:via-[#4338CA] hover:to-[#6D28D9] shadow-lg shadow-blue-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-[#0D1326] px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                OR
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || googleLoading}
              className="w-full h-12 sm:h-13 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#172033] disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Footer Navigation */}
            <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="font-bold text-[#2563EB] dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </div>

            {/* Legal Links */}
            <div className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => setModalType('terms')}
                className="text-[#2563EB] dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                Terms of Service
              </button>{' '}and{' '}
              <button
                type="button"
                onClick={() => setModalType('privacy')}
                className="text-[#2563EB] dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Terms of Service & Privacy Policy Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0D1326] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>{modalType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</span>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed max-h-60 overflow-y-auto pr-1">
              {modalType === 'terms' ? (
                <>
                  <p>Welcome to ScamSense AI. By using our platform, you agree to comply with our security protocols and fair-use standards.</p>
                  <p>ScamSense AI provides real-time multi-vector threat intelligence, explainable risk assessments, and forensic scanning. Scans are executed safely in isolated sandbox environments.</p>
                  <p>You agree not to use ScamSense AI for unlawful activities, unauthorized penetration testing, or distribution of malicious payloads.</p>
                </>
              ) : (
                <>
                  <p>Your privacy and data security are our highest priorities. ScamSense AI does not store sensitive personal passwords or unauthorized scan credentials.</p>
                  <p>Analyzed URLs, text samples, and metadata are anonymized and processed solely to evaluate cyber risks and improve security heuristics.</p>
                  <p>Authentication data is securely protected through Firebase enterprise encryption.</p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
