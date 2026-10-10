import React from 'react';
import { ShieldCheck, ArrowRight, Lock, Sparkles } from 'lucide-react';

export default function CTASection({ onStartScanning, onCreateAccount }) {
  return (
    <section className="py-20 relative overflow-hidden bg-linear-to-b from-white to-[#F0F4FF] border-t border-[#E3E8F2]">
      {/* Subtle backdrop glowing ambient circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-linear-to-r from-blue-400/20 to-purple-400/20 blur-3xl -z-0 pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0B1224] text-white rounded-3xl p-8 sm:p-14 text-center shadow-2xl border border-slate-800 relative overflow-hidden">
          
          {/* Top Decorative accent pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Instant Threat Verification</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
            Think Before <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#60A5FA] via-[#A78BFA] to-[#C084FC]">
              You Click.
            </span>
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-9 leading-relaxed">
            Check suspicious messages, links, and QR codes before sharing information or making a payment. Free, instant, and privacy-conscious.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartScanning}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-xl shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Start Scanning Free</span>
            </button>

            <button
              onClick={onCreateAccount}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Your Account</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Micro trust note */}
          <div className="mt-8 text-xs text-slate-400 font-medium">
            No credit card required • Instant AI risk assessment • Privacy protected
          </div>

        </div>
      </div>
    </section>
  );
}
