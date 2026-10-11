import React from 'react';
import { Shield, MessageSquareText, Link2, QrCode, History, Users, BarChart3, LogIn, LogOut, UserCheck } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const navItems = [
    { id: 'text', label: 'Message Scanner', icon: MessageSquareText },
    { id: 'url', label: 'URL Shield', icon: Link2 },
    { id: 'qr', label: 'QR Decoder', icon: QrCode },
    { id: 'reports', label: 'Community Feed', icon: Users },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('text')}>
            <img
              src="/scamsense-emblem.png"
              alt="ScamSense AI Logo"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold text-[#F1F5F9] tracking-tight">
                  ScamSense <span className="text-[#6366F1]">AI</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-950 text-[#6366F1] border border-indigo-800/60 rounded-full">
                  v1.0 Agent
                </span>
              </div>
              <p className="text-xs text-[#8494AD]">AI Scam & Fraud Defense Agent</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-xl">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
                    {user.full_name || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
