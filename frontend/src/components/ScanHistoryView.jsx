import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Download, 
  Plus, 
  ChevronRight, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  X, 
  BrainCircuit, 
  Calendar,
  Filter
} from 'lucide-react';
import { getScanHistory, deleteScanHistory } from '../services/api';

const INITIAL_MOCK_HISTORY = [
  {
    id: 'hist-101',
    content: 'https://secure-pay-verify.net',
    type: 'URL',
    subType: 'Phishing attempt',
    date: 'Oct 8, 2025 • 10:42 AM',
    rawDate: '2025-10-08',
    score: 88,
    verdict: 'Danger',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    iconBg: 'bg-red-100 text-red-600',
    indicators: ['Suspicious domain: secure-pay-verify.net', 'Impersonation cues: bank branding', 'No HTTPS; mismatched sender'],
    recommendation: 'Do not click or enter credentials. Block sender.'
  },
  {
    id: 'hist-102',
    content: 'WhatsApp lottery message',
    type: 'Message',
    subType: 'Message (SMS) • Lottery scam',
    date: 'Oct 7, 2025 • 03:18 PM',
    rawDate: '2025-10-07',
    score: 92,
    verdict: 'Danger',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    iconBg: 'bg-red-100 text-red-600',
    indicators: ['Fake lottery reward lure', 'Viral forwarding requirement', 'Unverified shortened link'],
    recommendation: 'Do not reply or click links. Report sender.'
  },
  {
    id: 'hist-103',
    content: 'Bank OTP screenshot',
    type: 'Screenshot',
    subType: 'Screenshot • OTP scam',
    date: 'Oct 5, 2025 • 09:15 AM',
    rawDate: '2025-10-05',
    score: 76,
    verdict: 'Suspicious',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    indicators: ['Urgent verification request', 'Potential remote access lure'],
    recommendation: 'Do not share OTP with callers.'
  },
  {
    id: 'hist-104',
    content: 'https://officialbank.com',
    type: 'URL',
    subType: 'URL • Legitimate site',
    date: 'Oct 4, 2025 • 02:30 PM',
    rawDate: '2025-10-04',
    score: 12,
    verdict: 'Safe',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    indicators: ['Verified domain registration', 'Valid SSL certificate'],
    recommendation: 'No threat indicators detected.'
  }
];

