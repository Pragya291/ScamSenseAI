import React, { useState } from 'react';
import { scanUrl } from '../services/api';
import { Link2, ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw, CheckCircle2, XCircle, Search, ExternalLink, Info, Database } from 'lucide-react';

export function UrlScanner() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!urlInput.trim() || urlInput.length < 3) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await scanUrl(urlInput);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to scan URL. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Dual-Provider Reputation: Google Safe Browsing + VirusTotal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            URL Phishing & Security Shield
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Verify domain links against global threat intelligence databases, typosquatting brand detectors, and VirusTotal antivirus engines before clicking.
          </p>
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleScan} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <label className="block text-sm font-semibold text-slate-300">
          Target Link or Website URL <span className="text-rose-400">*</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. http://paypal-account-security-update.top"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !urlInput.trim()}
            className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Checking Reputational Databases...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Scan URL Security</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-5 rounded-2xl flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          
          {/* Top Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${
                result.risk_level === 'High Risk'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : result.risk_level === 'Suspicious'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {result.risk_level}
              </span>
              <h2 className="text-2xl font-extrabold text-white truncate max-w-xl">{urlInput}</h2>
              <p className="text-sm text-slate-400 mt-1">{result.explanation}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center min-w-[140px]">
              <div className="text-xs text-slate-400 font-semibold uppercase">Risk Score</div>
              <div className="text-3xl font-black text-cyan-400 mt-0.5">{result.risk_score}<span className="text-sm text-slate-500">/100</span></div>
            </div>
          </div>

          {/* Provider Status Cards Breakdown */}
          {result.url_reputation && result.url_reputation.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Security Provider Evaluation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.url_reputation.map((prov, idx) => {
                  const isBad = prov.is_threat || prov.verdict === 'MALICIOUS' || prov.malicious_count > 0;
                  return (
                    <div key={idx} className={`p-5 rounded-2xl border space-y-2 ${
                      isBad
                        ? 'bg-rose-950/40 border-rose-800/80'
                        : prov.checked
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-800/60'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-sm">{prov.provider}</span>
                        {isBad ? (
                          <span className="flex items-center space-x-1 text-xs font-bold text-rose-400">
                            <XCircle className="w-4 h-4" />
                            <span>Threat Flagged</span>
                          </span>
                        ) : prov.checked ? (
                          <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Clean / Passed</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Unconfigured</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{prov.details}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Threat Indicators */}
          {result.threat_indicators && result.threat_indicators.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Domain & Pattern Heuristics</h3>
              <div className="space-y-2">
                {result.threat_indicators.map((ind, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-sm">
                    <span className="text-slate-200 font-medium">{ind.description}</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-800 text-amber-400 border border-amber-500/30">
                      {ind.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Actions */}
          {result.recommended_actions && (
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Recommended Safety Action</h3>
              <ul className="space-y-1.5">
                {result.recommended_actions.map((act, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
