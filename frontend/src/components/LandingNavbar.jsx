import React, { useState } from 'react';
import Logo from './Logo';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';

export default function LandingNavbar({ onNavigate, currentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E3E8F2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo onClick={() => onNavigate('landing')} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-[#5B6475] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-[#5B6475] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-[#5B6475] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('threat-intel')}
              className="text-sm font-medium text-[#5B6475] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Threat Intel
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-sm font-medium text-[#5B6475] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Live Demo
            </button>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('signin')}
              className="px-4 py-2 text-sm font-semibold text-[#111827] bg-white border border-[#E3E8F2] rounded-lg hover:border-gray-400 hover:bg-gray-50 transition shadow-xs cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] rounded-lg hover:opacity-95 hover:shadow-md transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E3E8F2] bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => scrollToSection('hero')}
            className="block w-full text-left py-2 text-base font-medium text-[#111827] hover:text-[#2563EB]"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base font-medium text-[#111827] hover:text-[#2563EB]"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-base font-medium text-[#111827] hover:text-[#2563EB]"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('threat-intel')}
            className="block w-full text-left py-2 text-base font-medium text-[#111827] hover:text-[#2563EB]"
          >
            Threat Intel
          </button>
          <button
            onClick={() => scrollToSection('showcase')}
            className="block w-full text-left py-2 text-base font-medium text-[#111827] hover:text-[#2563EB]"
          >
            Live Demo
          </button>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('signin');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-[#111827] border border-[#E3E8F2] rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('signup');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-linear-to-r from-[#2563EB] to-[#7C3AED] rounded-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export { LandingNavbar };
