import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, Zap, Phone } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'What should I do right now if I smell burning electrical odor or see sparks?',
      a: 'Safety comes first! If you smell burning plastic, hear loud buzzing/arcing, or see sparks: 1) Safely step away from the area, 2) If safe, turn off the main breaker at your main electrical panel, 3) Do NOT touch exposed wires, and 4) Call Keetons Electrical Solutions immediately at +1 765-543-8862. Our emergency unit is available 24/7/365.'
    },
    {
      q: 'How much does an electrical panel upgrade cost in Indianapolis?',
      a: 'Upgrading from a 60A or 100A panel to a 200A or 400A heavy-duty panel in Indianapolis typically ranges from $1,800 to $3,800 depending on panel location, grounding requirements, and utility meter base upgrades. We provide 100% upfront flat-rate pricing with no surprise add-ons after the job is completed.'
    },
    {
      q: 'Are your electricians licensed, background-checked, and insured in Indiana?',
      a: 'Yes, absolutely. Keetons Electrical Solutions operates under Licensed Indiana Master Electrician credential #IN-EL-88492. We carry $2,000,000 in commercial liability insurance and full workers compensation. Every member of our team undergoes rigorous background checks and continuous code training.'
    },
    {
      q: 'How fast can an electrician arrive at my location in Greater Indianapolis?',
      a: 'Our average arrival time is under 30 minutes for emergency calls in Wayne Township, Speedway, Decatur, Avon, Greenwood, and central Indianapolis. Because our shop is based at 1401 Ingomar St, we have quick access to I-465, I-70, and I-65.'
    },
    {
      q: 'Do you install Tesla Wall Connectors and universal Level 2 EV chargers?',
      a: 'Yes! We are certified EV charging station installers. We handle everything from dedicated 240V 50A/60A circuit installation to wall mounting, load management, and pulling necessary local permits for Tesla, ChargePoint, JuiceBox, Ford Charge Station Pro, and more.'
    },
    {
      q: 'Do you offer free estimates before any work begins?',
      a: 'Yes! We provide free on-site or over-the-phone estimates for planned installations, panel upgrades, EV chargers, and rewiring projects. For diagnostic troubleshooting, we state our flat service diagnostic fee upfront before turning a screwdriver.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit/debit cards (Visa, MasterCard, Discover, Amex), Apple Pay, Google Pay, company checks, and cash. We also offer flexible financing options for major panel upgrades and rewiring projects.'
    }
  ];

  const filteredFaqs = searchQuery.trim() === '' 
    ? faqs 
    : faqs.filter(item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#0b132b] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Good To Know</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Questions, <span className="electric-gradient-text">answered.</span>
          </h2>

          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Everything you need to know about our electrical services, emergency response, panel upgrades, and transparent pricing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g., panel cost, EV charger, emergency)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none placeholder:text-slate-500 shadow-md"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="mt-10 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-sm">
              No matching questions found. Call us directly at <a href="tel:+17655438862" className="text-cyan-400 font-bold">+1 765-543-8862</a> for instant answers!
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-900 border-cyan-500/40 shadow-[0_0_20px_rgba(0,168,255,0.1)]' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-white hover:text-cyan-300 transition-colors focus:outline-none"
                  >
                    <span className="flex items-center gap-3">
                      <Zap className={`w-4 h-4 shrink-0 ${isOpen ? 'text-cyan-400 fill-cyan-400' : 'text-slate-500'}`} />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 mt-1">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Phone Banner below FAQ */}
        <div className="mt-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h4 className="text-white font-bold text-base">Have a question not listed here?</h4>
            <p className="text-slate-400 text-xs">Our master electricians answer live 24/7/365 to assist you.</p>
          </div>

          <a
            href="tel:+17655438862"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span>Call +1 765-543-8862</span>
          </a>
        </div>

      </div>
    </section>
  );
};
