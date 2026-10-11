import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  Info, 
  Copy, 
  Check,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Lock,
  Search,
  Cpu,
  Layers
} from 'lucide-react';

const sampleCases = [
  {
    id: 'banking-url',
    tabTitle: 'Sample 1: Banking URL',
    inputType: 'Suspicious URL',
    inputValue: 'https://secure-bank-verify.example/update',
    riskScore: 88,
    riskLevel: 'HIGH RISK',
    riskColor: 'text-red-600 dark:text-red-400',
    category: 'Banking Impersonation',
    confidence: '99.4% Multi-Signal',
    signals: [
      { name: 'Domain Spoofing', severity: 'Critical', desc: 'Subdomain mimics major bank while apex domain is unverified.' },
      { name: 'Suspicious Redirect', severity: 'High', desc: 'Resolves through intermediate obfuscated routing hop.' },
      { name: 'Urgency Manipulation', severity: 'High', desc: 'Uses immediate suspension lure to bypass user scrutiny.' },
      { name: 'Credential Harvesting', severity: 'Critical', desc: 'DOM analysis exposes credential extraction form targeting passwords and OTPs.' }
    ],
    whyFlagged: 'The destination masquerades as an official banking verification portal using typo-squatted subdomain routing and urgency manipulation. The apex domain was registered within 48 hours and lacks valid institution certificates.',
    recommendation: 'Do not open the URL or share credentials. Verify the request through the institution\'s official website or application.',
    safeBrowsing: 'Flagged (Phishing)',
    virusTotal: '14 / 88 Engines',
    geminiConfidence: 'High (0.994)'
  },
  {
    id: 'courier-sms',
    tabTitle: 'Sample 2: Fake Courier SMS',
    inputType: 'Suspicious SMS Text',
    inputValue: 'USPS Notice: Your package 8492-US is held at sorting hub due to incomplete address. Update info & pay $1.85 redelivery: https://usps-parcel-track.top/fix',
    riskScore: 92,
    riskLevel: 'HIGH RISK',
    riskColor: 'text-red-600 dark:text-red-400',
    category: 'Postal Fee Phishing',
    confidence: '98.8% Multi-Signal',
    signals: [
      { name: 'Brand Impersonation', severity: 'Critical', desc: 'Claims postal authority affiliation without official sender ID.' },
      { name: 'Fee Scam Lure', severity: 'High', desc: 'Requests micro-payment to collect full credit card data and billing details.' },
      { name: 'Deceptive TLD (.top)', severity: 'High', desc: 'High-risk generic top-level domain frequently utilized in phishing batches.' },
      { name: 'SMS Urgency Trigger', severity: 'Medium', desc: 'Threatens package return if not resolved immediately.' }
    ],
    whyFlagged: 'Content follows known smishing campaign templates spoofing delivery couriers. The embedded URL redirects to a payment-card harvesting portal completely disconnected from official postal infrastructure.',
    recommendation: 'Do not click the link or provide payment details. Track deliveries directly on the official USPS website using your original tracking number.',
    safeBrowsing: 'Flagged (Phishing)',
    virusTotal: '22 / 88 Engines',
    geminiConfidence: 'High (0.988)'
  },
  {
    id: 'qr-payment',
    tabTitle: 'Sample 3: QR Payment Trap',
    inputType: 'QR Payload String',
    inputValue: 'upi://pay?pa=cashback-support-verified@okaxis&pn=Customer%20Rewards&am=1&cu=INR&tn=Verification%20Charge',
    riskScore: 84,
    riskLevel: 'HIGH RISK',
    riskColor: 'text-amber-600 dark:text-amber-400',
    category: 'QR Payment Inversion',
    confidence: '97.2% Multi-Signal',
    signals: [
      { name: 'Payee Inversion Trap', severity: 'Critical', desc: 'Constructed as payment debit instead of promised incoming refund credit.' },
      { name: 'Name Spoofing', severity: 'High', desc: 'Virtual payment address misrepresents itself as "Customer Rewards".' },
      { name: 'Reverse Authorisation', severity: 'Critical', desc: 'Entering UPI PIN will execute fund transfer away from user account.' }
    ],
    whyFlagged: 'Scanned payload reverses payment intent. While advertised as a cashback claim or verification, scanning and authenticating this payload executes an outward transfer of funds to an unverified private beneficiary.',
    recommendation: 'Never scan a QR code or enter your banking PIN to receive money. Official refunds are credited directly without PIN authorization.',
    safeBrowsing: 'N/A (QR Scheme)',
    virusTotal: 'Flagged by Heuristic',
    geminiConfidence: 'High (0.972)'
  }
];