export default function ScanHistoryView({ scans = [], onNavigateToScan, onDeleteScan }) {
  const [historyList, setHistoryList] = useState(INITIAL_MOCK_HISTORY);
  const [selectedVerdict, setSelectedVerdict] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReportModal, setActiveReportModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync external scans if provided
  useEffect(() => {
    if (scans && scans.length > 0) {
      const formattedExternal = scans.map(s => ({
        id: s.id || `hist-${Date.now()}`,
        content: s.content || s.input_content || 'Scanned Content',
        type: s.type || s.scan_type || 'URL',
        subType: `${s.type || 'Scan'} • ${s.verdict || 'Analysis'}`,
        date: s.date || (s.created_at ? new Date(s.created_at).toLocaleString() : 'Just now'),
        rawDate: s.rawDate || new Date().toISOString(),
        score: s.score !== undefined ? s.score : (s.risk_score || 0),
        verdict: s.verdict === 'High Risk' || s.verdict === 'Dangerous' ? 'Danger' : (s.verdict || 'Safe'),
        badgeClass: s.badgeClass || (s.verdict === 'High Risk' || s.verdict === 'Danger' ? 'bg-red-50 text-red-700 border-red-200' : s.verdict === 'Suspicious' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'),
        iconBg: s.iconBg || 'bg-[#2563EB]/10 text-[#2563EB]',
        indicators: s.indicators || ['Observed signal analysis complete'],
        recommendation: s.recommendation || 'Follow standard verification rules.'
      }));

      // Combine and deduplicate
      setHistoryList(prev => {
        const combined = [...formattedExternal, ...prev];
        const unique = Array.from(new Map(combined.map(item => [item.content, item])).values());
        return unique;
      });
    }
  }, [scans]);

  // Filtering
  const filteredList = historyList.filter(item => {
    const matchesVerdict = selectedVerdict === 'All' || 
      (selectedVerdict === 'Danger' && (item.verdict === 'Danger' || item.verdict === 'High Risk')) ||
      (selectedVerdict === 'Suspicious' && item.verdict === 'Suspicious') ||
      (selectedVerdict === 'Safe' && item.verdict === 'Safe');

    const matchesSearch = searchQuery === '' || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesVerdict && matchesSearch;
  });

  // Calculate top summary card metrics
  const totalCount = 1842 + (historyList.length - INITIAL_MOCK_HISTORY.length);
  const dangerCount = 97 + historyList.filter(h => h.verdict === 'Danger').length - 2;
  const safeCount = 1248 + historyList.filter(h => h.verdict === 'Safe').length - 1;

  const handleCopySummary = (item) => {
    const summary = `ScamSense AI Report\nTarget: ${item.content}\nVerdict: ${item.verdict} (${item.score}/100)\nDate: ${item.date}\nIndicators:\n${item.indicators.map(i => '- ' + i).join('\n')}`;
    navigator.clipboard.writeText(summary);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteRecord = (id) => {
    setHistoryList(prev => prev.filter(item => item.id !== id));
    setDeleteConfirmId(null);
    if (onDeleteScan) onDeleteScan(id);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Content', 'Risk Score', 'Verdict', 'Date'];
    const rows = filteredList.map(item => [
      item.id,
      item.type,
      `"${item.content.replace(/"/g, '""')}"`,
      item.score,
      item.verdict,
      `"${item.date}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scamsense_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header with Title & Primary CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Scan History
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Track your past scans, risk assessments and safety actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export History</span>
          </button>

          <button
            onClick={() => onNavigateToScan && onNavigateToScan()}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-xs font-bold text-white shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS (Matching Reference Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Scans Card */}
        <div className="bg-linear-to-br from-[#2563EB]/10 via-purple-50/50 to-white rounded-3xl p-6 border border-blue-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scans</div>
            <div className="text-3xl font-black text-[#111827] tracking-tight">{totalCount.toLocaleString()}</div>
            <div className="text-xs font-semibold text-[#2563EB] flex items-center gap-1">
              <span>+124 this month ↑</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <BrainCircuit className="w-7 h-7" />
          </div>
        </div>

        {/* Threats Blocked Card */}
        <div className="bg-linear-to-br from-emerald-50/60 to-white rounded-3xl p-6 border border-emerald-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Threats Blocked</div>
            <div className="text-3xl font-black text-[#111827] tracking-tight">{dangerCount}</div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>+12 this month ↑</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Safe Links Card */}
        <div className="bg-linear-to-br from-amber-50/60 to-white rounded-3xl p-6 border border-amber-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safe Links</div>
            <div className="text-3xl font-black text-[#111827] tracking-tight">{safeCount.toLocaleString()}</div>
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
              <span>+89 this month ↑</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* FILTER BAR & SEARCH (Matching Reference Screenshot 1) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        
        {/* Verdict Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedVerdict('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              selectedVerdict === 'All'
                ? 'bg-[#0B1224] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedVerdict('Safe')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedVerdict === 'Safe'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Safe</span>
          </button>

          <button
            onClick={() => setSelectedVerdict('Suspicious')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedVerdict === 'Suspicious'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Suspicious</span>
          </button>

          <button
            onClick={() => setSelectedVerdict('Danger')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedVerdict === 'Danger'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Danger</span>
          </button>
        </div>

        {/* Date Dropdown & Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="Last 30 days">📅 Last 30 days</option>
              <option value="Last 7 days">📅 Last 7 days</option>
              <option value="Last 90 days">📅 Last 90 days</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in history..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

      </div>

      {/* SCAN RECORDS TABLE / CARDS (Matching Reference Screenshot 1) */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        
        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-[#E2E8F0] text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">Input / Type</div>
          <div className="col-span-2 text-center">Risk Score</div>
          <div className="col-span-3">Verdict</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Records Rows */}
        <div className="divide-y divide-slate-100">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-300" />
              <div className="font-bold text-slate-700">No scan history records found.</div>
              <p className="text-xs text-slate-500">Try clearing your search query or run a new scan.</p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isDanger = item.verdict === 'Danger' || item.verdict === 'High Risk';
              const isSuspicious = item.verdict === 'Suspicious';
              
              const rowBorderClass = isDanger 
                ? 'border-l-4 border-l-red-500 bg-red-50/20' 
                : isSuspicious 
                ? 'border-l-4 border-l-amber-500 bg-amber-50/20' 
                : 'border-l-4 border-l-emerald-500 bg-emerald-50/20';

              return (
                <div 
                  key={item.id}
                  className={`p-4 sm:px-6 transition hover:bg-slate-50/80 ${rowBorderClass}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Input / Type */}
                    <div className="md:col-span-5 flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isDanger ? 'bg-red-500 text-white' : isSuspicious ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate font-mono">
                          {item.content}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {item.subType || `${item.type} • Inspection`}
                        </div>
                      </div>
                    </div>

                    {/* Risk Score Gauge */}
                    <div className="md:col-span-2 flex justify-start md:justify-center">
                      <div className={`w-11 h-11 rounded-full font-black text-sm flex items-center justify-center border-2 ${
                        isDanger 
                          ? 'border-red-500 text-red-600 bg-red-50' 
                          : isSuspicious 
                          ? 'border-amber-500 text-amber-600 bg-amber-50' 
                          : 'border-emerald-500 text-emerald-600 bg-emerald-50'
                      }`}>
                        {item.score}
                      </div>
                    </div>

                    {/* Verdict & Date */}
                    <div className="md:col-span-3 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          isDanger ? 'bg-red-500' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className={`text-xs font-bold ${
                          isDanger ? 'text-red-700' : isSuspicious ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {item.verdict}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {item.date}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveReportModal(item)}
                        className="px-4 py-2 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-xs font-bold text-[#2563EB] transition cursor-pointer shadow-2xs"
                      >
                        View Report &rarr;
                      </button>

                      <button
                        onClick={() => handleCopySummary(item)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        title="Copy Summary"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteRecord(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION FOOTER (Matching Reference Screenshot 1) */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-semibold">
          <div>
            Showing 1-{filteredList.length} of {totalCount.toLocaleString()} results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                currentPage === 1 ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              1
            </button>

            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                currentPage === 2 ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              2
            </button>

            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                currentPage === 3 ? 'bg-[#2563EB] text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              3
            </button>

            <span className="px-1 text-slate-400">...</span>

            <button
              onClick={() => setCurrentPage(462)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
            >
              462
            </button>

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* DETAILED REPORT MODAL */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Historical Scan Record</h3>
                  <div className="text-xs text-slate-400 font-mono">ID: {activeReportModal.id} • {activeReportModal.date}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inspected Content</span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-all">
                {activeReportModal.content}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Classification</div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">{activeReportModal.verdict}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Threat Score</div>
                <div className="text-lg font-extrabold text-red-600 mt-0.5">{activeReportModal.score} / 100</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Confirmed Evidence Indicators
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeReportModal.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/60 border border-red-100">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <div className="font-bold">Recommended Guidance:</div>
              <p className="mt-0.5 text-emerald-800">{activeReportModal.recommendation}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopySummary(activeReportModal)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Copy Summary
              </button>
              <button
                onClick={() => setActiveReportModal(null)}
                className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export { ScanHistoryView as ScanHistory };
