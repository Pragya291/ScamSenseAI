import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Cpu,
  Layers,
  Database,
  Search,
  Fingerprint
} from 'lucide-react';

export default function Hero({ onStartScanning, onExploreHowItWorks }) {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#F8FAFF] dark:bg-[#070B17] transition-colors duration-200">
      
      {/* Subtle cybersecurity background grid and ambient lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] -z-10"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-linear-to-tr from-blue-400/10 via-indigo-300/8 to-purple-400/10 dark:from-blue-600/15 dark:via-indigo-500/10 dark:to-purple-600/15 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Copy, Technology Trustline, & Action CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Cybersecurity & AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF3FF] dark:bg-[#111827] border border-blue-200/80 dark:border-blue-900/60 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Multi-Vector AI Cybersecurity Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.14]">
              Detect Scams. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] via-indigo-600 to-[#7C3AED] dark:from-[#3B82F6] dark:via-indigo-400 dark:to-[#A78BFA]">
                Understand the Risk.
              </span> <br className="hidden sm:inline" />
              Stay Safe.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ScamSense AI analyzes suspicious messages, URLs, QR codes, screenshots, and emails using AI and threat intelligence to detect suspicious activity before you act.
            </p>

            {/* Technology & Trust Line */}
            <div className="inline-flex items-center flex-wrap gap-2 text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] px-4 py-2 rounded-xl shadow-2xs">
              <span className="flex items-center gap-1.5 text-[#2563EB] dark:text-[#3B82F6]">
                <Cpu className="w-4 h-4" />
                <span>AI Analysis</span>
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Google Safe Browsing</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>VirusTotal</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Evidence-Based Detection</span>
              </span>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartScanning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base"
              >
                <ShieldCheck className="w-5 h-5 text-blue-200" />
                <span>Start Scanning Free →</span>
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base group"
              >
                <span>See How It Works →</span>
              </button>
            </div>

            {/* Mini Trust Highlights Strip */}
            <div className="pt-5 border-t border-[#E2E8F0] dark:border-[#263247] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] justify-center lg:justify-start bg-white dark:bg-[#0D1324] py-2 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#263247] shadow-2xs">
                <Layers className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6] shrink-0" />
                <span>Multi-Input Security</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] justify-center lg:justify-start bg-white dark:bg-[#0D1324] py-2 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#263247] shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Transparent Scoring</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] justify-center lg:justify-start bg-white dark:bg-[#0D1324] py-2 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#263247] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED] dark:text-[#8B5CF6] shrink-0" />
                <span>Defensive Guidance</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Light / Dark Product Preview Interface */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Ambient glow behind card */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-purple-500/20 blur-2xl rounded-3xl transform scale-95" />

            {/* Product Threat-Analysis Interface Container */}
            <div className="relative w-full max-w-[440px] bg-white dark:bg-[#0D1324] rounded-2xl shadow-xl dark:shadow-2xl border border-[#E2E8F0] dark:border-[#263247] overflow-hidden text-[#0F172A] dark:text-[#F8FAFC] transition-all">
              
              {/* Product Card Top Header Bar - Clean and Light in Light Mode, Dark in Dark Mode */}
              <div className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#263247]">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="text-xs font-mono font-medium text-[#475569] dark:text-[#CBD5E1] ml-1">
                    ScamSense AI • Sentinel Core
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80">
                    Engine Active
                  </span>
                </div>
              </div>

              {/* Target Artifact Bar */}
              <div className="px-4 py-3 bg-[#F5F7FC] dark:bg-[#070B17] border-b border-[#E2E8F0] dark:border-[#263247] text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase shrink-0 border border-blue-200 dark:border-blue-900">
                    URL Target
                  </span>
                  <span className="font-mono text-[#0F172A] dark:text-slate-200 truncate font-medium text-[11.5px]">
                    https://secure-bank-verify.example/update
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] shrink-0">280ms</span>
              </div>

              {/* Primary Threat Analysis Dashboard Content */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Score & Category Header */}
                <div className="flex items-center justify-between bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 rounded-xl p-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 block">
                      Multi-Signal Risk Score
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-red-600 dark:text-red-400">88</span>
                      <span className="text-xs font-medium text-[#64748B] dark:text-slate-400">/ 100</span>
                      <span className="ml-2 text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white shadow-xs">
                        High Risk
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 block uppercase">Confidence</span>
                    <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">99.4% Match</span>
                    <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold block">Banking Impersonation</span>
                  </div>
                </div>

                {/* Risk Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-[#475569] dark:text-slate-400">
                    <span>Threat Probability</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">Severe (88%)</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-linear-to-r from-amber-500 to-red-600 h-full w-[88%] rounded-full" />
                  </div>
                </div>

                {/* Detected Signals Grid */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block mb-2">
                    Detected Threat Signals (4)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-[11px] truncate">Domain Spoofing</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-[11px] truncate">Suspicious Redirect</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-[11px] truncate">Urgency Manipulation</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-[11px] truncate">Credential Harvesting</span>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning Strip */}
                <div className="p-3 rounded-xl bg-[#EEF3FF] dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-[11.5px] text-[#0F172A] dark:text-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Gemini AI Synthesis</span>
                  </div>
                  <p className="text-[#475569] dark:text-slate-300 leading-snug">
                    Simulates official bank KYC verification with newly registered deceptive domain and credential-sniffing payload.
                  </p>
                </div>

                {/* Protective Action Recommendation */}
                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-[11.5px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-950 dark:text-emerald-200">Recommended Action</span>
                    <span className="text-emerald-800 dark:text-emerald-300 leading-snug">
                      Do not open URL or provide credentials. Verify through the verified bank banking app.
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Multi-Engine Status Strip */}
              <div className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#111827] border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Google Safe Browsing: Match
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  VirusTotal: 14 Flagged
                </span>
                <span className="text-[#2563EB] dark:text-[#3B82F6] font-bold">Multi-Layer OK</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