export default function SampleShowcase({ onTryLiveScan }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSample = sampleCases[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSample.inputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="showcase" className="py-24 bg-linear-to-b from-white via-[#F8FAFE] to-white dark:from-[#070B17] dark:via-[#0B1120] dark:to-[#070B17] border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF3FF] dark:bg-[#111827] border border-blue-200 dark:border-blue-900/60 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Threat Inspection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
            See Explainable AI in Action
          </h2>
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
            ScamSense doesn't just return a risk score. It explains what was detected, why it matters, and what you should do next.
          </p>
        </div>

        {/* Sample Switcher Tabs */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-center gap-2.5">
          {sampleCases.map((sample, idx) => (
            <button
              key={sample.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#0D1324] text-[#475569] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#263247] hover:border-blue-300 dark:hover:border-blue-500 hover:bg-[#F5F7FC] dark:hover:bg-[#111827]'
              }`}
            >
              {sample.tabTitle}
            </button>
          ))}
        </div>

        {/* Showcase Dashboard Container */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0D1324] rounded-3xl border border-[#E2E8F0] dark:border-[#263247] shadow-xl overflow-hidden transition-colors">
          
          {/* Header Bar - Light in light mode, dark in dark mode */}
          <div className="bg-[#F8FAFC] dark:bg-[#111827] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-[#263247]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-mono font-medium text-[#475569] dark:text-[#CBD5E1]">
                Explainable Threat Telemetry • Live Engine View
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 uppercase tracking-wider">
                Demonstration Data
              </span>
            </div>
          </div>

          {/* Sample Input Inspection Bar */}
          <div className="p-5 sm:p-6 bg-[#F5F7FC] dark:bg-[#070B17] border-b border-[#E2E8F0] dark:border-[#263247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full">
              <div className="text-[11px] font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Simulated Target: {currentSample.inputType}</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#111827] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#263247] text-xs sm:text-sm font-mono text-[#0F172A] dark:text-[#F8FAFC] w-full overflow-x-auto shadow-2xs">
                <span className="font-medium break-all">{currentSample.inputValue}</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#172033] flex items-center gap-1.5 shrink-0 shadow-2xs transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy Input'}</span>
            </button>
          </div>

          {/* Diagnostic Breakdown */}
          <div className="p-6 sm:p-8 space-y-7">
            
            {/* Top Score Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Metric 1: Risk Score (Light red background in light mode, dark red in dark mode) */}
              <div className="p-5 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    Risk Score
                  </div>
                  <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-0.5">
                    {currentSample.riskScore} <span className="text-sm font-medium text-[#64748B] dark:text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-red-600 text-white mt-1 inline-block shadow-xs">
                    {currentSample.riskLevel}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-200 dark:shadow-red-950">
                  <ShieldAlert className="w-7 h-7" />
                </div>
              </div>

              {/* Metric 2: Threat Category (Light purple/amber background) */}
              <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                    Threat Category
                  </div>
                  <div className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                    {currentSample.category}
                  </div>
                  <span className="text-xs text-purple-700 dark:text-purple-300 font-medium mt-0.5 block">
                    Targeted Deception Vector
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              {/* Metric 3: Confidence Level (Light blue background) */}
              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                    Confidence Level
                  </div>
                  <div className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                    {currentSample.confidence}
                  </div>
                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-0.5 block">
                    Verified Heuristic Weight
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Evidence: Detected Signals (White/light cards with subtle colored indicators) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F7FC] dark:bg-[#111827] text-[#475569] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#263247]">
                    Evidence
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
                    Detected Threat Signals ({currentSample.signals.length})
                  </h4>
                </div>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Multi-signal corroboration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSample.signals.map((sig, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#263247] bg-[#F8FAFC] dark:bg-[#111827] space-y-1 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{sig.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        sig.severity === 'Critical' 
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900' 
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                      }`}>
                        {sig.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed font-normal">
                      {sig.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis: Why was this flagged? */}
            <div className="p-5 rounded-2xl bg-[#EEF3FF] dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                  AI Analysis
                </span>
                <span className="text-sm font-bold text-blue-950 dark:text-blue-200">
                  Why was this flagged?
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#0F172A] dark:text-slate-200 leading-relaxed font-normal">
                {currentSample.whyFlagged}
              </p>
            </div>

            {/* Threat Intelligence Layer Strip */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Threat Intelligence
                </span>
                <span>Security Engine Telemetry</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#475569] dark:text-[#CBD5E1]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Google Safe Browsing: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{currentSample.safeBrowsing}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  VirusTotal: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{currentSample.virusTotal}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Gemini Model: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{currentSample.geminiConfidence}</strong>
                </span>
              </div>
            </div>

            {/* Recommendation: Recommended Protective Action */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                  Recommendation
                </span>
                <span>Recommended Protective Action</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-normal pl-7">
                {currentSample.recommendation}
              </p>
            </div>

            {/* Live CTA Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2E8F0] dark:border-[#263247]">
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium text-center sm:text-left">
                * Live ScamSense scanner runs full real-time API queries for your custom inputs.
              </span>
              <button
                onClick={onTryLiveScan}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Run Your Own Scan in Live Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
