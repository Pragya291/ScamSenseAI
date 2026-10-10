import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ScanWorkspace from './ScanWorkspace';
import ThreatIntelligenceView from './ThreatIntelligenceView';
import { ScanHistory } from './ScanHistoryView';
import { AnalyticsDashboard } from './AnalyticsView';
import SettingsView from './SettingsView';
import { 
  Home, 
  Scan, 
  ShieldAlert, 
  History, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  QrCode, 
  UploadCloud, 
  MessageSquare, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Info,
  User,
  Copy,
  Check,
  FileText
} from 'lucide-react';

// Sample initial scan records
const INITIAL_SCANS = [
  {
    id: 'scan-101',
    content: 'https://secure-bank-login.com',
    type: 'URL',
    timestamp: '2 hours ago',
    date: '2026-10-10 10:15',
    score: 87,
    verdict: 'High Risk',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    iconBg: 'bg-red-100 text-red-600',
    indicators: ['Suspicious domain (bank-login)', 'Matches known phishing patterns', 'SSL certificate invalid'],
    recommendation: 'Do not enter credentials. Verify via official banking portal.'
  },
  {
    id: 'scan-102',
    content: 'You won a free iPhone! Click here to claim...',
    type: 'Message',
    timestamp: '5 hours ago',
    date: '2026-10-10 07:42',
    score: 65,
    verdict: 'Suspicious',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    indicators: ['Urgent reward lure', 'Unverified shortened tracking link'],
    recommendation: 'Do not click links. Block sender number.'
  },
  {
    id: 'scan-103',
    content: 'https://amazon-official.net',
    type: 'URL',
    timestamp: 'Yesterday',
    date: '2026-10-09 16:30',
    score: 12,
    verdict: 'Safe',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    indicators: ['Verified domain registration', 'Valid SSL certificate'],
    recommendation: 'No threat indicators detected.'
  },
  {
    id: 'scan-104',
    content: 'Payment pending - verify now at...',
    type: 'SMS',
    timestamp: 'Yesterday',
    date: '2026-10-09 14:12',
    score: 72,
    verdict: 'Suspicious',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    indicators: ['Payment pressure language', 'Suspicious SMS sender'],
    recommendation: 'Do not send funds or reply with OTP.'
  },
  {
    id: 'scan-105',
    content: 'https://google.com',
    type: 'URL',
    timestamp: '2 days ago',
    date: '2026-10-08 09:00',
    score: 0,
    verdict: 'Safe',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    indicators: ['Official Google search domain', 'Strict HSTS enforcement'],
    recommendation: 'Verified official domain.'
  }
];

