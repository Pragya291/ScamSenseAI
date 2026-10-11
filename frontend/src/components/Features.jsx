import React from 'react';
import { 
  MessageSquareWarning, 
  ScanQrCode, 
  Image, 
  BrainCircuit, 
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  QrCode
} from 'lucide-react';

export default function Features({ onSelectFeature }) {
  return (
    <section id="features" className="py-24 bg-[#F8FAFF] dark:bg-[#070B17] relative border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF3FF] dark:bg-[#111827] border border-blue-200 dark:border-blue-900/60 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold uppercase tracking-wider">
            <span>Unified Threat Prevention</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
            One AI Security Layer. Multiple Threat Vectors.
          </h2>
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
            Analyze suspicious content from one intelligent security platform.
          </p>
        </div>

        {/* 4 Polished Cards Grid with Realistic UI Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          
          {/* Card A: Message Scanning */}
          <div className="group rounded-2xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-6 shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  SMS & Email
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Message Scanning
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Analyze SMS, emails, social messages, phishing attempts, payment requests, and suspicious text.
                </p>
              </div>

              {/* Realistic UI Preview: Simulated SMS threat */}
              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] p-3 space-y-2">
                <div className="text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase flex items-center justify-between">
                  <span>Simulated SMS Alert</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">Flagged</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263247] text-[11px] text-[#0F172A] dark:text-[#F8FAFC] leading-snug font-sans shadow-2xs">
                  "URGENT: Your acct #4821 is restricted. Verify immediately: hdfc-secure-auth.link"
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Risk: 94/100
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">Urgency Manipulation</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between">
              <button
                onClick={onSelectFeature}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                <span>Scan message</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Card B: URL & QR Analysis */}
          <div className="group rounded-2xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <ScanQrCode className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  Web & QR
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  URL & QR Analysis
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Inspect URLs and QR codes for suspicious domains, redirects, malicious destinations, and phishing patterns.
                </p>
              </div>

              {/* Realistic UI Preview: Simulated URL scan */}
              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] p-3 space-y-2">
                <div className="text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase flex items-center justify-between">
                  <span>Domain Inspection</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">Unverified</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263247] text-[11.5px] font-mono text-[#0F172A] dark:text-slate-200 truncate shadow-2xs">
                  suspicious-bank-login.xyz
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    Risk: 92/100
                  </span>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">Suspicious domain detected</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between">
              <button
                onClick={onSelectFeature}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                <span>Inspect URL or QR</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Card C: Screenshot Detection */}
          <div className="group rounded-2xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-6 shadow-xs hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Image className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                  Visual OCR
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Screenshot Detection
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Upload screenshots of suspicious messages, payment requests, advertisements, or websites for AI-powered visual analysis and OCR.
                </p>
              </div>

              {/* Realistic UI Preview: Simulated OCR scanning */}
              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] p-3 space-y-2">
                <div className="text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase flex items-center justify-between">
                  <span>OCR Text Parser</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">Extracted</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#172033] border border-dashed border-purple-300 dark:border-purple-800 text-[11px] text-[#0F172A] dark:text-[#F8FAFC] space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-semibold text-[10px]">
                    <Search className="w-3 h-3" />
                    <span>Scanned payment screenshot</span>
                  </div>
                  <p className="text-[10.5px] text-[#475569] dark:text-[#CBD5E1] italic">
                    "Scan to receive $500 cashback credit into your wallet..."
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Risk: 86/100
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">Payment Lure Trap</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between">
              <button
                onClick={onSelectFeature}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                <span>Upload screenshot</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Card D: Explainable AI */}
          <div className="group rounded-2xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-6 shadow-xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Reasoning
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Explainable AI
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Understand exactly why something was flagged, including detected signals, evidence, confidence, threat category, and recommended actions.
                </p>
              </div>

              {/* Realistic UI Preview: Simulated Explainability evidence breakdown */}
              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] p-3 space-y-1.5">
                <div className="text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase flex items-center justify-between">
                  <span>Diagnostic Breakdown</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.4% Match</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263247] text-[11px] space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-[#475569] dark:text-[#CBD5E1]">Domain Spoofing</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">98% High</span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-[#475569] dark:text-[#CBD5E1]">Urgency Marker</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">91% Med</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Transparent AI
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">Plain-English Why</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between">
              <button
                onClick={onSelectFeature}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                <span>See explainability</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
