import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingNavbar({ onNavigate, currentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-[#0D1324]/95 backdrop-blur-md shadow-sm border-b border-[#E2E8F0] dark:border-[#263247]' 
          : 'bg-white/80 dark:bg-[#0D1324]/80 backdrop-blur-sm border-b border-[#E2E8F0]/80 dark:border-[#263247]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with Brand Identity */}
          <div className="flex-shrink-0">
            <Logo onClick={() => onNavigate('landing')} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer py-1"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('threat-intel')}
              className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer py-1"
            >
              Threat Intelligence
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-sm font-semibold text-[#475569] dark:text-[#CBD5E1] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors cursor-pointer py-1 flex items-center gap-1.5"
            >
              <span>Live Demo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </nav>

          {/* Desktop Right actions: Theme Switcher, Sign In & Primary Dashboard CTA */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2.5 rounded-xl text-[#475569] dark:text-[#CBD5E1] bg-[#F5F7FC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] hover:bg-[#EEF3FF] dark:hover:bg-[#172033] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-all cursor-pointer shadow-2xs"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#475569]" />
              )}
            </button>

            <button
              onClick={() => onNavigate('signin')}
              className="px-4 py-2.5 text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] rounded-xl hover:bg-[#F5F7FC] dark:hover:bg-[#172033] transition shadow-2xs cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => onNavigate('dashboard', 'home')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer flex items-center gap-2 group"
            >
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Right Bar: Theme Toggle & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl text-[#475569] dark:text-[#CBD5E1] bg-[#F5F7FC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] transition cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#475569]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] transition focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E8F0] dark:border-[#263247] bg-white dark:bg-[#0D1324] px-5 pt-3 pb-6 space-y-3.5 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] hover:text-[#2563EB] transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] hover:text-[#2563EB] transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] hover:text-[#2563EB] transition"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('threat-intel')}
              className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] hover:text-[#2563EB] transition"
            >
              Threat Intelligence
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F5F7FC] dark:hover:bg-[#111827] hover:text-[#2563EB] transition flex items-center justify-between"
            >
              <span>Live Demo</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Interactive
              </span>
            </button>
          </nav>

          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#263247] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('signin');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263247] rounded-xl hover:bg-[#F5F7FC] dark:hover:bg-[#172033] transition"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('dashboard', 'home');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
