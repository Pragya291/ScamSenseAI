import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  QrCode,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function Hero({ onStartScanning, onExploreHowItWorks }) {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-linear-to-tr from-blue-400/15 to-purple-400/15 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED SCAM PROTECTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.12]">
              Stop Scams Before <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED]">
                They Stop You
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#5B6475] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Detect suspicious messages, links, QR codes, screenshots, emails, and phone numbers with AI-powered analysis. Understand the warning signs and get clear recommendations before you take action.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartScanning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Start Scanning Free</span>
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-[#111827] bg-white border border-[#E3E8F2] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore How It Works</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#E3E8F2]/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#5B6475] justify-center lg:justify-start bg-white/70 py-2 px-3 rounded-lg border border-gray-100">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                <span>Multi-format scam detection</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#5B6475] justify-center lg:justify-start bg-white/70 py-2 px-3 rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Explainable risk assessments</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#5B6475] justify-center lg:justify-start bg-white/70 py-2 px-3 rounded-lg border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                <span>Actionable safety advice</span>
              </div>
            </div>

          </div>

          {/* Right Column: Security Scanner Phone Mockup / Preview */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Glowing Backdrop behind the phone mockup */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/25 blur-2xl rounded-3xl transform scale-95" />

            {/* Device Frame */}
            <div className="relative w-full max-w-[360px] bg-slate-900 rounded-[32px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/20">
              
              {/* Inner Screen */}
              <div className="bg-[#0B1224] rounded-[24px] overflow-hidden text-white border border-slate-700/50">
                
                {/* Header in Phone */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-linear-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-wide uppercase text-slate-200">QR Scan Analyzer</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Engine
                  </span>
                </div>

                {/* QR Target viewfinder illustration */}
                <div className="p-5 flex flex-col items-center justify-center bg-linear-to-b from-[#0F172A] to-[#1E293B] relative">
                  <div className="relative p-4 bg-white rounded-2xl shadow-inner border-2 border-dashed border-blue-400/60">
                    {/* Simulated QR Pattern */}
                    <div className="w-32 h-32 relative bg-white flex flex-col items-center justify-center">
                      <QrCode className="w-28 h-28 text-slate-900" />
                      {/* Scanning beam line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Scanned Target: cryptopay-bonus-auth.xyz</span>
                  </div>
                </div>

                {/* Result Card inside Mockup */}
                <div className="p-4 bg-white text-[#111827] rounded-t-2xl shadow-lg space-y-3">
                  
                  {/* Score & Risk Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Risk Assessment</div>
                      <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
                        88<span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span>High Risk</span>
                    </div>
                  </div>

                  {/* Progress Risk Bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-linear-to-r from-amber-500 to-red-500 h-full w-[88%] rounded-full" />
                  </div>

                  {/* Evidence Pill */}
                  <div className="p-2.5 bg-amber-50/90 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Suspicious Destination Detected</span>
                    </div>
                    <p className="text-[10.5px] text-amber-800 leading-snug">
                      QR code redirects to an unverified wallet drainer mimicking an official exchange portal.
                    </p>
                  </div>

                  {/* Action Recommendation */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                    <div className="font-semibold flex items-center gap-1 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Recommended Action</span>
                    </div>
                    <p className="text-[10.5px] text-emerald-700 mt-0.5">
                      Do not approve transaction or enter seed phrase. Verify only on official domains.
                    </p>
                  </div>

                  {/* Simulated Demo Disclaimer */}
                  <div className="text-[10px] text-center text-slate-400 font-medium">
                    * Interactive demonstration representation
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
