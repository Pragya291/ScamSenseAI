import React, { useState } from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  Coins, 
  Bug, 
  ArrowRight, 
  ExternalLink, 
  MessageSquareWarning, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  Share2, 
  BookOpen, 
  X, 
  Scan,
  Lightbulb
} from 'lucide-react';

const THREAT_DATABASE = [
  {
    id: 'threat-otp',
    title: 'Rise in Fake Bank OTP Scams',
    category: 'OTP Fraud',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    iconColor: 'bg-red-100 text-red-600',
    date: 'Reported Oct 8, 2025',
    reportedBy: 'National Cyber Security Advisory',
    description: 'Scammers are using fake bank notifications to steal OTPs. Never share your OTP with anyone. Always verify via official bank app or call the number on your card. Reports up 42% this month across India.',
    suggestedScanType: 'Phone Number',
    overview: 'Fraudsters impersonate bank security personnel claiming an unauthorized charge is pending, convincing the victim to read back a verification code to "cancel the transaction".',
    stepsToFraud: [
      'Victim receives an urgent SMS or call alleging a debit of ₹25,000 or account suspension.',
      'Caller poses as bank fraud prevention desk and generates a password reset or UPI authorization.',
      'Caller pressures victim to provide the OTP over the phone to "block" the fake transaction.',
      'Account is immediately debited once the OTP is shared.'
    ],
    warningSigns: [
      'Callers demanding one-time passwords or card PINs.',
      'Extreme urgency: "Your card will be permanently frozen within 5 minutes".',
      'Caller asking you to install remote support apps (AnyDesk, TeamViewer).'
    ],
    protectionRules: [
      'No bank or institution ever asks for your OTP over phone or chat.',
      'Always hang up and call the number printed on the physical back of your debit card.',
      'Never approve incoming notification prompts on banking apps unless initiated by you.'
    ],
    ifAffected: 'Immediately call your bank helpline or 1930 (National Cyber Crime Helpline) to freeze debit channels.'
  },
  {
    id: 'threat-whatsapp',
    title: 'WhatsApp Giveaway Scams',
    category: 'Phishing',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'bg-amber-100 text-amber-600',
    date: 'Reported Oct 6, 2025',
    reportedBy: 'CERT-In Threat Brief',
    description: 'Fake rewards/spawning via WhatsApp. Deceptive messages promise free anniversary gifts, fuel subsidies, or smartphones in exchange for forwarding links to 10 contacts.',
    suggestedScanType: 'Message',
    overview: 'Viral messaging campaigns leverage social validation to spread fake branding surveys designed to harvest phone numbers and install browser adware.',
    stepsToFraud: [
      'Victim receives forwarded message: "Amazon 30th Anniversary Free Gift Spin Wheel".',
      'Survey link asks user to answer 4 simple questions.',
      'User is forced to share the link to 5 WhatsApp groups to claim the prize.',
      'User is redirected to premium SMS subscription trap or APK download.'
    ],
    warningSigns: [
      'Misspelled domain names (e.g. amazon-vip-rewards.click).',
      'Requirement to forward messages to friends before claiming prizes.',
      'Fake live chat testimonials scrolling at the bottom of the page.'
    ],
    protectionRules: [
      'Check official brand websites for active verified promotions.',
      'Do not click shortened links (bit.ly, tinyurl) received from unknown forwards.'
    ],
    ifAffected: 'Inform contacts you forwarded the link to, and clear recent browser cookies.'
  },
  {
    id: 'threat-crypto',
    title: 'Crypto Investment Fraud',
    category: 'Investment',
    badgeClass: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconColor: 'bg-yellow-100 text-yellow-700',
    date: 'Reported Oct 5, 2025',
    reportedBy: 'Financial Cyber Unit',
    description: 'Fake promises promising high returns. Organized syndicates lure victims through Telegram groups with falsified trading dashboards showing guaranteed 20% daily gains.',
    suggestedScanType: 'URL',
    overview: 'Pig-butchering romance and investment schemes where victims are guided into depositing USDT into unverified smart contracts.',
    stepsToFraud: [
      'Friendly stranger initiates contact on social media or messaging platforms.',
      'Shares screenshots of luxury lifestyle funded by "insider crypto signals".',
      'Guides victim to register on a fraudulent clone trading portal.',
      'Initial small withdrawal succeeds, encouraging massive subsequent deposits.',
      'Platform blocks withdrawals demanding "30% tax clearance fee".'
    ],
    warningSigns: [
      'Guaranteed high returns with zero stated risk.',
      'Urging to send cryptocurrency to anonymous personal wallet addresses.',
      'Demands for "tax clearance" before releasing your own funds.'
    ],
    protectionRules: [
      'Only use registered, compliant exchanges.',
      'Never invest based on unsolicited advice from online contacts.'
    ],
    ifAffected: 'Document transaction hashes and file an immediate report with cybercrime police.'
  },
  {
    id: 'threat-apk',
    title: 'Malware in APK Files',
    category: 'Malware',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    iconColor: 'bg-pink-100 text-pink-600',
    date: 'Reported Oct 4, 2025',
    reportedBy: 'Mobile Threat Defense Unit',
    description: 'Malicious mobile apps posing as popular tools, utility cleaners, or fake bank updates that request Accessibility Service permissions to read SMS and intercept OTPs.',
    suggestedScanType: 'Screenshot',
    overview: 'Sideloaded Android application packages distributed through phishing SMS messages claiming your e-challan or utility bill is unpaid.',
    stepsToFraud: [
      'SMS warns: "Your electricity will be cut off tonight at 9:30 PM. Call helpline or update app".',
      'SMS contains a direct download link to an APK file (e.g. BijliUpdate.apk).',
      'App requests SMS, Call Log, and Accessibility permissions.',
      'Malware runs silently in background forwarding all 2FA codes to attacker server.'
    ],
    warningSigns: [
      'Direct .apk download links received in SMS messages.',
      'Apps demanding "Accessibility Services" permission without justifiable need.',
      'Urgent electricity, gas, or traffic fine cutoff threats.'
    ],
    protectionRules: [
      'Never enable "Install from Unknown Sources" for messaging apps.',
      'Only download applications through Google Play Store or Apple App Store.',
      'Keep Google Play Protect active.'
    ],
    ifAffected: 'Reboot device into Safe Mode, uninstall the suspicious application, and reset all banking passwords.'
  },
  {
    id: 'threat-courier',
    title: 'Postal Courier & Delivery Impersonation',
    category: 'Phishing',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'bg-blue-100 text-blue-600',
    date: 'Reported Oct 2, 2025',
    reportedBy: 'APWG Phishing Report',
    description: 'Fake delivery alerts stating package cannot be dispatched due to invalid street address or unpaid ₹25 re-delivery fee, driving users to credential-harvesting portals.',
    suggestedScanType: 'URL',
    overview: 'Automated smishing targeting users awaiting online parcels, directing them to look-alike postal courier payment pages.',
    stepsToFraud: [
      'SMS: "Your parcel is on hold. Update address at link within 12 hours".',
      'Webpage asks for name, address, and credit card for small re-delivery charge.',
      'Stolen credit card details are used immediately for international purchases.'
    ],
    warningSigns: [
      'Shortened URL links from random cellular sender numbers.',
      'Requests for debit/credit card info for standard postal deliveries.'
    ],
    protectionRules: [
      'Track packages only using tracking numbers on official retailer apps.',
      'Never pay redelivery fees on third-party links.'
    ],
    ifAffected: 'Block card immediately and contact your card issuer.'
  }
];

