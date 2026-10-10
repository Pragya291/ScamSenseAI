import React from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  Coins, 
  ArrowRight, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';

const threatTopics = [
  {
    icon: ShieldAlert,
    category: 'Phishing & Impersonation',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Brand Impersonation & Fake Deliveries',
    desc: 'Attackers create high-fidelity clone sites of postal couriers and banks to harvest credit card and phone numbers through urgency lures.',
    readTime: '4 min read'
  },
  {
    icon: KeyRound,
    category: 'OTP & Account Takeover',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Social Engineering & OTP Interception',
    desc: 'Tactics involving spoofed caller IDs and automated bots prompting victims to share one-time authentication codes under false security alerts.',
    readTime: '5 min read'
  },
  {
    icon: Coins,
    category: 'Crypto & Investment Scams',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Pig Butchering & Fake Trading Portals',
    desc: 'Elaborate investment schemes guiding users to fraudulent decentralized applications that request unlimited smart contract token approvals.',
    readTime: '6 min read'
  }
];

export default function ThreatIntel({ onExploreIntel }) {
  return (
    <section id="threat-intel" className="py-20 bg-white border-t border-[#E3E8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Threat Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Stay Ahead of Emerging Scams
            </h2>
            <p className="text-base text-[#5B6475] leading-relaxed">
              Learn about common scam patterns, phishing tactics, suspicious payment requests, and digital safety practices curated by security researchers.
            </p>
          </div>

          <button
            onClick={onExploreIntel}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 transition self-start md:self-auto cursor-pointer"
          >
            <span>Explore Threat Intel Library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Threat Topic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {threatTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl bg-[#F7F9FE] border border-[#E3E8F2] p-6 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${topic.badgeColor}`}>
                      {topic.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {topic.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111827] mb-2.5 group-hover:text-[#2563EB] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <button
                    onClick={onExploreIntel}
                    className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <div className="mt-8 text-center text-xs text-[#5B6475]">
          * Threat briefings are updated as new social engineering vectors are cataloged.
        </div>

      </div>
    </section>
  );
}
