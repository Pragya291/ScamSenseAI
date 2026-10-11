import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthBrandingPanel() {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#2563EB] via-[#4338CA] to-[#7C3AED] p-8 sm:p-12 text-white flex flex-col justify-between shadow-2xl min-h-[580px]">
      
      {/* Decorative ambient background mesh circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

      {/* Top Header & Logo */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="/scamsense-logo.jpg"
            alt="ScamSense AI Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-lg bg-white/10 p-0.5 border border-white/20"
          />
          <span className="text-2xl font-bold tracking-tight text-white">
            ScamSense <span className="text-blue-200">AI</span>
          </span>
        </div>

        {/* Center Illustration with glowing shield & mobile phone */}
        <div className="py-6 flex justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer pulse circle */}
            <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-25" />
            
            {/* Shield backdrop */}
            <div className="relative w-36 h-40 bg-white/15 backdrop-blur-md rounded-3xl border border-white/30 flex flex-col items-center justify-center shadow-2xl p-4">
              {/* Phone inside shield */}
              <div className="w-20 h-28 bg-[#0B1224] rounded-xl border-2 border-white/40 shadow-inner flex flex-col items-center justify-between p-2">
                <div className="w-6 h-1 bg-slate-600 rounded-full" />
                <ShieldCheck className="w-8 h-8 text-blue-400" />
                <div className="w-4 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Detect. Explain. <br />
            Protect.
          </h2>
        </div>

        {/* 3 Key Trust Checkpoints */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-50">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span>4-in-1 multi-format scam detection</span>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-50">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Explainable AI risk scoring</span>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-50">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Trusted by 10,000+ security-first users</span>
          </div>
        </div>
      </div>

      {/* Footer tagline badge */}
      <div className="relative z-10 pt-6 border-t border-white/20 text-[11px] font-semibold tracking-wider uppercase text-blue-200 flex items-center justify-between">
        <span>Secure • Real-time • AI-powered</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

    </div>
  );
}
