import React from 'react';
import { 
  UploadCloud, 
  FileSearch, 
  SearchCode, 
  Cpu, 
  ShieldAlert, 
  CheckCircle,
  ArrowRight,
  Database,
  Globe,
  Sparkles,
  Server
} from 'lucide-react';

const pipelineSteps = [
  {
    step: '01',
    phase: 'INPUT',
    title: 'Input',
    desc: 'Submit a message, URL, QR code, or screenshot.',
    icon: UploadCloud,
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    step: '02',
    phase: 'EXTRACT',
    title: 'Extract',
    desc: 'Extract URLs, domains, keywords, metadata, QR payloads, and suspicious entities.',
    icon: FileSearch,
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    step: '03',
    phase: 'SIGNAL DETECTION',
    title: 'Signal Detection',
    desc: 'Identify phishing, impersonation, urgency, malicious links, and social engineering signals.',
    icon: SearchCode,
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    step: '04',
    phase: 'AI ANALYSIS',
    title: 'AI Analysis',
    desc: 'Use Gemini AI to analyze the content and explain suspicious behavior.',
    icon: Cpu,
    badgeColor: 'bg-blue-700 text-white'
  },
  {
    step: '05',
    phase: 'RISK SCORING',
    title: 'Risk Scoring',
    desc: 'Generate a transparent risk score, confidence level, and threat category.',
    icon: ShieldAlert,
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    step: '06',
    phase: 'RECOMMENDATION',
    title: 'Recommendation',
    desc: 'Provide clear, actionable safety guidance.',
    icon: CheckCircle,
    badgeColor: 'bg-emerald-600 text-white'
  }
];

const platformComponents = [
  {
    name: 'Gemini AI',
    role: 'Reasoning & Threat Explanation',
    badge: 'AI Core',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Google Safe Browsing',
    role: 'Malicious URL Blacklist Inspection',
    badge: 'Reputation API',
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    name: 'VirusTotal',
    role: 'Multi-Engine Antivirus & Domain Intel',
    badge: 'Security Intel',
    color: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    name: 'Firebase',
    role: 'Authentication & Encrypted Scan History',
    badge: 'Cloud Vault',
    color: 'text-amber-600 dark:text-amber-400'
  },
  {
    name: 'Tavily Intelligence',
    role: 'Real-Time Web Verification (Optional)',
    badge: 'Live Web Intel',
    color: 'text-purple-600 dark:text-purple-400'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-[#0B1120] border-t border-[#E2E8F0] dark:border-[#263247] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
            <span>Deterministic + Cognitive Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
            From Suspicion to Safer Decisions
          </h2>
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
            A transparent six-stage pipeline that transforms suspicious digital clues into calibrated, explainable defenses.
          </p>
        </div>

        {/* 6 Connected Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 relative mb-16">
          
          {/* Subtle connecting line for desktop view */}
          <div className="hidden lg:block absolute top-14 left-12 right-12 h-0.5 bg-[#CBD5E1] dark:bg-[#263247] -z-0" />

          {pipelineSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] hover:bg-white dark:hover:bg-[#111827] hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Step Icon with Number Pill */}
                <div className="relative mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${item.badgeColor} flex items-center justify-center font-bold shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-2 -right-2.5 w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-xs flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                    {item.step}
                  </span>
                </div>

                {/* Phase Category Label */}
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  {item.phase}
                </span>

                {/* Step Title & Description */}
                <h4 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Underlying Platform Architecture Layer */}
        <div className="bg-[#F8FAFC] dark:bg-[#111827] rounded-2xl border border-[#E2E8F0] dark:border-[#263247] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0] dark:border-[#263247]">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Multi-Engine Architecture</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                Platform Technology & Intelligence Foundation
              </h3>
            </div>
            <div className="text-xs text-[#475569] dark:text-[#CBD5E1] bg-white dark:bg-[#0D1324] px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#263247] self-start md:self-auto font-medium">
              Components operate collaboratively to cross-validate threat indicators
            </div>
          </div>

          {/* Architecture Pipeline Flow Component Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
            {platformComponents.map((comp, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-[#0D1324] rounded-xl border border-[#E2E8F0] dark:border-[#263247] p-4 shadow-2xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F5F7FC] dark:bg-[#172033] text-[#475569] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#263247] uppercase">
                      {comp.badge}
                    </span>
                    {idx < platformComponents.length - 1 && (
                      <ArrowRight className="hidden lg:block w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <h4 className={`text-sm font-bold ${comp.color}`}>
                    {comp.name}
                  </h4>
                  <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-1 leading-snug">
                    {comp.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
