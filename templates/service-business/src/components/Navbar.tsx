import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Phone, Zap, Star, Menu, X, MapPin, Calculator } from 'lucide-react';

interface NavbarProps {
  onOpenEmergencyModal: () => void;
  onOpenEstimateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergencyModal, onOpenEstimateModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Team', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Service Area', href: '#service-area' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner Bar - matching template top notch */}
      <div className="bg-slate-950/95 border-b border-cyan-500/20 text-slate-300 text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>5.0</span>
              <span className="text-slate-400 font-normal">· 120+ local reviews</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>24/7 Emergency Service in Indianapolis</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>1401 Ingomar St, Indianapolis, IN 46241</span>
            </div>
            
            <a 
              href="tel:+17655438862" 
              className="flex items-center gap-1.5 font-bold text-white hover:text-cyan-400 transition-colors bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+1 765-543-8862</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0b132b]/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-cyan-500/20 py-3' 
            : 'bg-[#0b132b]/80 backdrop-blur-sm py-4 border-b border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-cyan-400 font-medium text-sm transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenEstimateModal}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(0,210,255,0.2)]"
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              Instant Quote
            </button>

            <a
              href="tel:+17655438862"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Phone className="w-3.5 h-3.5 fill-slate-950" />
              <span>(765) 543-8862</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0f172a] border-b border-cyan-500/30 px-4 pt-3 pb-6 space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
              <a
                href="tel:+17655438862"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold py-2.5 px-3 rounded-lg text-xs"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                Call 24/7
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEmergencyModal();
                }}
                className="flex items-center justify-center gap-1.5 bg-red-600/90 hover:bg-red-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs border border-red-400/30"
              >
                <Zap className="w-4 h-4 fill-white" />
                Emergency
              </button>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-200 hover:text-cyan-400 font-semibold py-2 px-3 rounded-md hover:bg-slate-800/80 transition-colors"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEstimateModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-cyan-300 font-bold py-2.5 px-4 rounded-lg border border-cyan-500/30"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              Calculate Estimate
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
