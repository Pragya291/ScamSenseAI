import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TextScanner } from './components/TextScanner';
import { UrlScanner } from './components/UrlScanner';
import { QrScanner } from './components/QrScanner';
import { CommunityReports } from './components/CommunityReports';
import { ScanHistory } from './components/ScanHistory';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { getMe } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('scamsense_token');
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Token validation failed:", err);
          localStorage.removeItem('scamsense_token');
        }
      }
    };
    checkUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('scamsense_token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeTab === 'text' && <TextScanner />}
          {activeTab === 'url' && <UrlScanner />}
          {activeTab === 'qr' && <QrScanner />}
          {activeTab === 'reports' && <CommunityReports user={user} />}
          {activeTab === 'history' && <ScanHistory user={user} />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />

    </div>
  );
}
