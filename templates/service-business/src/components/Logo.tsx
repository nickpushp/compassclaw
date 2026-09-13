import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const dimensions = {
    sm: { circle: 'w-10 h-10', text: 'text-base', subtext: 'text-[10px]' },
    md: { circle: 'w-12 h-12', text: 'text-xl', subtext: 'text-xs' },
    lg: { circle: 'w-16 h-16', text: 'text-2xl', subtext: 'text-sm' },
    xl: { circle: 'w-24 h-24', text: 'text-3xl', subtext: 'text-base' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* KES Circular Emblem matching the original logo */}
      <div className={`relative ${dimensions.circle} rounded-full p-0.5 bg-gradient-to-b from-cyan-400 via-blue-600 to-slate-900 shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-transform duration-300 hover:scale-105 shrink-0`}>
        <div className="w-full h-full rounded-full bg-[#0b132b] p-1 flex items-center justify-center relative overflow-hidden border border-cyan-400/40">
          {/* Background Lightning sparks */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.25)_0%,transparent_70%)]"></div>
          
          <svg viewBox="0 0 200 200" className="w-full h-full text-cyan-400 relative z-10">
            {/* Outer Circular Ring */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="#00a8ff" strokeWidth="4" opacity="0.8" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="#1e293b" strokeWidth="6" />

            {/* Top Text Arch Path (Keetons Electrical) */}
            <path id="topArc" d="M 25 100 A 75 75 0 0 1 175 100" fill="none" />
            <text className="text-[18px] font-extrabold fill-white tracking-widest uppercase">
              <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                KEETONS ELECTRICAL
              </textPath>
            </text>

            {/* Bottom Text Arch Path (Solutions) */}
            <path id="bottomArc" d="M 175 100 A 75 75 0 0 1 25 100" fill="none" />
            <text className="text-[19px] font-extrabold fill-cyan-400 tracking-wider uppercase">
              <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                SOLUTIONS
              </textPath>
            </text>

            {/* Center Circle with Plugs / Lightning loop */}
            <circle cx="100" cy="100" r="48" fill="#0f172a" stroke="#00d2ff" strokeWidth="3" />
            
            {/* Stylized Plugs Circuit Loop */}
            <path d="M 65 92 A 36 36 0 0 1 135 92" fill="none" stroke="#00d2ff" strokeWidth="4" strokeLinecap="round" />
            <path d="M 135 108 A 36 36 0 0 1 65 108" fill="none" stroke="#00d2ff" strokeWidth="4" strokeLinecap="round" />
            
            {/* KES Center Text */}
            <text x="100" y="108" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="28" letterSpacing="1">
              KES
            </text>

            {/* Lightning Accents */}
            <path d="M 52 100 L 60 92 L 56 100 L 64 100 L 52 112 L 56 102 L 52 100 Z" fill="#00d2ff" />
            <path d="M 148 100 L 140 108 L 144 100 L 136 100 L 148 88 L 144 98 L 148 100 Z" fill="#00d2ff" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`font-heading font-black tracking-tight text-white leading-none ${dimensions.text} flex items-center gap-1.5`}>
            <span>KEETONS</span>
            <span className="text-cyan-400 font-extrabold">ELECTRICAL</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-slate-300 font-bold tracking-widest uppercase ${dimensions.subtext}`}>
              SOLUTIONS
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] text-cyan-300 font-medium hidden sm:inline">
              Indianapolis, IN
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
