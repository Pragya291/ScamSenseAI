import React from 'react';

export default function Logo({ className = "h-9 w-auto", showText = true, onClick }) {
  return (
    <div 
      className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      {/* Shield Icon SVG with glowing cyber circuits and checkmark matching brand identity */}
      <div className="relative flex items-center justify-center">
        <svg
          className="w-9 h-9 transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4F46E5" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Shield Outer Shape */}
          <path
            d="M50 8C72 8 88 18 88 32C88 64 68 88 50 102C32 88 12 64 12 32C12 18 28 8 50 8Z"
            fill="url(#shieldGrad)"
            filter="url(#shieldShadow)"
          />

          {/* Inner Shield Background */}
          <path
            d="M50 14C68 14 82 22 82 35C82 61 65 82 50 94C35 82 18 61 18 35C18 22 32 14 50 14Z"
            fill="#FFFFFF"
          />

          {/* Circuit lines */}
          <g stroke="url(#shieldGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
            <path d="M28 32H38M38 32V42M38 42H28" />
            <path d="M72 32H62M62 32V42M62 42H72" />
            <path d="M26 48H34V60M34 60H26" />
            <path d="M74 48H66V60M66 60H74" />
            <path d="M40 22V28M60 22V28" />
            <path d="M38 72H44M56 72H62" />
          </g>

          {/* Center Checkmark */}
          <path
            d="M34 52L46 64L68 38"
            stroke="url(#shieldGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
          ScamSense <span className="text-blue-600 dark:text-blue-400 ml-1">AI</span>
        </span>
      )}
    </div>
  );
}
