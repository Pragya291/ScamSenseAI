import React from 'react';
import { Search, Brain, ShieldCheck } from 'lucide-react';

export default function AuthBrandingPanel() {
  const features = [
    {
      icon: Search,
      title: '4-in-1 Scam Detection',
      desc: 'URLs, messages, files & more',
      iconColor: 'text-cyan-400',
      glowColor: 'group-hover:border-cyan-400/50'
    },
    {
      icon: Brain,
      title: 'Explainable AI Insights',
      desc: 'Know the risk, not just the result',
      iconColor: 'text-purple-400',
      glowColor: 'group-hover:border-purple-400/50'
    },
    {
      icon: ShieldCheck,
      title: 'Trusted by 10,000+ Users',
      desc: 'Individuals, businesses & researchers',
      iconColor: 'text-emerald-400',
      glowColor: 'group-hover:border-emerald-400/50'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#071A49] via-[#0D2368] to-[#2E1260] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between shadow-2xl border border-blue-500/20 h-full min-h-[580px] lg:min-h-[640px] select-none">
      
      {/* Decorative ambient background glows & cyber patterns */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Header & Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {/* Logo Emblem: Shield with glowing magnifying glass */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/25 to-purple-600/30 border border-blue-400/40 p-2 flex items-center justify-center shadow-lg shadow-blue-500/20 backdrop-blur-md shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-cyan-400">
              <path
                d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="url(#shieldGrad)"
              />
              <circle cx="11" cy="10" r="3" stroke="#93C5FD" strokeWidth="1.5" />
              <path d="M13.5 12.5L16 15" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="shieldGrad" x1="4" y1="2" x2="20" y2="22">
                  <stop stopColor="#3B82F6" stopOpacity="0.45" />
                  <stop stopColor="#8B5CF6" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1">
              <span>ScamSense</span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI</span>
            </div>
            <div className="text-[9px] tracking-[0.22em] font-bold text-blue-200/80 uppercase">
              DETECT . EXPLAIN . PROTECT
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mt-8 sm:mt-10 space-y-1.5">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-white leading-tight">
            Smarter Research.
          </h2>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Safer Decisions.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed pt-2 max-w-md font-normal">
            AI-powered scam detection, fact-checking and risk analysis for a safer digital world.
          </p>
        </div>
      </div>

      {/* Middle Section: Features + 3D Cyber Shield Visual */}
      <div className="relative z-10 my-6 sm:my-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Features Column */}
        <div className="md:col-span-6 space-y-3.5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="group flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xs"
              >
                <div className={`w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-inner ${item.glowColor} transition-colors`}>
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-blue-200/70 leading-snug truncate">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Cyber Shield Visual on Pedestal */}
        <div className="md:col-span-6 flex justify-center items-center">
          <div className="relative w-full max-w-[210px] sm:max-w-[240px] md:max-w-[260px] aspect-square flex items-center justify-center group">
            
            {/* Pulsing ambient neon aura */}
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl pointer-events-none animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-purple-500/25 blur-xl pointer-events-none" />

            {/* Glowing orbital ring */}
            <div className="absolute inset-2 rounded-full border border-cyan-400/30 border-dashed animate-[spin_20s_linear_infinite] pointer-events-none" />

            {/* Shield Pedestal Image */}
            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden mix-blend-screen filter drop-shadow-[0_0_35px_rgba(59,130,246,0.55)]">
              <img
                src="/cyber-shield-pedestal.jpg"
                alt="Cybersecurity Shield Visual"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A49] via-transparent to-transparent opacity-30 pointer-events-none" />
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Statement Bar */}
      <div className="relative z-10 pt-4 flex items-center justify-center gap-3 border-t border-white/10 text-center">
        <div className="h-[1px] w-10 sm:w-14 bg-gradient-to-r from-transparent to-blue-400/60" />
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-blue-200/90 uppercase">
          SECURE • REAL-TIME • AI-POWERED
        </span>
        <div className="h-[1px] w-10 sm:w-14 bg-gradient-to-l from-transparent to-purple-400/60" />
      </div>

    </div>
  );
}
