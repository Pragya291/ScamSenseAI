import React from 'react';
import { ShieldCheck, ArrowRight, Lock, Sparkles, Terminal } from 'lucide-react';

export default function CTASection({ onStartScanning, onTryDemo, onCreateAccount }) {
  const handleDemoClick = () => {
    if (onTryDemo) {
      onTryDemo();
    } else {
      const el = document.getElementById('showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onCreateAccount) {
        onCreateAccount();
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#EEF4FF] dark:bg-[#070B17] border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      {/* Subtle backdrop glowing ambient circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-linear-to-r from-blue-400/15 via-indigo-400/10 to-purple-400/15 dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-purple-500/20 blur-3xl -z-0 pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white dark:bg-[#0D1324] text-[#0F172A] dark:text-[#F8FAFC] rounded-3xl p-8 sm:p-14 text-center shadow-xl dark:shadow-2xl border border-[#E2E8F0] dark:border-[#263247] relative overflow-hidden transition-colors">
          
          {/* Top Decorative accent pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF3FF] dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Zero-Trust Verification</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white mb-5 leading-tight">
            Think Before <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2563EB] via-indigo-600 to-[#7C3AED] dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
              You Click.
            </span>
          </h2>

          {/* Subtitle matching exact requested text */}
          <p className="text-[#475569] dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Have a suspicious message, URL, QR code, or screenshot? Let ScamSense AI check it first.
          </p>

          {/* Buttons matching exact requested titles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartScanning}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base"
            >
              <ShieldCheck className="w-5 h-5 text-blue-200" />
              <span>Start Scanning Free →</span>
            </button>

            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#111827] hover:bg-[#F5F7FC] dark:hover:bg-[#172033] border border-[#E2E8F0] dark:border-[#263247] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base shadow-2xs"
            >
              <Terminal className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
              <span>Try Live Demo →</span>
            </button>
          </div>

          {/* Micro trust note */}
          <div className="mt-8 text-xs text-[#64748B] dark:text-slate-400 font-medium">
            Multi-Signal Detection • Explainable Heuristics • Fast, Confidential & Defensive
          </div>

        </div>
      </div>
    </section>
  );
}
