import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Download, 
  Activity, 
  PieChart, 
  Layers, 
  Calendar,
  ExternalLink,
  MessageSquare,
  QrCode,
  Image as ImageIcon
} from 'lucide-react';

export default function AnalyticsView({ scans = [] }) {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive counts from actual dataset plus baseline hackathon demonstration metrics
  const extraScansCount = scans ? scans.length : 0;
  const totalScans = 1842 + extraScansCount;
  const threatsDetected = 97 + scans.filter(s => s.verdict === 'High Risk' || s.verdict === 'Danger').length;
  const suspiciousCount = 386 + scans.filter(s => s.verdict === 'Suspicious').length;
  const safeCount = 1248 + scans.filter(s => s.verdict === 'Safe').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExportAnalytics = () => {
    const csvContent = `data:text/csv;charset=utf-8,Metric,Value,Trend\nTotal Scans,${totalScans},+12%\nThreats Detected,${threatsDetected},+31%\nSuspicious,${suspiciousCount},+19%\nSafe,${safeCount},+12%\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scamsense_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header with Title & Date Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Insights into your scans, threats detected and safety trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="Last 7 Days">📅 Last 7 Days</option>
              <option value="Last 30 Days">📅 Last 30 Days</option>
              <option value="Last 90 Days">📅 Last 90 Days</option>
              <option value="All Time">📅 All Time</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-2xs"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportAnalytics}
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 KPI CARDS (Matching Reference Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Scans */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scans</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{totalScans.toLocaleString()}</div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Threats Detected */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Threats Detected</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{threatsDetected}</div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+31%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Suspicious */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspicious</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{suspiciousCount}</div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+19%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Safe */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safe</div>
            <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{safeCount.toLocaleString()}</div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </div>
        </div>

      </div>

      {/* MIDDLE GRID: TRENDS LINE CHART & DONUT CHART (Matching Reference Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Scam Trends Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Scam Trends ({dateRange})</h3>
                <p className="text-xs text-slate-500">Daily threats detected over the past 30 days</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                <span>Detected Threats</span>
              </div>
            </div>
          </div>

          {/* Responsive Line Chart SVG */}
          <div className="relative w-full h-56 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeWidth="1" />

              {/* Y Axis values */}
              <text x="0" y="24" fill="#94A3B8" fontSize="10" className="font-sans">20</text>
              <text x="0" y="64" fill="#94A3B8" fontSize="10" className="font-sans">15</text>
              <text x="0" y="104" fill="#94A3B8" fontSize="10" className="font-sans">10</text>
              <text x="0" y="144" fill="#94A3B8" fontSize="10" className="font-sans">0</text>

              {/* Smooth Trend Path */}
              <path
                d="M 30,120 Q 80,100 130,85 T 230,70 T 330,40 T 410,65 T 480,45"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Filled Area below curve */}
              <path
                d="M 30,120 Q 80,100 130,85 T 230,70 T 330,40 T 410,65 T 480,45 L 480,140 L 30,140 Z"
                fill="url(#trendGradient)"
              />

              {/* Plot Data Points */}
              <circle cx="30" cy="120" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="80" cy="100" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="130" cy="85" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="180" cy="90" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="230" cy="70" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="330" cy="40" r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="410" cy="65" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="480" cy="45" r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-4">
              <span>Oct 8</span>
              <span>Oct 14</span>
              <span>Oct 21</span>
              <span>Oct 28</span>
              <span>Nov 4</span>
            </div>
          </div>

        </div>

        {/* Right: Scam Types Distribution Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Scam Types Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown by category</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Phishing 42% */}
                <circle cx="50" cy="50" r="38" stroke="#2563EB" strokeWidth="16" strokeDasharray="100.5 138.8" strokeDashoffset="0" fill="none" />
                {/* OTP 28% */}
                <circle cx="50" cy="50" r="38" stroke="#7C3AED" strokeWidth="16" strokeDasharray="67 172.3" strokeDashoffset="-100.5" fill="none" />
                {/* Investment 18% */}
                <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="16" strokeDasharray="43 196.3" strokeDashoffset="-167.5" fill="none" />
                {/* Malware 12% */}
                <circle cx="50" cy="50" r="38" stroke="#EF4444" strokeWidth="16" strokeDasharray="28.7 210.6" strokeDashoffset="-210.5" fill="none" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Threats</span>
                <span className="text-lg font-black text-slate-900">100%</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                <span>Phishing — 42%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
                <span>OTP Fraud — 28%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span>Investment — 18%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                <span>Malware — 12%</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM GRID: DETECTION SOURCES & RECENT ACTIVITY (Matching Reference Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Detection Sources Progress Bars (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Detection Sources</h3>
            <p className="text-xs text-slate-500">Where threats were identified</p>
          </div>

          <div className="space-y-4 pt-1">
            
            {/* Message Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Message (SMS / WhatsApp)</span>
                <span>42%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 h-full rounded-full w-[42%]" />
              </div>
            </div>

            {/* URL Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>URL & Domain</span>
                <span>31%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[31%]" />
              </div>
            </div>

            {/* QR Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>QR Code</span>
                <span>18%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full w-[18%]" />
              </div>
            </div>

            {/* Screenshot Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Screenshot OCR</span>
                <span>12%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="bg-pink-500 h-full rounded-full w-[12%]" />
              </div>
            </div>

          </div>
        </div>

        {/* Right: Recent Activity List (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500">Latest detections with risk score</p>
          </div>

          <div className="space-y-3">
            
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Suspicious bank domain flagged</div>
                  <div className="text-[11px] text-slate-400">Today • 10:32 AM</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                Risk: 89
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">OTP phishing SMS detected</div>
                  <div className="text-[11px] text-slate-400">2 days ago • 2:10 PM</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                Risk: 62
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Safe URL — no threats found</div>
                  <div className="text-[11px] text-slate-400">2 days ago • 2:10 PM</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Risk: 12
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Investment scam link blocked</div>
                  <div className="text-[11px] text-slate-400">3 days ago • 11:05 AM</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                Risk: 74
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export { AnalyticsView as AnalyticsDashboard };
