import React from 'react';
import { 
  UploadCloud, 
  FileSearch, 
  SearchCode, 
  Cpu, 
  ShieldAlert, 
  CheckCircle 
} from 'lucide-react';

const steps = [
  {
    step: '1',
    title: 'Submit',
    desc: 'Paste a message or URL, or upload a screenshot or QR code.',
    icon: UploadCloud,
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    step: '2',
    title: 'Extract',
    desc: 'Extract visible text, target URLs, domain metadata, or QR payloads.',
    icon: FileSearch,
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    step: '3',
    title: 'Inspect Signals',
    desc: 'Scan for urgency triggers, suspicious sender domains, and typo-squats.',
    icon: SearchCode,
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    step: '4',
    title: 'AI Analysis',
    desc: 'Evaluate against threat intelligence and trained ML heuristic models.',
    icon: Cpu,
    badgeColor: 'bg-blue-700 text-white'
  },
  {
    step: '5',
    title: 'Explain Risk',
    desc: 'Generate a 0-100 risk score backed by transparent, plain-English reasons.',
    icon: ShieldAlert,
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    step: '6',
    title: 'Recommend',
    desc: 'Get safe next steps to block, report, or verify through official channels.',
    icon: CheckCircle,
    badgeColor: 'bg-emerald-600 text-white'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-[#E3E8F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Intelligent Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            From Suspicion to Safer Decisions
          </h2>
          <p className="text-base text-[#5B6475] leading-relaxed">
            Understand how ScamSense AI evaluates each digital artifact in 6 seamless steps to keep you protected.
          </p>
        </div>

        {/* 6 Steps Grid / Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          
          {/* Subtle connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-linear-to-r from-blue-200 via-purple-200 to-emerald-200 -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center p-5 rounded-2xl bg-[#F7F9FE] border border-[#E3E8F2] hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-200 group"
              >
                {/* Step Number Circle */}
                <div className="relative mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.badgeColor} flex items-center justify-center font-bold text-base shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                    {item.step}
                  </span>
                </div>

                {/* Step Content */}
                <h4 className="text-base font-bold text-[#111827] mb-1.5 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
