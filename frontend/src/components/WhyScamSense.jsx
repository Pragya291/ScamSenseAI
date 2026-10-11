import React from 'react';
import { 
  BrainCircuit, 
  Layers, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const pillars = [
  {
    icon: BrainCircuit,
    title: 'Explainable AI',
    subtitle: 'Transparent Reasoning',
    desc: 'Not just "This is a scam." ScamSense explains why.',
    detail: 'Get clear, plain-English rationales breaking down detected psychological pressure, domain spoofing, and behavioral traps.',
    badge: 'Cognitive Depth',
    color: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-600 text-white'
  },
  {
    icon: Layers,
    title: 'Multi-Layer Verification',
    subtitle: 'Multi-Signal Corroboration',
    desc: 'Combine AI reasoning with security APIs and threat intelligence.',
    detail: 'Eliminate single points of failure by cross-checking Gemini heuristics with Google Safe Browsing and VirusTotal reputation databases.',
    badge: 'Zero Trust',
    color: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-600 text-white'
  },
  {
    icon: ShieldCheck,
    title: 'Actionable Protection',
    subtitle: 'Defensive Action Protocols',
    desc: 'Get clear recommendations about what to do next.',
    detail: 'Empower users and teams with safe recovery steps: which numbers to block, official portals to contact, and how to verify legitimate alerts.',
    badge: 'Empowerment',
    color: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-600 text-white'
  }
];

export default function WhyScamSense({ onStartScanning }) {
  return (
    <section className="py-24 bg-white dark:bg-[#0B1120] border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>The ScamSense Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
            Why ScamSense?
          </h2>
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
            Traditional filters only block known bad links. ScamSense deciphers modern deceptive patterns before they hit public blacklists.
          </p>
        </div>

        {/* 3 Premium Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-[#F8FAFC] dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-8 shadow-xs hover:bg-white dark:hover:bg-[#111827] hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${pillar.iconBg} flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-white dark:bg-[#172033] text-[#475569] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#263247]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3 leading-snug">
                    "{pillar.desc}"
                  </p>

                  <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
                    {pillar.detail}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{pillar.subtitle}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
