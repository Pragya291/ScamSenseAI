import React from 'react';

export default function Logo({ className = "h-9 w-auto", showText = true, onClick }) {
  return (
    <div 
      className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      {/* Official ScamSense AI Logo Shield Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src="/scamsense-logo.jpg"
          alt="ScamSense AI Logo"
          className="w-9 h-9 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {showText && (
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F1F5F9] flex items-center">
          ScamSense <span className="text-indigo-600 dark:text-[#6366F1] ml-1">AI</span>
        </span>
      )}
    </div>
  );
}