export default function Dashboard({ activeTab = 'home', setActiveTab, onSignOut, onBackToHome }) {
  const { user, signOutUser } = useAuth();
  
  const [scans, setScans] = useState(INITIAL_SCANS);
  const [selectedScan, setSelectedScan] = useState(INITIAL_SCANS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Quick Scan Input states on Home tab
  const [scanType, setScanType] = useState('URL');
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Target Scan Type for Workspace
  const [targetScanType, setTargetScanType] = useState('URL');

  // Filtered scans based on search query
  const filteredScans = scans.filter(s => 
    s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.verdict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overview Counts
  const totalScans = scans.length;
  const threatsDetected = scans.filter(s => s.verdict === 'High Risk' || s.verdict === 'Dangerous' || s.verdict === 'Danger').length;
  const suspiciousCount = scans.filter(s => s.verdict === 'Suspicious').length;
  const safeCount = scans.filter(s => s.verdict === 'Safe').length;

  const handleSignOut = async () => {
    await signOutUser();
    if (onSignOut) onSignOut();
  };

  const handleSaveNewScan = (newScanObj) => {
    setScans(prev => [newScanObj, ...prev]);
    setSelectedScan(newScanObj);
  };

  const handleDeleteScan = (id) => {
    setScans(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAllHistory = () => {
    setScans([]);
  };

  // Quick Scan Submission on Home Tab
  const handleRunScan = (overrideValue = null) => {
    const textToScan = overrideValue || inputValue || (selectedFile ? selectedFile.name : '');
    if (!textToScan.trim()) return;

    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      
      const lower = textToScan.toLowerCase();
      let score = 15;
      let verdict = 'Safe';
      let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      let iconBg = 'bg-emerald-100 text-emerald-600';
      let indicators = ['No known malicious patterns found', 'Domain/Sender passes baseline checks'];
      let recommendation = 'Proceed with standard caution.';

      if (lower.includes('fake') || lower.includes('verify') || lower.includes('win') || lower.includes('free') || lower.includes('crypto')) {
        score = 88;
        verdict = 'High Risk';
        badgeClass = 'bg-red-50 text-red-700 border-red-200';
        iconBg = 'bg-red-100 text-red-600';
        indicators = ['Suspicious domain/keyword match', 'High urgency phishing phrasing', 'Unverified destination'];
        recommendation = 'Do not proceed or submit sensitive credentials.';
      } else if (lower.includes('payment') || lower.includes('whatsapp') || lower.includes('support')) {
        score = 62;
        verdict = 'Suspicious';
        badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
        iconBg = 'bg-amber-100 text-amber-600';
        indicators = ['Requires verification', 'Non-standard payment query'];
        recommendation = 'Verify with sender via official phone number.';
      }

      const newScanObj = {
        id: 'scan-' + Date.now(),
        content: textToScan,
        type: scanType,
        timestamp: 'Just now',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        score,
        verdict,
        badgeClass,
        iconBg,
        indicators,
        recommendation
      };

      setScans([newScanObj, ...scans]);
      setSelectedScan(newScanObj);
    }, 1200);
  };

  const handleNavigateToScanFromThreat = (suggestedType) => {
    setTargetScanType(suggestedType);
    setActiveTab('scan');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F5F7FC] text-[#111827]'} font-sans flex selection:bg-blue-600 selection:text-white`}>
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className={`w-64 shrink-0 hidden lg:flex flex-col justify-between p-6 border-r ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#E2E8F0]'} sticky top-0 h-screen`}>
        <div className="space-y-8">
          
          {/* Brand Logo */}
          <Logo onClick={onBackToHome} />

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                setTargetScanType('URL');
                setActiveTab('scan');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'scan'
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Scan className="w-5 h-5" />
              <span>Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('threat-intel')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'threat-intel'
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Threat Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('scan-history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'scan-history'
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <History className="w-5 h-5" />
              <span>Scan History</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Info Card */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-linear-to-br from-[#2563EB]/10 via-[#7C3AED]/10 to-blue-50 p-4 border border-blue-100 text-left space-y-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Smarter, Safer Internet</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Analyze suspicious content and make informed security decisions.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* 2. TOP NAVIGATION BAR */}
        <header className={`sticky top-0 z-30 px-6 py-4 border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-[#E2E8F0]'} backdrop-blur-md flex items-center justify-between gap-4`}>
          
          {/* Global Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scans, URLs, messages..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-[#E2E8F0] bg-slate-50/70 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-[#E2E8F0] text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl border border-[#E2E8F0] text-slate-600 hover:bg-slate-100 transition relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-800 animate-in fade-in">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">1 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-900">
                      <div className="font-bold">High Risk Alert</div>
                      <div className="text-[11px] text-red-700">Phishing domain flagged 2 hours ago.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'P')}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.displayName || 'Pragya Mishra'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Free Plan
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800 animate-in fade-in">
                  <button
                    onClick={() => { setProfileOpen(false); setActiveTab('settings'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-xl transition flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); setActiveTab('settings'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-xl transition flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* 3. DYNAMIC PAGE ROUTING WITHIN DASHBOARD CONTAINER */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto flex-grow">
          
          {/* TAB 1: SCAN WORKSPACE (Matching Reference Screenshot 1 from previous prompt) */}
          {activeTab === 'scan' && (
            <ScanWorkspace 
              initialScanType={targetScanType}
              onSaveScan={handleSaveNewScan}
              onViewHistory={() => setActiveTab('scan-history')}
            />
          )}

          {/* TAB 2: THREAT INTELLIGENCE (Matching Reference Screenshot 2 from previous prompt) */}
          {activeTab === 'threat-intel' && (
            <ThreatIntelligenceView 
              onNavigateToScan={handleNavigateToScanFromThreat}
            />
          )}

          {/* TAB 3: SCAN HISTORY (Matching Reference Screenshot 1) */}
          {activeTab === 'scan-history' && (
            <ScanHistory 
              scans={scans}
              onNavigateToScan={() => setActiveTab('scan')}
              onDeleteScan={handleDeleteScan}
            />
          )}

          {/* TAB 4: ANALYTICS (Matching Reference Screenshot 2) */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard scans={scans} />
          )}

          {/* TAB 5: SETTINGS (Matching Reference Screenshot 3) */}
          {activeTab === 'settings' && (
            <SettingsView 
              onSignOut={handleSignOut}
              onClearHistory={handleClearAllHistory}
            />
          )}

          {/* TAB 0: HOMEPAGE (Default) */}
          {activeTab === 'home' && (
            <>
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2563EB] via-[#4338CA] to-[#7C3AED] p-6 sm:p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                      <span>AI-POWERED FRAUD DETECTION</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                      Think Before You Click. <br />
                      <span className="text-blue-200">Let AI Check.</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                      Analyze suspicious links, messages, emails, and more with advanced AI. Get instant, evidence-backed insights and stay protected from scams.
                    </p>
                  </div>

                  {/* Banner Graphic elements */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">URLs</span>
                      <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">SMS</span>
                      <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">Phone Numbers</span>
                    </div>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl shrink-0">
                      <ShieldCheck className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECURITY STATISTICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Scans</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{totalScans}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">All completed analyses</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Scan className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Threats Detected</div>
                    <div className="text-2xl font-black text-red-600 mt-1">{threatsDetected}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">High risk threats</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Suspicious Items</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">{suspiciousCount}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Needs verification</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Safe Results</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{safeCount}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Clean checkups</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* QUICK SCANNER & RECENT SCANS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (8 cols): Quick Scan Panel */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* QUICK SCAN PANEL */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xl space-y-6">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Check Before You Trust
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          Analyze suspicious messages, links, and digital content in seconds.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('scan')}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Scan Type Selectors */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setScanType('URL')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                          scanType === 'URL' ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>URL</span>
                      </button>

                      <button
                        onClick={() => setScanType('Message')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                          scanType === 'Message' ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message (SMS)</span>
                      </button>

                      <button
                        onClick={() => setScanType('Email')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                          scanType === 'Email' ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </button>

                      <button
                        onClick={() => setScanType('Phone')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                          scanType === 'Phone' ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Phone Number</span>
                      </button>
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Paste a suspicious link (e.g. https://example.com) or enter a message..."
                          className="w-full pl-4 pr-4 py-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                        />
                      </div>
                      <button
                        onClick={() => handleRunScan()}
                        disabled={isScanning}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md shadow-blue-500/20 transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
                      >
                        {isScanning ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Analyze</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Sample try links */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Try Sample:</span>
                      <button
                        onClick={() => { setInputValue('https://fake-login.com'); handleRunScan('https://fake-login.com'); }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[11px] cursor-pointer"
                      >
                        https://fake-login.com
                      </button>
                      <button
                        onClick={() => { setInputValue('whatsapp scam promo'); handleRunScan('whatsapp scam promo'); }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[11px] cursor-pointer"
                      >
                        whatsapp scam
                      </button>
                    </div>

                    {/* 3 Core Value Pill Props */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-xs text-slate-900">Detect</div>
                        <div className="text-[11px] text-slate-500">Identify red flags and suspicious patterns.</div>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-xs text-slate-900">Explain</div>
                        <div className="text-[11px] text-slate-500">Understand the risk with clear insights.</div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-xs text-slate-900">Protect</div>
                        <div className="text-[11px] text-slate-500">Get safe next steps and recommendations.</div>
                      </div>
                    </div>

                  </div>

                  {/* THREAT INTELLIGENCE PREVIEW ON HOME */}
                  <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">Threat Intelligence</h4>
                        <p className="text-xs text-slate-500">Latest scam trends, tactics and safety tips to keep you informed.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('threat-intel')}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">Phishing</span>
                        <div className="font-bold text-xs text-slate-900">WhatsApp Giveaway Scams</div>
                        <p className="text-[11px] text-slate-500">Fake rewards spreading via WhatsApp messaging loops.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Investment</span>
                        <div className="font-bold text-xs text-slate-900">Crypto Investment Fraud</div>
                        <p className="text-[11px] text-slate-500">Fake platforms promising high guaranteed returns.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Malware</span>
                        <div className="font-bold text-xs text-slate-900">Malware in APK Files</div>
                        <p className="text-[11px] text-slate-500">Malicious mobile apps posing as popular utility tools.</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column (4 cols): Recent Scans & Risk Breakdown */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* RECENT SCANS LIST CARD */}
                  <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900">Recent Scans</h4>
                      <button
                        onClick={() => setActiveTab('scan-history')}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {filteredScans.slice(0, 5).map((scan) => (
                        <div
                          key={scan.id}
                          onClick={() => setSelectedScan(scan)}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            selectedScan.id === scan.id
                              ? 'border-blue-500 bg-blue-50/30'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className={`w-9 h-9 rounded-xl ${scan.iconBg || 'bg-red-100 text-red-600'} flex items-center justify-center shrink-0`}>
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {scan.content}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scan.badgeClass}`}>
                                  {scan.verdict}
                                </span>
                                <span className="text-[10px] text-slate-400">{scan.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RISK ANALYSIS DETAIL CARD */}
                  {selectedScan && (
                    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-slate-900">Risk Analysis</h4>
                        <span className="text-xs font-bold text-slate-400">{selectedScan.type}</span>
                      </div>

                      {/* Circular Risk Meter */}
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="relative w-16 h-16 rounded-full bg-slate-200 border-4 border-red-500 flex items-center justify-center shrink-0">
                          <div className="text-lg font-black text-slate-900">{selectedScan.score}</div>
                        </div>
                        <div>
                          <div className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${selectedScan.badgeClass}`}>
                            {selectedScan.verdict}
                          </div>
                          <div className="text-xs font-bold text-slate-800 mt-1">
                            {selectedScan.score > 70 ? 'Likely Scam Threat' : selectedScan.score > 40 ? 'Suspicious Indicators' : 'Low Threat Level'}
                          </div>
                        </div>
                      </div>

                      {/* Evidence Indicators */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                          Evidence Indicators
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {selectedScan.indicators.map((ind, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                              <span>{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendation */}
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Recommended Action</span>
                        </div>
                        <p className="mt-1 text-[11px] text-emerald-700 leading-snug">
                          {selectedScan.recommendation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security CTA Card */}
                  <div className="rounded-3xl bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white space-y-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6" />
                      <span className="font-bold text-sm">ScamSense AI</span>
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Join the fight against online fraud. Your safety matters.
                    </p>
                    <button
                      onClick={() => setActiveTab('scan')}
                      className="w-full py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs hover:bg-blue-50 transition cursor-pointer"
                    >
                      Start New Scan &rarr;
                    </button>
                  </div>

                </div>

              </div>
            </>
          )}

        </main>

      </div>

    </div>
  );
}