export default function ThreatIntelligenceView({ onNavigateToScan }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleModal, setActiveArticleModal] = useState(null);

  const categories = ['All', 'Phishing', 'Investment', 'Malware', 'OTP Fraud'];

  // Filtering threat database
  const filteredThreats = THREAT_DATABASE.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredThreat = THREAT_DATABASE[0];

  const handleReadMore = (threat) => {
    setActiveArticleModal(threat);
  };

  const handleInspectInScan = (threat) => {
    setActiveArticleModal(null);
    if (onNavigateToScan) {
      onNavigateToScan(threat.suggestedScanType || 'URL');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F1F5F9] tracking-tight">
          Threat Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A8B6CC] mt-1.5">
          Latest scam trends, tactics and safety tips to keep you informed.
        </p>
      </div>

      {/* TOP SECTION: Featured Alert on Left, Threat Stack on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Featured Alert Card (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111C32] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] dark:border-[#293953] shadow-sm flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            {/* Top Red Badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-[#FB7185] text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-[#FB7185]" />
                <span>Latest Alert</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-[#8494AD] font-semibold">{featuredThreat.date}</span>
            </div>

            {/* Illustration Graphic Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 dark:bg-[#070C19] h-44 sm:h-52 flex items-center justify-center border border-slate-800 dark:border-[#293953] shadow-inner group">
              <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-blue-950/70 to-purple-950/70 opacity-90" />
              
              {/* Glowing vector hacker / cyber defense graphic */}
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2 transform group-hover:scale-105 transition">
                  <ShieldAlert className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-mono text-blue-300 dark:text-[#60A5FA] tracking-wider uppercase">
                  Active Advisory • Social Engineering
                </span>
              </div>
            </div>

            {/* Headline & Description */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F1F5F9] tracking-tight leading-snug">
              {featuredThreat.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B6CC] leading-relaxed">
              {featuredThreat.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => handleReadMore(featuredThreat)}
              className="px-6 py-3 rounded-xl font-bold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#6D28D9] shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Stack of Threat Cards (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          {THREAT_DATABASE.slice(1, 4).map((threat) => {
            const Icon = threat.category === 'Phishing' 
              ? MessageSquareWarning 
              : threat.category === 'Investment' 
              ? Coins 
              : Bug;

            return (
              <div
                key={threat.id}
                onClick={() => handleReadMore(threat)}
                className="bg-white dark:bg-[#111C32] rounded-2xl p-5 border border-[#E2E8F0] dark:border-[#293953] shadow-2xs hover:shadow-md hover:border-blue-200 dark:hover:border-[#6366F1] transition cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl ${threat.iconColor} dark:bg-[#162238] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9] group-hover:text-blue-600 dark:group-hover:text-[#6366F1] transition truncate">
                        {threat.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${threat.badgeClass} dark:bg-[#162238] dark:border-[#293953]`}>
                        {threat.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#A8B6CC] line-clamp-1 leading-snug">
                      {threat.description}
                    </p>
                    <span className="text-[10.5px] text-slate-400 dark:text-[#8494AD] font-semibold block mt-1">
                      {threat.date}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* CATEGORIES FILTER BAR */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
          Categories:
        </h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white shadow-xs'
                      : 'bg-white dark:bg-[#162238] border border-[#E2E8F0] dark:border-[#293953] text-slate-600 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#1E2D4A] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search threats input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#8494AD] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat advisories..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#293953] bg-white dark:bg-[#162238] text-xs text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#8494AD] focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#6366F1]"
            />
          </div>
        </div>
      </div>

      {/* SCAM STATS OVERVIEW CARDS (BOTTOM) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
          Scam Stats Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          {/* Card 1: Safe Reports */}
          <div className="bg-white dark:bg-[#111C32] rounded-2xl p-6 border border-emerald-100 dark:border-[#293953] shadow-2xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#34D399] flex items-center justify-center font-bold shrink-0 border border-emerald-200/60 dark:border-emerald-800/50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">
                Safe Reports
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-[#F1F5F9] mt-0.5 tracking-tight">
                1,248
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-[#34D399] flex items-center gap-1 mt-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>↓ 12% this week</span>
              </div>
            </div>
          </div>

          {/* Card 2: Suspicious Detected */}
          <div className="bg-white dark:bg-[#111C32] rounded-2xl p-6 border border-amber-100 dark:border-[#293953] shadow-2xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-[#FBBF24] flex items-center justify-center font-bold shrink-0 border border-amber-200/60 dark:border-amber-800/50">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">
                Suspicious Detected
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-[#F1F5F9] mt-0.5 tracking-tight">
                386
              </div>
              <div className="text-xs font-semibold text-amber-600 dark:text-[#FBBF24] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 19% this week</span>
              </div>
            </div>
          </div>

          {/* Card 3: High Risk Scams */}
          <div className="bg-white dark:bg-[#111C32] rounded-2xl p-6 border border-red-100 dark:border-[#293953] shadow-2xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-[#FB7185] flex items-center justify-center font-bold shrink-0 border border-red-200/60 dark:border-red-800/50">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-[#8494AD] uppercase tracking-wider">
                High Risk Scams
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-[#F1F5F9] mt-0.5 tracking-tight">
                97
              </div>
              <div className="text-xs font-semibold text-red-600 dark:text-[#FB7185] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 31% this week</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Safety Tip of the Day Strip */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-blue-50 to-purple-50 dark:from-[#162238] dark:to-[#111C32] border border-blue-200/60 dark:border-[#293953] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-[#6366F1] text-white flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-700 dark:text-[#A8B6CC]">
            <span className="font-bold text-slate-900 dark:text-[#F1F5F9]">Security Tip: </span>
            Never share an OTP, PIN, or password with anyone who calls or messages claiming to represent your bank.
          </div>
        </div>
        <button
          onClick={() => onNavigateToScan && onNavigateToScan('Message')}
          className="text-xs font-bold text-blue-600 dark:text-[#60A5FA] hover:underline shrink-0 cursor-pointer hidden sm:block"
        >
          Check suspicious message &rarr;
        </button>
      </div>

      {/* DETAILED THREAT ARTICLE MODAL */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C32] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-[#293953] space-y-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-[#293953] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${activeArticleModal.badgeClass} dark:bg-[#162238] dark:border-[#293953]`}>
                    {activeArticleModal.category}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-[#8494AD]">{activeArticleModal.date}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-[#F1F5F9]">{activeArticleModal.title}</h3>
                <div className="text-xs text-slate-500 dark:text-[#8494AD] font-medium">Source: {activeArticleModal.reportedBy}</div>
              </div>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[#162238] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] uppercase tracking-wider">
                Threat Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8B6CC] leading-relaxed bg-slate-50 dark:bg-[#162238] p-4 rounded-2xl border border-slate-200 dark:border-[#293953]">
                {activeArticleModal.overview}
              </p>
            </div>

            {/* How it works */}
            {activeArticleModal.stepsToFraud && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-[#F1F5F9] uppercase tracking-wider">
                  How This Scam Unfolds
                </h4>
                <div className="space-y-2">
                  {activeArticleModal.stepsToFraud.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-[#293953] text-xs text-slate-700 dark:text-[#A8B6CC]">
                      <span className="w-5 h-5 rounded-full bg-slate-800 dark:bg-[#293953] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning signs */}
            {activeArticleModal.warningSigns && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-900 dark:text-[#FB7185] uppercase tracking-wider">
                  Key Warning Signs
                </h4>
                <ul className="space-y-1.5 text-xs text-red-900 dark:text-red-200">
                  {activeArticleModal.warningSigns.map((sign, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-[#FB7185] shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to Protect Yourself */}
            {activeArticleModal.protectionRules && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 dark:text-[#34D399] uppercase tracking-wider">
                  Recommended Protective Measures
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                  {activeArticleModal.protectionRules.map((rule, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#34D399] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* If Affected */}
            {activeArticleModal.ifAffected && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">If you have already engaged: </span>
                <span>{activeArticleModal.ifAffected}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#293953]">
              <span className="text-xs text-slate-400 dark:text-[#8494AD]">
                Advisory verified by ScamSense Research
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#293953] text-xs font-bold text-slate-700 dark:text-[#A8B6CC] hover:bg-slate-50 dark:hover:bg-[#162238] dark:hover:text-[#F1F5F9] transition w-full sm:w-auto"
                >
                  Close
                </button>

                <button
                  onClick={() => handleInspectInScan(activeArticleModal)}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#2563EB] to-[#7C3AED] dark:from-[#4F46E5] dark:to-[#9333EA] text-white text-xs font-bold shadow-xs hover:opacity-95 transition flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>Check Suspicious Content</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
