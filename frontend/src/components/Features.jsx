import React from 'react';
import { 
  MessageSquareWarning, 
  ScanQrCode, 
  Image, 
  BrainCircuit, 
  ArrowUpRight 
} from 'lucide-react';

const features = [
  {
    icon: MessageSquareWarning,
    title: 'Message Scanning',
    badge: 'SMS & Email',
    desc: 'Check suspicious SMS messages, chat messages, and emails for phishing language, impersonation, urgent payment requests, and other warning signs.',
    cardBg: 'bg-blue-50/50',
    iconBg: 'bg-blue-600 text-white',
    borderColor: 'border-blue-200/70',
    accentHover: 'group-hover:border-blue-400'
  },
  {
    icon: ScanQrCode,
    title: 'URL & QR Analysis',
    badge: 'Web & Links',
    desc: 'Inspect suspicious URLs and QR code destinations for potentially dangerous redirects, newly registered malicious domains, and phishing indicators.',
    cardBg: 'bg-purple-50/50',
    iconBg: 'bg-purple-600 text-white',
    borderColor: 'border-purple-200/70',
    accentHover: 'group-hover:border-purple-400'
  },
  {
    icon: Image,
    title: 'Screenshot Detection',
    badge: 'Visual OCR',
    desc: 'Submit screenshots of suspicious messages, payment requests, advertisements, and offers for automated OCR extraction and visible signal analysis.',
    cardBg: 'bg-emerald-50/50',
    iconBg: 'bg-emerald-600 text-white',
    borderColor: 'border-emerald-200/70',
    accentHover: 'group-hover:border-emerald-400'
  },
  {
    icon: BrainCircuit,
    title: 'Explainable AI',
    badge: 'Deep Insights',
    desc: 'Understand why an input may be risky through evidence-based explanations, highlighted risk factors, and practical, safe next steps.',
    cardBg: 'bg-amber-50/50',
    iconBg: 'bg-amber-600 text-white',
    borderColor: 'border-amber-200/70',
    accentHover: 'group-hover:border-amber-400'
  }
];

export default function Features({ onSelectFeature }) {
  return (
    <section id="features" className="py-20 bg-[#F7F9FE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Comprehensive Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Everything You Need to Stay Safe
          </h2>
          <p className="text-base text-[#5B6475] leading-relaxed">
            One intelligent platform to identify suspicious activity, understand potential risks, and make safer decisions across every digital communication channel.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl bg-white border ${item.borderColor} p-6 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                <div>
                  {/* Card top icon & badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center shadow-md shadow-blue-900/10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#111827] mb-2.5 group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5B6475] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={onSelectFeature}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group-hover:underline cursor-pointer"
                  >
                    <span>Analyze with this</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
