import React from 'react';
import { 
  Layers, 
  Gauge, 
  BrainCircuit, 
  ShieldCheck 
} from 'lucide-react';

const trustPoints = [
  {
    icon: Layers,
    title: 'Multiple Input Formats',
    desc: 'Analyze SMS, emails, URLs, QR codes, and uploaded screenshots seamlessly.',
    badge: '5+ Vectors'
  },
  {
    icon: Gauge,
    title: 'Evidence-Based Scores',
    desc: 'Transparent 0–100 risk probability calibrated against multi-engine indicators.',
    badge: 'Calibrated'
  },
  {
    icon: BrainCircuit,
    title: 'Explainable AI',
    desc: 'Plain-English reasoning explaining why specific threat signals were flagged.',
    badge: 'Gemini AI'
  },
  {
    icon: ShieldCheck,
    title: 'Actionable Safety Guidance',
    desc: 'Clear, defensive step-by-step instructions to protect accounts and data.',
    badge: 'Defensive'
  }
];

export default function TrustStrip() {
  return (
    <section className="border-y border-[#E2E8F0] dark:border-[#263247] bg-white dark:bg-[#070B17] py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#F5F7FC] dark:hover:bg-[#0D1324] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EEF3FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
