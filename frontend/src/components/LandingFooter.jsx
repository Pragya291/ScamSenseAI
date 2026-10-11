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
    <footer className="bg-[#F8FAFF] dark:bg-[#070B17] text-[#475569] dark:text-[#CBD5E1] border-t border-[#E2E8F0] dark:border-[#263247] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex-shrink-0">
              <Logo onClick={() => handleNav('hero')} />
            </div>
            
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Detect. Explain. Protect.
            </p>

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-sm leading-relaxed">
              AI-powered scam intelligence and verification system designed to keep individuals and organizations safe from social engineering threats.
            </p>
          </div>

          {/* Column: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('features')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('threat-intel')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  Threat Intel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('showcase')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  Live Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Resources & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('hero')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('signin')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  Help & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('threat-intel')}
                  className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer text-[#475569] dark:text-[#CBD5E1]"
                >
                  Security Advisories
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] cursor-pointer">
                  Security Disclosures
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0] dark:border-[#263247]">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0D1324] border border-[#E2E8F0] dark:border-[#263247] text-[11.5px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed shadow-2xs">
            <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Safety Notice: </span>
            ScamSense AI provides automated risk assessments and defensive safety guidance. Heuristic results are educational and defensive in nature and should not replace independent verification with official institution channels.
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] gap-4">
          <div>
            &copy; {currentYear} ScamSense AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] cursor-pointer">Terms</span>
            <span className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] cursor-pointer">Cookies</span>
            <span className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
