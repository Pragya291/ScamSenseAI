import React, { useState } from 'react';
import { scanText } from '../services/api';
import { Send, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, ExternalLink, Globe, FileText, Info } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    name: 'PayPal Phishing SMS',
    sender: 'alert@paypal-security-update.top',
    text: 'URGENT: Your PayPal account has been suspended due to unauthorized login attempts. Verify immediately at http://paypal-account-security-update.top or your funds will be frozen in 24 hours.'
  },
  {
    name: 'IRS Gift Card Scam',
    sender: '+19005550199',
    text: 'This is Officer John Miller from the IRS Tax Fraud Audit division. Warrant #99201 is issued for your arrest. Call immediately or pay $500 in Target / Apple Gift Cards to clear charges.'
  },
  {
    name: 'Crypto 200% Guarantee',
    sender: 'crypto_doubler_bot',
    text: 'Exclusive Elon Musk Ethereum Giveaway! Deposit 0.5 ETH to 0x71C7656EC7ab88b098defB751B7401B5f6d8976F and receive 1.0 ETH returned instantly!'
  },
  {
    name: 'Remote Job Opportunity',
    sender: 'hr@global-careers-remote.site',
    text: 'Congratulations! You are selected for Remote Data Assistant ($45/hr). Buy your work laptop setup via wire transfer to our equipment vendor link.'
  }
];

export function TextScanner() {
  const [inputText, setInputText] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || inputText.length < 3) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await scanText(inputText, senderInfo);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to connect to ScamSense AI backend server.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset) => {
    setInputText(preset.text);
    setSenderInfo(preset.sender);
    setResult(null);
    setError(null);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'High Risk':
        return {
          bg: 'bg-rose-950/60',
          border: 'border-rose-500/60',
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          bar: 'bg-rose-500',
          icon: ShieldAlert
        };
      case 'Suspicious':
        return {
          bg: 'bg-amber-950/60',
          border: 'border-amber-500/60',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          bar: 'bg-amber-500',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-500/60',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          bar: 'bg-emerald-500',
          icon: ShieldCheck
        };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Gemini AI + Multi-Engine Threat Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Scam & Phishing Defense Scanner
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Paste suspicious SMS messages, WhatsApp chats, emails, payment requests, or job offers. Our AI agent evaluates social engineering tactics, urgency signals, fake links, and crypto fraud.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Try Preset Sample Scams:</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset)}
                className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/60 transition-all duration-150 flex items-center space-x-1.5"
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleScan} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Suspicious Content / Message Body <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious text, SMS, email body, WhatsApp message, or payment request here..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all font-mono text-sm leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Sender Email, Phone, or ID <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={senderInfo}
              onChange={(e) => setSenderInfo(e.target.value)}
              placeholder="e.g. alert@paypal-security-update.top or +19005550199"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-full h-[46px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Threat Vector...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Analyze Message with Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-5 rounded-2xl flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Analysis Result Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {(() => {
            const style = getRiskColor(result.risk_level);
            const RiskIcon = style.icon;
            return (
              <div className={`${style.bg} border ${style.border} rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6`}>
                
                {/* Top Badge & Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${style.badge}`}>
                      <RiskIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-black text-white">{result.risk_level}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
                          {result.scam_category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">
                        Risk Probability Score: <span className="font-bold text-white">{result.risk_score}/100</span>
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full sm:w-64 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Threat Index</span>
                      <span>{result.risk_score}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div className={`h-full ${style.bar} transition-all duration-1000`} style={{ width: `${result.risk_score}%` }} />
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Explainable AI Assessment</span>
                  </h3>
                  <p className="text-slate-200 text-base leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
                    {result.explanation}
                  </p>
                </div>

                {/* Red Flags & Indicators */}
                {result.red_flags && result.red_flags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Identified Red Flags ({result.red_flags.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.red_flags.map((flag, idx) => (
                        <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl flex items-start space-x-3 text-sm text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Next Actions */}
                {result.recommended_actions && result.recommended_actions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recommended Safety Guidance</span>
                    </h3>
                    <ul className="space-y-2">
                      {result.recommended_actions.map((act, idx) => (
                        <li key={idx} className="bg-slate-950/60 border border-slate-800/80 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Web Research Evidence (Tavily) */}
                {result.web_evidence && result.web_evidence.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-800/80">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Web Evidence Context (Tavily Intelligence)</span>
                    </h3>
                    <div className="space-y-2">
                      {result.web_evidence.map((ev, idx) => (
                        <div key={idx} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-1">
                          <a href={ev.url} target="_blank" rel="noreferrer" className="text-cyan-400 font-semibold text-sm hover:underline flex items-center space-x-1">
                            <span>{ev.title || ev.url}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <p className="text-xs text-slate-400 leading-relaxed">{ev.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limitations Disclaimer */}
                {result.limitations && (
                  <div className="flex items-center space-x-2 text-xs text-slate-500 pt-3 border-t border-slate-800/60">
                    <Info className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>{result.limitations}</span>
                  </div>
                )}

              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
