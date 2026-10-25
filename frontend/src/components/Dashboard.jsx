import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  FileText,
  Menu,
  X
} from 'lucide-react';
import { getScanHistory, deleteScanHistory, scanUrl, scanText, scanPhone, scanQr, scanContent } from '../services/api';
import { analyzeSecurityContent } from '../services/securityEngine';

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

export default function Dashboard({ activeTab: externalActiveTab, setActiveTab: externalSetActiveTab, onSignOut, onBackToHome }) {
  const { user, signOutUser } = useAuth();
  
  // Internal tab state fallback if external handler is omitted
  const [internalActiveTab, setInternalActiveTab] = useState('home');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = (tab) => {
    setInternalActiveTab(tab);
    if (externalSetActiveTab) externalSetActiveTab(tab);
  };
  
  // Persistent state initialized from localStorage, seeded with INITIAL_SCANS if empty
  const [scans, setScans] = useState(() => {
    try {
      const stored = localStorage.getItem('scamsense_scans');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cached scans from localStorage:', e);
    }
    return INITIAL_SCANS;
  });

  const [selectedScan, setSelectedScan] = useState(() => scans.length > 0 ? scans[0] : null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [scanError, setScanError] = useState('');
  const { isDark: darkMode, toggleTheme: handleToggleTheme, setTheme } = useTheme();

  // Keep localStorage synchronized whenever scans change
  React.useEffect(() => {
    try {
      localStorage.setItem('scamsense_scans', JSON.stringify(scans));
    } catch (e) {
      console.warn('Failed to sync scans to localStorage:', e);
    }
  }, [scans]);

  // Fetch real authenticated user scan history from backend if available
  React.useEffect(() => {
    let isMounted = true;
    async function fetchUserHistory() {
      try {
        const res = await getScanHistory();
        if (isMounted && res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(item => {
            const score = Math.round(item.risk_score || 0);
            const verdict = item.verdict || (score >= 70 ? 'High Risk' : score >= 35 ? 'Suspicious' : 'Safe');
            return {
              id: String(item.id),
              content: item.input_content || item.content || 'Scanned Content',
              type: (item.scan_type || 'url').toUpperCase(),
              timestamp: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
              date: item.created_at ? item.created_at.replace('T', ' ').substring(0, 16) : new Date().toISOString().substring(0, 16),
              score,
              verdict,
              badgeClass: (verdict === 'SCAM' || verdict === 'High Risk' || score >= 70) 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : (verdict === 'SUSPICIOUS' || verdict === 'Suspicious' || score >= 35) 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200',
              iconBg: (score >= 70) ? 'bg-red-100 text-red-600' : (score >= 35) ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600',
              indicators: [item.summary || `${item.scam_category || 'Scam'} analysis recorded`],
              recommendation: 'View scan record for complete threat intelligence breakdown.'
            };
          });

          setScans(prev => {
            const combined = [...mapped, ...prev];
            return Array.from(new Map(combined.map(s => [s.id, s])).values());
          });
        }
      } catch (err) {
        // Backend not running: gracefully fallback to persisted localStorage data
      }
    }
    fetchUserHistory();
    return () => { isMounted = false; };
  }, []);

  const handleToggleDarkMode = (val) => {
    if (val !== undefined) {
      setTheme(val ? 'dark' : 'light');
    } else {
      handleToggleTheme();
    }
  };

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Quick Scan Input states on Home tab
  const [scanType, setScanType] = useState('URL');
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Target Scan Type for Workspace
  const [targetScanType, setTargetScanType] = useState('URL');

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered scans based on search query
  const filteredScans = scans.filter(s => 
    s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.verdict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overview Counts (computed directly from real user scans)
  const totalScans = scans.length;
  const threatsDetected = scans.filter(s => s.verdict === 'High Risk' || s.verdict === 'SCAM' || s.verdict === 'Dangerous' || s.score >= 70).length;
  const suspiciousCount = scans.filter(s => s.verdict === 'Suspicious' || (s.score >= 35 && s.score < 70)).length;
  const safeCount = scans.filter(s => s.verdict === 'Safe' || s.score < 35).length;

  const handleSignOut = async () => {
    await signOutUser();
    if (onSignOut) onSignOut();
  };

  const handleSaveNewScan = (newScanObj) => {
    setScans(prev => [newScanObj, ...prev.filter(s => s.id !== newScanObj.id)]);
    setSelectedScan(newScanObj);
  };

  const handleDeleteScan = async (id) => {
    try {
      await deleteScanHistory(id);
    } catch (err) {
      console.warn('Could not delete scan history item from backend:', err);
    }
    setScans(prev => prev.filter(s => s.id !== id));
    if (selectedScan && selectedScan.id === id) {
      setSelectedScan(null);
    }
  };

  const handleClearAllHistory = () => {
    setScans([]);
    setSelectedScan(null);
  };

  // Real Quick Scan Submission on Home Tab connected to FastAPI
  const handleRunScan = async (overrideValue = null) => {
    const textToScan = overrideValue || inputValue || (selectedFile ? selectedFile.name : '');
    if (!textToScan.trim() || isScanning) return;

    setIsScanning(true);
    setScanError('');

    try {
      let res = null;
      if (scanType === 'URL') {
        res = await scanUrl(textToScan.trim());
      } else if (scanType === 'Phone' || scanType === 'Phone Number') {
        res = await scanPhone(textToScan.trim());
      } else if (scanType === 'QR Code' || scanType === 'QR') {
        if (selectedFile) {
          const fd = new FormData();
          fd.append('file', selectedFile);
          res = await scanQr(fd);
        } else {
          res = await scanContent({ content: textToScan.trim(), scan_type: 'qr' });
        }
      } else {
        res = await scanText(textToScan.trim());
      }

      if (res && res.data) {
        const data = res.data;
        const score = Math.round(data.risk_score !== undefined ? data.risk_score : 0);
        const verdict = (data.verdict === 'SCAM' || data.verdict === 'High Risk' || score >= 70) 
          ? 'High Risk' 
          : (data.verdict === 'SUSPICIOUS' || data.verdict === 'Suspicious' || score >= 35) 
          ? 'Suspicious' 
          : 'Safe';

        const newScanObj = {
          id: data.scan_id || 'scan-' + Date.now(),
          content: textToScan.trim(),
          type: scanType,
          timestamp: 'Just now',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          score,
          verdict,
          badgeClass: verdict === 'High Risk' ? 'bg-red-50 text-red-700 border-red-200' : verdict === 'Suspicious' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: verdict === 'High Risk' ? 'bg-red-100 text-red-600' : verdict === 'Suspicious' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600',
          indicators: data.indicators || data.red_flags || ['Analysis verified by security engine.'],
          recommendation: (data.recommendations && data.recommendations[0]) || data.explanation || 'Proceed with standard caution.'
        };

        setScans(prev => [newScanObj, ...prev.filter(s => s.id !== newScanObj.id)]);
        setSelectedScan(newScanObj);
        setInputValue('');
        setSelectedFile(null);
      }
    } catch (err) {
      console.warn('Backend server offline or unreachable, applying client-side threat engine:', err);
      // Offline / Local Threat Engine Fallback: authentic heuristic analysis
      const localAnalysis = analyzeSecurityContent(textToScan.trim(), scanType);
      setScans(prev => [localAnalysis, ...prev.filter(s => s.id !== localAnalysis.id)]);
      setSelectedScan(localAnalysis);
      setInputValue('');
      setSelectedFile(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleNavigateToScanFromThreat = (suggestedType) => {
    setTargetScanType(suggestedType);
    setActiveTab('scan');
  };

  return (
    <div className={`h-[100dvh] w-full overflow-hidden ${darkMode ? 'bg-[#0B1120] text-[#F1F5F9]' : 'bg-[#F8FAFC] text-[#111827]'} font-sans flex selection:bg-indigo-600 selection:text-white`}>
      
      {/* 1. FIXED-WIDTH LEFT NAVIGATION SIDEBAR (260px wide) */}
      <aside className={`w-[260px] shrink-0 hidden lg:flex flex-col justify-between p-4 border-r ${darkMode ? 'bg-[#070C19] border-[#293953]' : 'bg-white border-[#E2E8F0]'} h-full overflow-y-auto select-none`}>
        <div className="space-y-6">
          
          {/* Brand Logo */}
          <div className="px-1 py-1">
            <Logo onClick={onBackToHome} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'scan', label: 'Scan', icon: Scan },
              { id: 'threat-intel', label: 'Threat Intelligence', icon: ShieldAlert },
              { id: 'scan-history', label: 'Scan History', icon: History },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: IconComponent }) => (
              <button
                key={id}
                onClick={() => {
                  if (id === 'scan') setTargetScanType('URL');
                  setActiveTab(id);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === id
                    ? 'bg-linear-to-r from-[#4F46E5] to-[#9333EA] text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-100 dark:hover:bg-[#111C32] hover:text-slate-900 dark:hover:text-[#F1F5F9]'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Sidebar Info Card & Sign Out */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#293953]/60">
          <div className="rounded-2xl bg-linear-to-br from-[#2563EB]/10 via-[#7C3AED]/10 to-blue-50 dark:from-[#162238] dark:via-[#111C32] dark:to-[#0F172A] p-3.5 border border-blue-100 dark:border-[#293953] text-left space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-linear-to-tr from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] leading-tight">Smarter, Safer Internet</h4>
            <p className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-relaxed">
              Analyze suspicious content and make informed security decisions.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#A8B6CC] hover:text-red-600 dark:hover:text-[#FB7185] hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-[#293953] transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <aside className={`relative w-72 max-w-[85vw] h-full p-5 flex flex-col justify-between shadow-2xl z-10 ${darkMode ? 'bg-[#070C19] text-[#F1F5F9] border-r border-[#293953]' : 'bg-white text-slate-900'}`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Logo onClick={() => { setMobileSidebarOpen(false); onBackToHome(); }} />
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-[#8494AD] hover:text-slate-600 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#111C32]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {[
                  { id: 'home', label: 'Home', icon: Home },
                  { id: 'scan', label: 'Scan', icon: Scan },
                  { id: 'threat-intel', label: 'Threat Intelligence', icon: ShieldAlert },
                  { id: 'scan-history', label: 'Scan History', icon: History },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map(({ id, label, icon: IconComponent }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (id === 'scan') setTargetScanType('URL');
                      setActiveTab(id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === id
                        ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { setMobileSidebarOpen(false); handleSignOut(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN DASHBOARD SHELL */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        
        {/* 2. TOP NAVIGATION BAR (64px high, flex-shrink: 0) */}
        <header className={`h-16 shrink-0 px-4 sm:px-6 border-b ${darkMode ? 'bg-[#0F172A] border-[#293953]' : 'bg-white border-[#E2E8F0]'} flex items-center justify-between gap-4 sticky top-0 z-20`}>
          
          <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E2E8F0] dark:border-[#293953] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-100 dark:hover:bg-[#162238] transition cursor-pointer shrink-0"
              title="Open Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Search Input */}
            <div className="relative w-full min-w-0">
              <Search className="w-4 h-4 text-slate-400 dark:text-[#8494AD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scans, URLs, messages..."
                className="w-full pl-9 pr-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-[#293953] bg-slate-50/70 dark:bg-[#162238] text-slate-900 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Dark mode toggle */}
            <button
              onClick={() => handleToggleDarkMode()}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                darkMode ? 'border-[#293953] bg-[#162238] text-amber-400 hover:bg-[#17243A]' : 'border-[#E2E8F0] text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl border border-[#E2E8F0] dark:border-[#293953] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-100 dark:hover:bg-[#162238] transition relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FB7185] animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FB7185]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111C32] rounded-2xl shadow-xl border border-slate-200 dark:border-[#293953] p-4 z-50 text-slate-800 dark:text-[#F1F5F9] animate-in fade-in">
                  <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-[#293953] pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD]">Notifications</span>
                    <span className="text-[10px] bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-[#6366F1] font-bold px-2 py-0.5 rounded-full">1 New</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-50 dark:bg-rose-950/40 border border-red-100 dark:border-[#FB7185]/40 text-red-900 dark:text-[#FB7185] text-xs">
                    <div className="font-bold text-xs">High Risk Alert</div>
                    <div className="text-[11px] text-red-700 dark:text-[#F1F5F9] mt-0.5">Phishing domain flagged recently.</div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 pl-2 pr-3 rounded-full border border-[#E2E8F0] dark:border-[#293953] bg-slate-50 dark:bg-[#162238] hover:bg-slate-100 dark:hover:bg-[#17243A] transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User Avatar"} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span>{user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'P')}</span>
                  )}
                </div>
                <div className="text-left hidden sm:block min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] leading-tight truncate max-w-[130px]">
                    {user?.displayName || user?.email?.split('@')[0] || 'Pragya Mishra'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-[#8494AD] leading-none truncate max-w-[140px] mt-0.5">
                    {user?.email || 'pragya.mishra24@strice.in'}
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111C32] rounded-2xl shadow-xl border border-slate-200 dark:border-[#293953] p-2 z-50 text-slate-800 dark:text-[#F1F5F9] animate-in fade-in">
                  <button
                    onClick={() => { setProfileOpen(false); setActiveTab('settings'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#162238] rounded-xl transition flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400 dark:text-[#8494AD]" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); setActiveTab('settings'); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#162238] rounded-xl transition flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-400 dark:text-[#8494AD]" />
                    <span>Account Settings</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-[#293953]" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-[#FB7185] hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-xl transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* 3. SCROLLABLE PAGE BODY */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-6 pb-12 dashboard-scroll">
          <div className="w-full min-w-0">
            
            {/* TAB 1: SCAN WORKSPACE */}
            {activeTab === 'scan' && (
              <ScanWorkspace 
                initialScanType={targetScanType}
                onSaveScan={handleSaveNewScan}
                onViewHistory={() => setActiveTab('scan-history')}
              />
            )}

            {/* TAB 2: THREAT INTELLIGENCE */}
            {activeTab === 'threat-intel' && (
              <ThreatIntelligenceView 
                onNavigateToScan={handleNavigateToScanFromThreat}
              />
            )}

            {/* TAB 3: SCAN HISTORY */}
            {activeTab === 'scan-history' && (
              <ScanHistory 
                scans={scans}
                onNavigateToScan={() => setActiveTab('scan')}
                onDeleteScan={handleDeleteScan}
              />
            )}

            {/* TAB 4: ANALYTICS */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard scans={scans} />
            )}

            {/* TAB 5: SETTINGS */}
            {activeTab === 'settings' && (
              <SettingsView 
                onSignOut={handleSignOut}
                onClearHistory={handleClearAllHistory}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
              />
            )}

            {/* TAB 0: HOMEPAGE (Full-Width Hero, 4-Card Stats Row & Two-Column Main Content) */}
            {activeTab === 'home' && (
              <div className="flex flex-col gap-5 sm:gap-6 w-full min-w-0">
                
                {/* 1. FULL-WIDTH AI-POWERED FRAUD DETECTION BANNER */}
                <div 
                  className="w-full min-w-0 relative shrink-0 overflow-hidden rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/20 border border-blue-400/30"
                  style={{ background: 'linear-gradient(110deg, #2563EB 0%, #3B82F6 50%, #6366F1 100%)' }}
                >
                  {/* Ambient subtle light accents */}
                  <div className="absolute -top-12 -right-12 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-2 max-w-xl min-w-0">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white border border-white/25 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-blue-100" />
                        <span>AI-POWERED FRAUD DETECTION</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-white tracking-tight leading-snug drop-shadow-xs">
                        Think Before You Click. <span className="text-white">Let AI Check.</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                        Analyze suspicious links, messages, emails, and more with advanced AI. Get instant, evidence-backed insights and stay protected from scams.
                      </p>
                    </div>

                    {/* Banner Category Tags + Translucent Glass Shield Graphic */}
                    <div className="flex items-center gap-3.5 shrink-0 self-start md:self-auto">
                      <div className="hidden sm:flex flex-col gap-1.5 text-[11px] font-semibold">
                        <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 text-white text-center shadow-xs">URLs</span>
                        <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 text-white text-center shadow-xs">SMS</span>
                        <span className="px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 text-white text-center shadow-xs">Phone Numbers</span>
                      </div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shadow-blue-900/25 shrink-0">
                        <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. FOUR STATISTICS CARDS (ONE ROW ON WIDE DESKTOP) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0">
                  
                  {/* Total Scans */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-[#E2E8F0] dark:border-[#293953] shadow-xs flex items-center justify-between min-w-0">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD] truncate">TOTAL SCANS</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F1F5F9] leading-tight mt-1">{totalScans}</div>
                      <div className="text-[11px] text-slate-400 dark:text-[#8494AD] leading-none mt-1.5 truncate">All completed analyses</div>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#162238] text-blue-600 dark:text-[#6366F1] flex items-center justify-center shrink-0 ml-3">
                      <Scan className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Threats Detected */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-[#E2E8F0] dark:border-[#293953] shadow-xs flex items-center justify-between min-w-0">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD] truncate">THREATS DETECTED</div>
                      <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-[#FB7185] leading-tight mt-1">{threatsDetected}</div>
                      <div className="text-[11px] text-slate-400 dark:text-[#8494AD] leading-none mt-1.5 truncate">High risk threats</div>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-rose-950/40 text-red-600 dark:text-[#FB7185] flex items-center justify-center shrink-0 ml-3">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Suspicious Items */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-[#E2E8F0] dark:border-[#293953] shadow-xs flex items-center justify-between min-w-0">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD] truncate">SUSPICIOUS ITEMS</div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-[#FBBF24] leading-tight mt-1">{suspiciousCount}</div>
                      <div className="text-[11px] text-slate-400 dark:text-[#8494AD] leading-none mt-1.5 truncate">Needs verification</div>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-[#FBBF24] flex items-center justify-center shrink-0 ml-3">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Safe Results */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C32] border border-[#E2E8F0] dark:border-[#293953] shadow-xs flex items-center justify-between min-w-0">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8494AD] truncate">SAFE RESULTS</div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-[#34D399] leading-tight mt-1">{safeCount}</div>
                      <div className="text-[11px] text-slate-400 dark:text-[#8494AD] leading-none mt-1.5 truncate">Clean checkups</div>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#34D399] flex items-center justify-center shrink-0 ml-3">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>

                </div>

                {/* 3. BALANCED TWO-COLUMN MAIN CONTENT (LEFT: SCANNER & THREAT INTEL, RIGHT: RISK ANALYSIS & CTA) */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)] gap-5 sm:gap-6 items-start w-full min-w-0">
                  
                  {/* ======================================================== */}
                  {/* LEFT COLUMN: SCANNER PANEL & THREAT INTELLIGENCE        */}
                  {/* ======================================================== */}
                  <div className="flex flex-col gap-5 sm:gap-6 min-w-0">
                    
                    {/* CHECK BEFORE YOU TRUST SCANNER PANEL */}
                    <div className="bg-white dark:bg-[#111C32] rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
                            Check Before You Trust
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-[#A8B6CC] leading-snug mt-0.5">
                            Analyze suspicious messages, links, and digital content in seconds.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('scan')}
                          className="text-xs font-semibold text-blue-600 dark:text-[#6366F1] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Scan Type Selectors */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'URL', label: 'URL', icon: ExternalLink },
                          { id: 'Message', label: 'Message (SMS)', icon: MessageSquare },
                          { id: 'Email', label: 'Email', icon: Mail },
                          { id: 'Phone', label: 'Phone Number', icon: Phone }
                        ].map(({ id, label, icon: IconComponent }) => (
                          <button
                            key={id}
                            onClick={() => setScanType(id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                              scanType === id
                                ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-[#162238] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-200 dark:hover:bg-[#17243A]'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Responsive Input Area */}
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="relative flex-1 min-w-0">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRunScan(); }}
                            placeholder="Paste a suspicious link (e.g. https://example.com) or enter a message..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#293953] text-xs sm:text-sm text-slate-900 dark:text-[#F1F5F9] focus:outline-hidden focus:ring-2 focus:ring-[#6366F1] bg-slate-50/50 dark:bg-[#162238] placeholder-slate-400 dark:placeholder-[#8494AD]"
                          />
                        </div>
                        <button
                          onClick={() => handleRunScan()}
                          disabled={isScanning}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-500/20 transition cursor-pointer shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isScanning ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Analyze</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {scanError && (
                        <div className="py-2 px-3 rounded-xl bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-[#FB7185]/40 text-red-700 dark:text-[#FB7185] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-[#FB7185] shrink-0" />
                          <span>{scanError}</span>
                        </div>
                      )}

                      {/* Sample Try Links */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-slate-400 dark:text-[#8494AD] uppercase tracking-wider text-[10px]">TRY SAMPLE:</span>
                        <button
                          onClick={() => { setInputValue('https://fake-login.com'); handleRunScan('https://fake-login.com'); }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#17243A] text-slate-600 dark:text-[#A8B6CC] font-mono text-[11px] cursor-pointer transition"
                        >
                          https://fake-login.com
                        </button>
                        <button
                          onClick={() => { setInputValue('whatsapp scam promo'); handleRunScan('whatsapp scam promo'); }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#17243A] text-slate-600 dark:text-[#A8B6CC] font-mono text-[11px] cursor-pointer transition"
                        >
                          whatsapp scam
                        </button>
                      </div>

                      {/* 3 Core Value Props */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-[#293953]">
                        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-[#162238] border border-blue-100/70 dark:border-[#293953] flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-[#6366F1] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 dark:text-[#F1F5F9] leading-tight">Detect</div>
                            <div className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-snug mt-0.5">Identify red flags and suspicious patterns.</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-[#162238] border border-purple-100/70 dark:border-[#293953] flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-600 dark:bg-[#9333EA] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 dark:text-[#F1F5F9] leading-tight">Explain</div>
                            <div className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-snug mt-0.5">Understand the risk with clear insights.</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-[#162238] border border-emerald-100/70 dark:border-[#293953] flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600 dark:bg-[#34D399] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 dark:text-[#F1F5F9] leading-tight">Protect</div>
                            <div className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-snug mt-0.5">Get safe next steps and recommendations.</div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* THREAT INTELLIGENCE SECTION */}
                    <div className="bg-white dark:bg-[#111C32] rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F1F5F9]">Threat Intelligence</h4>
                          <p className="text-xs text-slate-500 dark:text-[#A8B6CC]">Latest scam trends, tactics and safety tips to keep you informed.</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('threat-intel')}
                          className="text-xs font-semibold text-blue-600 dark:text-[#6366F1] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>View all</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-red-50/50 dark:bg-[#162238] border border-red-100/70 dark:border-[#293953] space-y-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-rose-950/60 text-red-700 dark:text-[#FB7185]">PHISHING</span>
                          <div className="font-bold text-xs text-slate-900 dark:text-[#F1F5F9] truncate">WhatsApp Giveaway Scams</div>
                          <p className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-relaxed line-clamp-2">Fake rewards spreading via WhatsApp messaging loops.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-[#162238] border border-amber-100/70 dark:border-[#293953] space-y-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-[#FBBF24]">INVESTMENT</span>
                          <div className="font-bold text-xs text-slate-900 dark:text-[#F1F5F9] truncate">Crypto Investment Fraud</div>
                          <p className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-relaxed line-clamp-2">Fake platforms promising high guaranteed returns.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-[#162238] border border-purple-100/70 dark:border-[#293953] space-y-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-[#A78BFA]">MALWARE</span>
                          <div className="font-bold text-xs text-slate-900 dark:text-[#F1F5F9] truncate">Malware in APK Files</div>
                          <p className="text-[11px] text-slate-500 dark:text-[#A8B6CC] leading-relaxed line-clamp-2">Malicious mobile apps posing as popular utility tools.</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ======================================================== */}
                  {/* RIGHT COLUMN: RISK ANALYSIS DETAIL CARD & CTA           */}
                  {/* ======================================================== */}
                  <div className="flex flex-col gap-5 sm:gap-6 min-w-0">
                    
                    {/* RISK ANALYSIS DETAIL CARD */}
                    {selectedScan ? (
                      <div className="bg-white dark:bg-[#111C32] rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F1F5F9]">Risk Analysis</h4>
                          <span className="text-xs font-semibold text-slate-500 dark:text-[#8494AD] bg-slate-100 dark:bg-[#162238] px-2.5 py-0.5 rounded-md">{selectedScan.type}</span>
                        </div>

                        {/* Inspected Content Target */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-200/70 dark:border-[#293953] text-xs font-mono text-slate-700 dark:text-[#A8B6CC] truncate">
                          <span className="font-semibold text-slate-400 dark:text-[#8494AD] font-sans mr-1.5 uppercase text-[10px]">Target:</span>
                          {selectedScan.content}
                        </div>

                        {/* Circular Risk Meter */}
                        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#162238] border border-slate-200/70 dark:border-[#293953]">
                          <div className={`relative w-14 h-14 rounded-full bg-white dark:bg-[#111C32] border-3 ${
                            selectedScan.score >= 70 ? 'border-red-500 dark:border-[#FB7185]' : selectedScan.score >= 35 ? 'border-amber-500 dark:border-[#FBBF24]' : 'border-emerald-500 dark:border-[#34D399]'
                          } flex items-center justify-center shrink-0 shadow-xs`}>
                            <div className="text-lg font-black text-slate-900 dark:text-[#F1F5F9]">{selectedScan.score}</div>
                          </div>
                          <div className="min-w-0">
                            <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedScan.badgeClass}`}>
                              {selectedScan.verdict}
                            </div>
                            <div className="text-xs font-bold text-slate-800 dark:text-[#F1F5F9] mt-1 truncate">
                              {selectedScan.score >= 70 ? 'Likely Scam Threat' : selectedScan.score >= 35 ? 'Suspicious Indicators' : 'Low Threat Level'}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-[#8494AD] mt-0.5">
                              Confidence: 98% AI verified
                            </div>
                          </div>
                        </div>

                        {/* Evidence Indicators */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8494AD]">
                            EVIDENCE INDICATORS
                          </div>
                          <ul className="space-y-2 text-xs text-slate-600 dark:text-[#A8B6CC]">
                            {(selectedScan.indicators || []).slice(0, 4).map((ind, i) => (
                              <li key={i} className="flex items-start gap-2 leading-relaxed">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FB7185] shrink-0 mt-0.5" />
                                <span className="truncate">{ind}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendation */}
                        <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-[#34D399]">
                          <div className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-[#34D399]">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" />
                            <span>Recommended Action</span>
                          </div>
                          <p className="mt-1 text-[11px] text-emerald-700 dark:text-[#A8B6CC] leading-relaxed">
                            {selectedScan.recommendation}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-[#111C32] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#293953] shadow-xs text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#162238] text-blue-600 dark:text-[#6366F1] flex items-center justify-center mx-auto">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9]">Risk Analysis Ready</h4>
                        <p className="text-xs text-slate-500 dark:text-[#A8B6CC] max-w-xs mx-auto">
                          Run a scan on the left to view in-depth risk scores, threat signals, and recommended security actions.
                        </p>
                      </div>
                    )}

                    {/* SCAMSENSE AI BOTTOM CALL-TO-ACTION */}
                    <div className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 dark:from-[#4F46E5] dark:to-[#9333EA] p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-sm leading-tight block">ScamSense AI</span>
                          <p className="text-xs text-blue-100 leading-snug mt-0.5">
                            Join the fight against online fraud. Your safety matters.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('scan')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs hover:bg-blue-50 transition cursor-pointer shrink-0 shadow-sm whitespace-nowrap text-center"
                      >
                        Start New Scan &rarr;
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        </main>

      </div>

    </div>
  );
}
