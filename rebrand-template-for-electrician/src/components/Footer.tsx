import React from 'react';
import { Logo } from './Logo';
import { Phone, MapPin, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs pt-16 pb-24 border-t border-cyan-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="lg" />
            
            <p className="text-slate-300 text-sm leading-relaxed">
              Indianapolis’s premier licensed master electrician service. Providing 24/7 emergency power outage repairs, 200A panel upgrades, Level 2 EV charging, and whole-house safety rewiring.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-semibold text-[11px]">
                IN Master Lic #IN-EL-88492
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-semibold text-[11px]">
                Fully Insured $2M
              </span>
            </div>
          </div>

          {/* Contact Details from Prompt */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Contact Information</h4>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Primary Shop & Base:</span>
                  <span className="text-slate-300">1401 Ingomar St, Indianapolis, IN 46241, United States</span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-xs block">24/7 Phone Hotline:</span>
                  <a href="tel:+17655438862" className="text-white font-extrabold hover:text-cyan-400 transition-colors text-base">
                    +1 765-543-8862
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-xs block">Hours of Operation:</span>
                  <span className="text-emerald-400 font-bold">24 Hours / 7 Days a Week / 365 Days</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Electrical Services</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">Our Team</a></li>
              <li><a href="#reviews" className="hover:text-cyan-400 transition-colors">Customer Reviews</a></li>
              <li><a href="#service-area" className="hover:text-cyan-400 transition-colors">Indianapolis Service Area</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">Good To Know / FAQ</a></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Central Indiana</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Wayne Township (46241)</li>
              <li>Speedway (46224)</li>
              <li>Decatur Township (46113)</li>
              <li>Avon & Plainfield</li>
              <li>Greenwood & South Indy</li>
              <li>Carmel & Fishers</li>
              <li>Downtown Indy</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} Keetons Electrical Solutions. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Indiana License #IN-EL-88492</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
