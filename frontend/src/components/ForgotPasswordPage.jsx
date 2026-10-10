import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import AuthBrandingPanel from './AuthBrandingPanel';

export default function ForgotPasswordPage({ onNavigateToSignIn, onBackToHome }) {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setStatusMessage(null);

    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email.trim());
    setIsLoading(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: result.message || 'If an account exists with this email, a password reset link has been sent.'
      });
    } else {
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

        {/* Right Column: Forgot Password Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-white rounded-[28px] p-6 sm:p-10 shadow-xl border border-[#E2E8F0] relative">
            
            {/* Top Back Link */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onNavigateToSignIn}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Reset your password
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Enter your registered email address and we'll send you secure instructions to reset your password.
              </p>
            </div>

            {/* Error message */}
            {formError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Success message */}
            {statusMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1.5">
                  Email Address
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-[#64748B]">
              Remembered your password?{' '}
              <button
                type="button"
                onClick={onNavigateToSignIn}
                className="font-bold text-[#2563EB] hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
