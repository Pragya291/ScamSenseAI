import React from 'react';
import Logo from './Logo';
import { Shield } from 'lucide-react';

export default function LandingFooter({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleNav = (sectionId) => {
    onNavigate('landing');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#0B1224] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                ScamSense <span className="text-blue-400">AI</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 font-medium">
              Detect. Explain. Protect.
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              AI-powered scam intelligence and verification system designed to keep individuals and organizations safe from social engineering threats.
            </p>
          </div>

          {/* Column: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('features')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('threat-intel')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Threat Intel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('showcase')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Live Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Resources & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('hero')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('signin')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Help & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('threat-intel')}
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Security Advisories
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200 cursor-pointer">
                  Security Disclosures
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11.5px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Safety Notice: </span>
            ScamSense AI provides automated risk assessments and defensive safety guidance. Heuristic results are educational and defensive in nature and should not replace independent verification with official institution channels.
          </div>
        </div>

        {/* Copyright & Bottom note */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {currentYear} ScamSense AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookies</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export { LandingFooter };
