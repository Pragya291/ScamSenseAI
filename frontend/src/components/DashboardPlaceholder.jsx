import React from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Scan, 
  CheckCircle, 
  Activity, 
  User, 
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function DashboardPlaceholder({ onSignOut, onBackToHome }) {
  const { user, isFirebaseConfigured, signOutUser } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
    if (onSignOut) onSignOut();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FC] dark:bg-[#0B1120] text-[#111827] dark:text-[#F1F5F9] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Dashboard App Header */}
      <header className="bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#293953] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Logo onClick={onBackToHome} />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-[#162238] text-blue-700 dark:text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-[#293953]">
                Security Workspace
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* User Pill */}
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white font-bold text-xs flex items-center justify-center">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9] leading-tight">
                    {user?.displayName || 'Active User'}
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-[#8494AD] leading-tight">
                    {user?.email || 'Authenticated'}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-500 dark:text-[#8494AD] hover:text-red-600 dark:hover:text-[#FB7185] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition border border-transparent hover:border-red-200 dark:hover:border-red-900/60 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#0B1224] via-[#1E293B] to-[#0B1224] dark:from-[#070C19] dark:via-[#111C32] dark:to-[#070C19] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 dark:border-[#293953] relative overflow-hidden mb-8">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Authentication Verified</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F1F5F9]">
              Welcome, {user?.displayName || (user?.email?.split('@')[0] || 'User')}!
            </h1>
            <p className="text-sm text-slate-300 dark:text-[#A8B6CC] leading-relaxed">
              You are signed into your ScamSense AI account. This configurable post-login destination will host your live multi-format scam scanners and real-time threat intelligence.
            </p>
          </div>

          <div className="absolute right-6 bottom-4 sm:bottom-6 opacity-15 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-white" />
          </div>
        </div>

        {/* Quick Actions Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-[#E2E8F0] dark:border-[#293953] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-[#60A5FA] flex items-center justify-center font-bold">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">New Scan Analyzer</h3>
            <p className="text-xs text-slate-500 dark:text-[#A8B6CC] leading-relaxed">
              Submit SMS, Phishing URLs, QR codes, or screenshots for automated deep heuristic analysis.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-blue-600 dark:text-[#60A5FA] bg-blue-50 dark:bg-[#162238] px-2.5 py-1 rounded-md border dark:border-[#293953]">
                Scanner Engine Ready
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-[#E2E8F0] dark:border-[#293953] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-[#C084FC] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">Recent Threat History</h3>
            <p className="text-xs text-slate-500 dark:text-[#A8B6CC] leading-relaxed">
              Review flagged risk assessments, historical scores, and downloaded safety remediation reports.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#A8B6CC] bg-slate-100 dark:bg-[#162238] px-2.5 py-1 rounded-md border dark:border-[#293953]">
                0 Scans Logged
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111C32] rounded-2xl border border-[#E2E8F0] dark:border-[#293953] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#34D399] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">Security Configuration</h3>
            <p className="text-xs text-slate-500 dark:text-[#A8B6CC] leading-relaxed">
              Firebase Auth status: {isFirebaseConfigured ? '🟢 Live Production Connected' : '🟡 Environment Ready (.env.example)'}
            </p>
            <div className="pt-2">
              <button
                onClick={onBackToHome}
                className="text-xs font-bold text-blue-600 dark:text-[#60A5FA] hover:underline cursor-pointer"
              >
                Return to Landing Page &rarr;
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Dashboard Footer */}
      <footer className="border-t border-[#E2E8F0] dark:border-[#293953] bg-white dark:bg-[#070C19] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-[#8494AD]">
          <div>&copy; {new Date().getFullYear()} ScamSense AI • Confidential User Session</div>
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="hover:text-blue-600 dark:hover:text-[#60A5FA]">Home</button>
            <span>•</span>
            <button onClick={handleSignOut} className="hover:text-red-600 dark:hover:text-[#FB7185]">Sign Out</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
