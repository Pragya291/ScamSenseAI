import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingNavbar from './components/LandingNavbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import SampleShowcase from './components/SampleShowcase';
import ThreatIntel from './components/ThreatIntel';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  
  // Current view state: 'landing' | 'signin' | 'signup' | 'forgot-password' | 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('home');

  // Navigation handlers
  const navigateTo = (view, tab = 'home') => {
    setCurrentView(view);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading spinner during auth state restoration
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Initializing ScamSense AI...
          </span>
        </div>
      </div>
    );
  }

  // If user is authenticated or explicitly on the dashboard view
  if (user || currentView === 'dashboard') {
    return (
      <Dashboard 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={() => navigateTo('landing')} 
        onBackToHome={() => navigateTo('landing')} 
      />
    );
  }

  // View: Sign In
  if (currentView === 'signin') {
    return (
      <SignInPage
        onNavigateToSignUp={() => navigateTo('signup')}
        onNavigateToForgotPassword={() => navigateTo('forgot-password')}
        onBackToHome={() => navigateTo('landing')}
        onSuccessRedirect={() => navigateTo('dashboard', 'home')}
      />
    );
  }

  // View: Sign Up / Create Account
  if (currentView === 'signup') {
    return (
      <SignUpPage
        onNavigateToSignIn={() => navigateTo('signin')}
        onBackToHome={() => navigateTo('landing')}
        onSuccessRedirect={() => navigateTo('dashboard', 'home')}
      />
    );
  }

  // View: Forgot Password
  if (currentView === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigateToSignIn={() => navigateTo('signin')}
        onBackToHome={() => navigateTo('landing')}
      />
    );
  }

  // View: Landing Page (Default)
  return (
    <div className="min-h-screen bg-[#F7F9FE] text-[#111827] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Landing Navigation Bar */}
      <LandingNavbar 
        onNavigate={(view, tab = 'home') => {
          if (view === 'auth' || view === 'signin') navigateTo('signin');
          else if (view === 'signup') navigateTo('signup');
          else if (view === 'dashboard') navigateTo('dashboard', tab);
          else navigateTo('landing');
        }} 
        currentView={currentView} 
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero with Security Scanner Live Preview */}
        <Hero 
          onStartScanning={() => navigateTo('signin')} 
          onExploreHowItWorks={scrollToHowItWorks} 
        />

        {/* 2. Trust and Credibility Strip */}
        <TrustStrip />

        {/* 3. Features 4-in-1 Suite */}
        <Features onSelectFeature={() => navigateTo('signin')} />

        {/* 4. How It Works 6-Step Pipeline */}
        <HowItWorks />

        {/* 5. Live Sample Showcase (Explainable AI Demonstration) */}
        <SampleShowcase onTryLiveScan={() => navigateTo('signin')} />

        {/* 6. Threat Intelligence Preview */}
        <ThreatIntel onExploreIntel={() => navigateTo('signin')} />

        {/* 7. Final Call to Action */}
        <CTASection 
          onStartScanning={() => navigateTo('signin')} 
          onCreateAccount={() => navigateTo('signup')} 
        />
      </main>

      {/* 8. Dark Navy Footer */}
      <LandingFooter 
        onNavigate={(view) => {
          if (view === 'auth' || view === 'signin') navigateTo('signin');
          else if (view === 'signup') navigateTo('signup');
          else navigateTo('landing');
        }} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
