import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import AuthBrandingPanel from './AuthBrandingPanel';

export default function SignInPage({ onNavigateToSignUp, onNavigateToForgotPassword, onBackToHome, onSuccessRedirect }) {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState('');

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
      }, 800);
    } else {
      setFormError(result.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError('');
    setSuccessInfo('');
    setGoogleLoading(true);

    const result = await signInWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      setSuccessInfo('Signed in with Google! Redirecting...');
      setTimeout(() => {
        if (onSuccessRedirect) onSuccessRedirect();
      }, 800);
    } else if (!result.redirecting) {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Split-screen Branding Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <AuthBrandingPanel />
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          <div className="relative">
            {/* Floating Top Badge */}
            <div className="absolute -top-4 right-1/2 translate-x-1/2 sm:right-10 sm:translate-x-0 z-20 px-4 py-1.5 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-md">
              Sign in with Email
            </div>

            <div className="bg-white rounded-[28px] p-6 sm:p-10 shadow-xl border border-[#E2E8F0] relative">
              
              {/* Back to Home Link */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={onBackToHome}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                >
                  &larr; Back to Home
                </button>
              </div>

              {/* Heading */}
              <div className="mb-6 space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Sign in to your ScamSense AI account
                </p>
              </div>

              {/* Error Alert */}
              {formError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Success Alert */}
              {successInfo && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{successInfo}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5">
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pragya.mishra@scamsense.ai"
                      autoComplete="email"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#111827] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-slate-50/50 hover:bg-white transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#111827] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-slate-50/50 hover:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 text-[#64748B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
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
                <div className="border-t border-[#E2E8F0] w-full" />
                <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                  or
                </span>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-center gap-3 transition shadow-2xs cursor-pointer"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>

              {/* Footer Switcher */}
              <div className="mt-6 text-center text-xs text-[#64748B]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="font-bold text-[#2563EB] hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </div>

              {/* Bottom Terms Note */}
              <div className="mt-4 text-center text-[11px] text-slate-400">
                By continuing, you agree to our{' '}
                <span className="text-[#2563EB] hover:underline cursor-pointer">Terms of Service</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
