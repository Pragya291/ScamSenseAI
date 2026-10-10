import React from 'react';
import { Shield, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950 border border-cyan-800 rounded-xl">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-white text-lg">ScamSense AI</span>
          </div>

          <p className="text-xs text-slate-500 text-center sm:text-right">
            Disclaimer: AI risk assessments provide probabilistic threat analysis. Always verify official domains directly.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 ScamSense AI Project. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/Pragya291/ScamSenseAI" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
