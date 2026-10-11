import React from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  Coins, 
  ArrowRight, 
  ExternalLink, 
  Radio, 
  Clock 
} from 'lucide-react';

const threatAdvisories = [
  {
    icon: ShieldAlert,
    category: 'Phishing & Impersonation',
    riskLevel: 'HIGH',
    riskBadgeColor: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900',
    title: 'Brand Impersonation & Fake Deliveries',
    desc: 'Attackers create high-fidelity clone sites of postal couriers and banks to harvest credit card and phone numbers through urgency lures.',
    updatedTime: 'Updated 45 mins ago',
    activeVector: 'SMS / Deceptive Domains',
    advisoryId: 'ADV-2026-081'
  },
  {
    icon: KeyRound,
    category: 'OTP & Account Takeover',
    riskLevel: 'MEDIUM',
    riskBadgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    title: 'Social Engineering & OTP Interception',
    desc: 'Tactics involving spoofed caller IDs and automated bots prompting victims to share one-time authentication codes under false security alerts.',
    updatedTime: 'Updated 2 hours ago',
    activeVector: 'Voice Spoofing / 2FA Bypasses',
    advisoryId: 'ADV-2026-079'
  },
  {
    icon: Coins,
    category: 'Crypto & Investment Scams',
    riskLevel: 'EMERGING',
    riskBadgeColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
    title: 'Pig Butchering & Fake Trading Portals',
    desc: 'Elaborate investment schemes guiding users to fraudulent decentralized applications that request unlimited smart contract token approvals.',
    updatedTime: 'Updated 4 hours ago',
    activeVector: 'Web3 / Social Engineering',
    advisoryId: 'ADV-2026-074'
  }
];

export default function ThreatIntel({ onExploreIntel }) {
  return (
    <section id="threat-intel" className="py-24 bg-[#F8FAFF] dark:bg-[#070B17] border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Live Feed Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] bg-[#EEF3FF] dark:bg-[#111827] px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60">
                Threat Intelligence Feed
              </span>
              
              {/* Updated Recently Indicator */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Updated recently</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
              Stay Ahead of Emerging Scams
            </h2>
            <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
              Real-time threat briefs cataloging active evasion tactics, social engineering vectors, and defensive countermeasures.
            </p>
          </div>

          <button
            onClick={onExploreIntel}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#2563EB] dark:text-[#3B82F6] bg-white dark:bg-[#0D1324] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] transition shadow-2xs self-start md:self-auto cursor-pointer"
          >
            <span>Explore Full Threat Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Threat Feed Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {threatAdvisories.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] p-6 sm:p-7 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Metadata Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold text-[#64748B] dark:text-[#94A3B8]">
                      {topic.advisoryId}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${topic.riskBadgeColor}`}>
                        {topic.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Threat Category */}
                  <div className="text-xs font-bold text-[#2563EB] dark:text-[#3B82F6] uppercase tracking-wider mb-2">
                    {topic.category}
                  </div>

                  {/* Scam Title */}
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-[13px] text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-4 font-normal">
                    {topic.desc}
                  </p>

                  {/* Vector Tag */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] text-[11px] text-[#475569] dark:text-[#CBD5E1] flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Attack Vector:</span>
                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{topic.activeVector}</span>
                  </div>
                </div>

                {/* Bottom Card Footer: Timestamp and Read Advisory CTA */}
                <div className="pt-5 mt-5 border-t border-[#E2E8F0] dark:border-[#263247] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{topic.updatedTime}</span>
                  </div>

                  <button
                    onClick={onExploreIntel}
                    className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Read Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Feed Advisory Footer Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#475569] dark:text-[#CBD5E1] bg-white dark:bg-[#0D1324] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263247] gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Telemetry verified against regional cybercrime incident reports and open threat exchanges.</span>
          </div>
          <span className="font-mono text-[#64748B] dark:text-[#94A3B8] text-[11px]">Sync Rate: Continuous</span>
        </div>

      </div>
    </section>
  );
}
