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

export default function ScanHistoryView({ scans = [], onNavigateToScan, onDeleteScan }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerdict, setSelectedVerdict] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReportModal, setActiveReportModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load real history from API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadBackendHistory() {
      setLoading(true);
      try {
        const res = await getScanHistory();
        if (isMounted && res && res.data && Array.isArray(res.data)) {
          const formatted = res.data.map(s => {
            const score = Math.round(s.risk_score || 0);
            const verdict = s.verdict === 'High Risk' || s.verdict === 'SCAM' || score >= 70
              ? 'Danger'
              : s.verdict === 'Suspicious' || score >= 35
              ? 'Suspicious'
              : 'Safe';

            return {
              id: String(s.id),
              content: s.input_content || s.content || 'Scanned Content',
              type: (s.scan_type || 'URL').toUpperCase(),
              subType: `${(s.scan_type || 'Scan').toUpperCase()} • ${s.scam_category || s.verdict || 'Analysis'}`,
              date: s.created_at ? new Date(s.created_at).toLocaleString() : 'Just now',
              rawDate: s.created_at || new Date().toISOString(),
              score,
              verdict,
              badgeClass: verdict === 'Danger'
                ? 'bg-red-50 text-red-700 border-red-200'
                : verdict === 'Suspicious'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200',
              iconBg: verdict === 'Danger' ? 'bg-red-100 text-red-600' : verdict === 'Suspicious' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600',
              indicators: [s.summary || 'Security analysis complete.'],
              recommendation: 'Follow standard verification rules before submitting credentials.'
            };
          });

          // Merge with any in-memory external scans passed from parent
          if (scans && scans.length > 0) {
            const externalFormatted = scans.map(s => ({
              id: String(s.id),
              content: s.content || s.input_content || 'Scanned Content',
              type: (s.type || s.scan_type || 'URL').toUpperCase(),
              subType: `${(s.type || 'Scan').toUpperCase()} • ${s.verdict || 'Analysis'}`,
              date: s.date || 'Just now',
              rawDate: s.rawDate || new Date().toISOString(),
              score: Math.round(s.score !== undefined ? s.score : (s.risk_score || 0)),
              verdict: s.verdict === 'High Risk' || s.verdict === 'Danger' || s.verdict === 'SCAM' ? 'Danger' : (s.verdict || 'Safe'),
              badgeClass: s.badgeClass || 'bg-emerald-50 text-emerald-700 border-emerald-200',
              iconBg: s.iconBg || 'bg-[#2563EB]/10 text-[#2563EB]',
              indicators: s.indicators || ['Observed signal analysis complete'],
              recommendation: s.recommendation || 'Follow standard verification rules.'
            }));
            const combined = [...externalFormatted, ...formatted];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
            setHistoryList(unique);
          } else {
            setHistoryList(formatted);
          }
        } else if (scans && scans.length > 0) {
          setHistoryList(scans);
        }
      } catch (err) {
        console.warn('Scan history load error:', err);
        if (scans && scans.length > 0) {
          setHistoryList(scans);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBackendHistory();
    return () => { isMounted = false; };
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

  // Calculate real top summary card metrics without mock offsets
  const totalCount = historyList.length;
  const dangerCount = historyList.filter(h => h.verdict === 'Danger' || h.verdict === 'High Risk').length;
  const safeCount = historyList.filter(h => h.verdict === 'Safe').length;

  const handleCopySummary = (item) => {
    const summary = `ScamSense AI Report\nTarget: ${item.content}\nVerdict: ${item.verdict} (${item.score}/100)\nDate: ${item.date}\nIndicators:\n${item.indicators.map(i => '- ' + i).join('\n')}`;
    navigator.clipboard.writeText(summary);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteScanHistory(id);
    } catch (err) {
      console.warn("Could not delete record from backend:", err);
    }
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F1F5F9] tracking-tight">
            Scan History
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A8B6CC] mt-1">
            Track your past scans, risk assessments and safety actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#293953] bg-white dark:bg-[#162238] hover:bg-slate-50 dark:hover:bg-[#17243A] text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] flex items-center gap-2 transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-[#8494AD]" />
            <span>Export History</span>
          </button>

          <button
            onClick={() => onNavigateToScan && onNavigateToScan()}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#9333EA] hover:from-[#4338CA] hover:to-[#7E22CE] text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS (Matching Reference Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Scans Card */}
        <div className="bg-linear-to-br from-[#2563EB]/10 via-purple-50/50 to-white dark:from-[#111C32] dark:via-[#162238] dark:to-[#17243A] rounded-3xl p-6 border border-blue-100 dark:border-[#293953] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">Total Scans</div>
            <div className="text-3xl font-black text-[#111827] dark:text-[#F1F5F9] tracking-tight">{totalCount.toLocaleString()}</div>
            <div className="text-xs font-semibold text-[#2563EB] dark:text-[#6366F1] flex items-center gap-1">
              <span>+124 this month ↑</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#4F46E5] to-[#9333EA] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <BrainCircuit className="w-7 h-7" />
          </div>
        </div>

        {/* Threats Blocked Card */}
        <div className="bg-linear-to-br from-emerald-50/60 to-white dark:from-[#111C32] dark:via-[#162238] dark:to-[#0F1E2A] rounded-3xl p-6 border border-emerald-100 dark:border-[#293953] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">Threats Blocked</div>
            <div className="text-3xl font-black text-[#111827] dark:text-[#F1F5F9] tracking-tight">{dangerCount}</div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-[#34D399] flex items-center gap-1">
              <span>+12 this month ↑</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Safe Links Card */}
        <div className="bg-linear-to-br from-amber-50/60 to-white dark:from-[#111C32] dark:via-[#162238] dark:to-[#23202E] rounded-3xl p-6 border border-amber-100 dark:border-[#293953] shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">Safe Links</div>
            <div className="text-3xl font-black text-[#111827] dark:text-[#F1F5F9] tracking-tight">{safeCount.toLocaleString()}</div>
            <div className="text-xs font-semibold text-amber-700 dark:text-[#FBBF24] flex items-center gap-1">
              <span>+89 this month ↑</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500 dark:bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
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
                ? 'bg-[#0B1224] dark:bg-[#6366F1] text-white shadow-xs'
                : 'bg-white dark:bg-[#162238] border border-[#E2E8F0] dark:border-[#293953] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#17243A]'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedVerdict('Safe')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedVerdict === 'Safe'
                ? 'bg-emerald-600 dark:bg-[#34D399] text-white dark:text-[#0B1120] shadow-xs'
                : 'bg-emerald-50 dark:bg-[#162238] text-emerald-700 dark:text-[#34D399] border border-emerald-200 dark:border-[#293953] hover:bg-emerald-100 dark:hover:bg-[#17243A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#34D399]" />
            <span>Safe</span>
          </button>

          <button
            onClick={() => setSelectedVerdict('Suspicious')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedVerdict === 'Suspicious'
                ? 'bg-amber-600 dark:bg-[#FBBF24] text-white dark:text-[#0B1120] shadow-xs'
                : 'bg-amber-50 dark:bg-[#162238] text-amber-700 dark:text-[#FBBF24] border border-amber-200 dark:border-[#293953] hover:bg-amber-100 dark:hover:bg-[#17243A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FBBF24]" />
            <span>Suspicious</span>
          </button>

          <button
            onClick={() => setSelectedVerdict('Danger')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedVerdict === 'Danger'
                ? 'bg-red-600 dark:bg-[#FB7185] text-white dark:text-[#0B1120] shadow-xs'
                : 'bg-red-50 dark:bg-[#162238] text-red-700 dark:text-[#FB7185] border border-red-200 dark:border-[#293953] hover:bg-red-100 dark:hover:bg-[#17243A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-[#FB7185]" />
            <span>Danger</span>
          </button>
        </div>

        {/* Date Dropdown & Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#293953] bg-white dark:bg-[#162238] text-xs font-semibold text-slate-700 dark:text-[#F1F5F9] focus:outline-hidden cursor-pointer"
            >
              <option value="Last 30 days">📅 Last 30 days</option>
              <option value="Last 7 days">📅 Last 7 days</option>
              <option value="Last 90 days">📅 Last 90 days</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#8494AD] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in history..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#293953] bg-white dark:bg-[#162238] text-xs text-slate-900 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-[#6366F1]"
            />
          </div>
        </div>

      </div>

      {/* SCAN RECORDS TABLE / CARDS (Matching Reference Screenshot 1) */}
      <div className="bg-white dark:bg-[#0F1A2D] rounded-3xl border border-[#E2E8F0] dark:border-[#293953] shadow-sm overflow-hidden">
        
        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-[#17243A] border-b border-[#E2E8F0] dark:border-[#293953] text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">
          <div className="col-span-5">Input / Type</div>
          <div className="col-span-2 text-center">Risk Score</div>
          <div className="col-span-3">Verdict</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Records Rows */}
        <div className="divide-y divide-slate-100 dark:divide-[#293953]/60">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-[#8494AD] space-y-2 dark:bg-[#0F1A2D]">
              <History className="w-10 h-10 mx-auto text-slate-300 dark:text-[#8494AD]" />
              <div className="font-bold text-slate-700 dark:text-[#F1F5F9]">No scan history records found.</div>
              <p className="text-xs text-slate-500 dark:text-[#8494AD]">Try clearing your search query or run a new scan.</p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isDanger = item.verdict === 'Danger' || item.verdict === 'High Risk';
              const isSuspicious = item.verdict === 'Suspicious';
              
              const rowBorderClass = isDanger 
                ? 'border-l-4 border-l-red-500 dark:border-l-[#FB7185] bg-red-50/20 dark:bg-rose-950/20' 
                : isSuspicious 
                ? 'border-l-4 border-l-amber-500 dark:border-l-[#FBBF24] bg-amber-50/20 dark:bg-amber-950/20' 
                : 'border-l-4 border-l-emerald-500 dark:border-l-[#34D399] bg-emerald-50/20 dark:bg-emerald-950/20';

              return (
                <div 
                  key={item.id}
                  className={`p-4 sm:px-6 transition hover:bg-slate-50/80 dark:hover:bg-[#162238]/60 ${rowBorderClass}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Input / Type */}
                    <div className="md:col-span-5 flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isDanger ? 'bg-red-500 dark:bg-[#FB7185] text-white' : isSuspicious ? 'bg-amber-500 dark:bg-[#FBBF24] text-white' : 'bg-emerald-500 dark:bg-[#34D399] text-white'
                      }`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9] truncate font-mono">
                          {item.content}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-[#A8B6CC] font-medium">
                          {item.subType || `${item.type} • Inspection`}
                        </div>
                      </div>
                    </div>

                    {/* Risk Score Gauge */}
                    <div className="md:col-span-2 flex justify-start md:justify-center">
                      <div className={`w-11 h-11 rounded-full font-black text-sm flex items-center justify-center border-2 ${
                        isDanger 
                          ? 'border-red-500 dark:border-[#FB7185] text-red-600 dark:text-[#FB7185] bg-red-50 dark:bg-rose-950/40' 
                          : isSuspicious 
                          ? 'border-amber-500 dark:border-[#FBBF24] text-amber-600 dark:text-[#FBBF24] bg-amber-50 dark:bg-amber-950/40' 
                          : 'border-emerald-500 dark:border-[#34D399] text-emerald-600 dark:text-[#34D399] bg-emerald-50 dark:bg-emerald-950/40'
                      }`}>
                        {item.score}
                      </div>
                    </div>

                    {/* Verdict & Date */}
                    <div className="md:col-span-3 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          isDanger ? 'bg-red-500 dark:bg-[#FB7185]' : isSuspicious ? 'bg-amber-500 dark:bg-[#FBBF24]' : 'bg-emerald-500 dark:bg-[#34D399]'
                        }`} />
                        <span className={`text-xs font-bold ${
                          isDanger ? 'text-red-700 dark:text-[#FB7185]' : isSuspicious ? 'text-amber-700 dark:text-[#FBBF24]' : 'text-emerald-700 dark:text-[#34D399]'
                        }`}>
                          {item.verdict}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-[#8494AD] font-medium">
                        {item.date}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveReportModal(item)}
                        className="px-4 py-2 rounded-xl border border-blue-200 dark:border-[#293953] bg-white dark:bg-[#162238] hover:bg-blue-50 dark:hover:bg-[#17243A] text-xs font-bold text-[#2563EB] dark:text-[#6366F1] transition cursor-pointer shadow-2xs"
                      >
                        View Report &rarr;
                      </button>

                      <button
                        onClick={() => handleCopySummary(item)}
                        className="p-2 rounded-lg text-slate-400 dark:text-[#8494AD] hover:text-slate-600 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#162238] transition"
                        title="Copy Summary"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteRecord(item.id)}
                        className="p-2 rounded-lg text-slate-400 dark:text-[#8494AD] hover:text-red-600 dark:hover:text-[#FB7185] hover:bg-red-50 dark:hover:bg-rose-950/40 transition"
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
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#17243A] border-t border-[#E2E8F0] dark:border-[#293953] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#8494AD] font-semibold">
          <div>
            Showing 1-{filteredList.length} of {totalCount.toLocaleString()} results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#293953] bg-white dark:bg-[#162238] hover:bg-slate-100 dark:hover:bg-[#17243A] disabled:opacity-50 cursor-pointer text-slate-700 dark:text-[#F1F5F9]"
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                currentPage === 1 ? 'bg-[#4F46E5] text-white' : 'bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#293953] text-slate-700 dark:text-[#F1F5F9]'
              }`}
            >
              1
            </button>

            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                currentPage === 2 ? 'bg-[#4F46E5] text-white' : 'bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#293953] text-slate-700 dark:text-[#F1F5F9]'
              }`}
            >
              2
            </button>

            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                currentPage === 3 ? 'bg-[#4F46E5] text-white' : 'bg-white dark:bg-[#162238] border border-slate-200 dark:border-[#293953] text-slate-700 dark:text-[#F1F5F9]'
              }`}
            >
              3
            </button>

            <span className="px-1 text-slate-400 dark:text-[#8494AD]">...</span>

            <button
              onClick={() => setCurrentPage(462)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#293953] bg-white dark:bg-[#162238] hover:bg-slate-100 dark:hover:bg-[#17243A] text-slate-700 dark:text-[#F1F5F9]"
            >
              462
            </button>

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#293953] bg-white dark:bg-[#162238] hover:bg-slate-100 dark:hover:bg-[#17243A] cursor-pointer flex items-center gap-1 text-slate-700 dark:text-[#F1F5F9]"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* DETAILED REPORT MODAL */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C32] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-[#293953] space-y-6 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#293953] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#4F46E5] to-[#9333EA] text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">Historical Scan Record</h3>
                  <div className="text-xs text-slate-400 dark:text-[#8494AD] font-mono">ID: {activeReportModal.id} • {activeReportModal.date}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="p-2 rounded-xl text-slate-400 dark:text-[#8494AD] hover:text-slate-600 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#162238] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#8494AD]">Inspected Content</span>
              <div className="p-3 bg-slate-50 dark:bg-[#162238] rounded-xl border border-slate-200 dark:border-[#293953] font-mono text-xs text-slate-800 dark:text-[#F1F5F9] break-all">
                {activeReportModal.content}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953]">
                <div className="text-xs text-slate-500 dark:text-[#8494AD] font-semibold">Classification</div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-[#F1F5F9] mt-0.5">{activeReportModal.verdict}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953]">
                <div className="text-xs text-slate-500 dark:text-[#8494AD] font-semibold">Threat Score</div>
                <div className="text-lg font-extrabold text-red-600 dark:text-[#FB7185] mt-0.5">{activeReportModal.score} / 100</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] uppercase tracking-wider">
                Confirmed Evidence Indicators
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#A8B6CC]">
                {activeReportModal.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/60 dark:bg-rose-950/30 border border-red-100 dark:border-[#FB7185]/30">
                    <span className="text-red-600 dark:text-[#FB7185] font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-[#34D399]">
              <div className="font-bold">Recommended Guidance:</div>
              <p className="mt-0.5 text-emerald-800 dark:text-[#A8B6CC]">{activeReportModal.recommendation}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopySummary(activeReportModal)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#293953] text-xs font-bold text-slate-700 dark:text-[#F1F5F9] hover:bg-slate-50 dark:hover:bg-[#162238]"
              >
                Copy Summary
              </button>
              <button
                onClick={() => setActiveReportModal(null)}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[#4F46E5] to-[#9333EA] text-white text-xs font-bold"
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
