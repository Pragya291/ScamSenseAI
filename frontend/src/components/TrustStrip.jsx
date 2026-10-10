import React from 'react';
import { 
  FileText, 
  Gauge, 
  BrainCircuit, 
  CheckCircle2, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

const trustPoints = [
  {
    icon: Layers,
    title: 'Multiple Input Formats',
    desc: 'SMS, Emails, URLs, QR Codes, and Screenshots'
  },
  {
    icon: Gauge,
    title: 'Evidence-Based Scores',
    desc: 'Transparent 0-100 risk scoring with key signals'
  },
  {
    icon: BrainCircuit,
    title: 'Clear Explainability',
    desc: 'Understands why an alert triggered in plain English'
  },
  {
    icon: ShieldCheck,
    title: 'Practical Safety Guidance',
    desc: 'Actionable steps to safely verify and protect yourself'
  }
];

export default function TrustStrip() {
  return (
    <section className="border-y border-[#E3E8F2] bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100/60 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">{item.title}</h4>
                  <p className="text-xs text-[#5B6475] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
