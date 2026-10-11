import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Search, 
  Database, 
  Globe2, 
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

const technologies = [
  {
    name: 'Gemini AI',
    role: 'Reasoning Engine',
    desc: 'AI reasoning, threat explanation, and risk analysis',
    badge: 'Cognitive Core',
    icon: Cpu,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    borderColor: 'border-blue-200 dark:border-blue-900/60'
  },
  {
    name: 'Google Safe Browsing',
    role: 'Malware & Phishing Blacklists',
    desc: 'Known malicious and unsafe URL detection',
    badge: 'Reputation API',
    icon: ShieldCheck,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
    borderColor: 'border-emerald-200 dark:border-emerald-900/60'
  },
  {
    name: 'VirusTotal',
    role: 'Multi-AV Engine Telemetry',
    desc: 'Threat reputation and security intelligence',
    badge: 'Security Intel',
    icon: Search,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
    borderColor: 'border-indigo-200 dark:border-indigo-900/60'
  },
  {
    name: 'Firebase',
    role: 'Identity & Encrypted Storage',
    desc: 'Authentication and secure scan history',
    badge: 'Security Vault',
    icon: Database,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    borderColor: 'border-amber-200 dark:border-amber-900/60'
  },
  {
    name: 'Tavily',
    role: 'Real-Time Web Research',
    desc: 'Additional web intelligence and research',
    badge: 'Web Verification',
    icon: Globe2,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
    borderColor: 'border-purple-200 dark:border-purple-900/60'
  }
];

export default function TechnologyTrustSection() {
  return (
    <section className="py-24 bg-[#F8FAFF] dark:bg-[#070B17] border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF3FF] dark:bg-[#111827] border border-blue-200 dark:border-blue-900/60 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Verified Intelligence Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
            Powered by Multiple Layers of Threat Intelligence
          </h2>
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
            Every scan cross-references industry standard threat repositories and Google DeepMind AI models.
          </p>
        </div>

        {/* 5 Technology Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-6 shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${tech.bgColor} ${tech.color} flex items-center justify-center border ${tech.borderColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#F5F7FC] dark:bg-[#172033] text-[#475569] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#263247]">
                      {tech.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tech.name}
                  </h3>
                  <div className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] mb-2.5">
                    {tech.role}
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
                    {tech.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Configured & Connected</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
