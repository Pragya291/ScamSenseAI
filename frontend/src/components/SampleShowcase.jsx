import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Terminal, 
  Info, 
  Copy, 
  Check 
} from 'lucide-react';

export default function SampleShowcase({ onTryLiveScan }) {
  const [copied, setCopied] = useState(false);
  const demoUrl = "https://secure-bank-verify.service-auth-security.invalid/update-kyc";

  const handleCopy = () => {
    navigator.clipboard.writeText(demoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="showcase" className="py-20 bg-linear-to-b from-[#F7F9FE] to-white border-t border-[#E3E8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Sample Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            See Explainable AI in Action
          </h2>
          <p className="text-base text-[#5B6475] leading-relaxed">
            ScamSense doesn't just return a raw flag. It provides transparent risk breakdown, evidence markers, and safe action protocols.
          </p>
        </div>

        {/* Showcase Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#E3E8F2] shadow-xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-[#0B1224] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-300">Scanner Engine v2.4 • Sample Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                Demonstration Data
              </span>
            </div>
          </div>

          {/* Sample Input Bar */}
          <div className="p-6 bg-slate-50 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Simulated Target Input (Phishing URL)
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono text-slate-800 w-full overflow-x-auto shadow-2xs">
                <span className="text-red-500 font-bold">http://</span>
                <span className="text-slate-900 font-medium">secure-bank-verify.service-auth-security.invalid/update-kyc</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Sample'}</span>
            </button>
          </div>

          {/* Diagnostic Breakdown */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Top Score Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-red-700 uppercase">Risk Level</div>
                  <div className="text-xl font-bold text-red-900 mt-0.5">High Threat</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-200">
                  88
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-700 uppercase">Threat Category</div>
                  <div className="text-base font-bold text-amber-900 mt-0.5">Banking Impersonation</div>
                </div>
                <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0" />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-700 uppercase">Confidence Level</div>
                  <div className="text-base font-bold text-blue-900 mt-0.5">99.4% Multi-Signal</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-blue-600 shrink-0" />
              </div>

            </div>

            {/* Evidence & Explanation Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Why was this flagged? (Detected Risk Signals)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Domain Spoofing & Subdomain Masking</span>
                  </div>
                  <p className="text-xs text-[#5B6475] leading-relaxed">
                    The URL prepends brand keywords to mislead users, while resolving to an unverified top-level domain created recently.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Urgent KYC Verification Lure</span>
                  </div>
                  <p className="text-xs text-[#5B6475] leading-relaxed">
                    Page structure mimics official banking login forms requesting full SSN, debit card PIN, and OTP credentials.
                  </p>
                </div>

              </div>
            </div>

            {/* Recommended Action Box */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Recommended Protective Action</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                Do not open this URL or submit credentials. If received via SMS or WhatsApp, block the sender and report to the Anti-Phishing Working Group (APWG).
              </p>
            </div>

            {/* Interactive Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
              <span className="text-xs text-slate-400 font-medium text-center sm:text-left">
                * Note: This is an illustrative simulation showcasing how ScamSense AI scores threats.
              </span>
              <button
                onClick={onTryLiveScan}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition cursor-pointer shadow-xs"
              >
                Scan Your Own Input Free
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
