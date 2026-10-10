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
    <div className="min-h-screen bg-[#F5F7FC] text-[#111827] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Dashboard App Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Logo onClick={onBackToHome} />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                Security Workspace
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* User Pill */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'U')}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.displayName || 'Active User'}
                  </div>
                  <div className="text-[10.5px] text-slate-500 leading-tight">
                    {user?.email || 'Authenticated'}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-200 cursor-pointer"
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
        <div className="bg-linear-to-r from-[#0B1224] via-[#1E293B] to-[#0B1224] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden mb-8">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Authentication Verified</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome, {user?.displayName || (user?.email?.split('@')[0] || 'User')}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              You are signed into your ScamSense AI account. This configurable post-login destination will host your live multi-format scam scanners and real-time threat intelligence.
            </p>
          </div>

          <div className="absolute right-6 bottom-4 sm:bottom-6 opacity-15 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-white" />
          </div>
        </div>

        {/* Quick Actions Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">New Scan Analyzer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit SMS, Phishing URLs, QR codes, or screenshots for automated deep heuristic analysis.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Scanner Engine Ready
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Recent Threat History</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review flagged risk assessments, historical scores, and downloaded safety remediation reports.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                0 Scans Logged
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Security Configuration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Firebase Auth status: {isFirebaseConfigured ? '🟢 Live Production Connected' : '🟡 Environment Ready (.env.example)'}
            </p>
            <div className="pt-2">
              <button
                onClick={onBackToHome}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Return to Landing Page &rarr;
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Dashboard Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>&copy; {new Date().getFullYear()} ScamSense AI • Confidential User Session</div>
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="hover:text-blue-600">Home</button>
            <span>•</span>
            <button onClick={handleSignOut} className="hover:text-red-600">Sign Out</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
