import React from 'react';
import { PhoneCall, ShieldCheck, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

interface ProcessProps {
  onOpenEmergencyModal: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onOpenEmergencyModal }) => {
  const steps = [
    {
      num: '01',
      title: 'Call or Request Online',
      subtitle: 'Answered live 24/7',
      description: 'Dial +1 765-543-8862 or submit a request online. Our local Indianapolis dispatch team instantly logs your issue, location, and sends the nearest certified electrician.',
      icon: PhoneCall,
      highlight: '30-Min Average Arrival'
    },
    {
      num: '02',
      title: 'On-Site Diagnostic & Upfront Quote',
      subtitle: 'No hidden fees or surprises',
      description: 'Our electrician arrives in a fully equipped rolling warehouse, performs thorough safety diagnostics, and provides a clear flat-rate quote before touching a single wire.',
      icon: ShieldCheck,
      highlight: '100% Upfront Pricing'
    },
    {
      num: '03',
      title: 'Certified Repair & Guarantee',
      subtitle: 'Safe power restored',
      description: 'We execute the repair using industrial-grade components, test every circuit for Indiana code compliance, and clean up the work area completely. Backed by our warranty.',
      icon: CheckCircle2,
      highlight: 'Lifetime Workmanship Guarantee'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#0b132b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>How It Works</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Help is <span className="electric-gradient-text">three steps away.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            We’ve eliminated the frustration of unreliable contractors. Here is how simple it is to get fast, expert electrical service with Keetons.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-cyan-500/10 via-cyan-500/50 to-cyan-500/10 -translate-y-12 z-0"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="relative z-10 bg-slate-900/90 rounded-2xl p-8 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,168,255,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="inline-block text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/20 mb-3">
                    {step.highlight}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {step.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-400 mb-4">
                    {step.subtitle}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>Step {step.num} Complete</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Call Box */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-cyan-500/30 p-4 sm:p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
              <span className="text-sm font-bold text-white">In an urgent electrical situation right now?</span>
            </div>

            <button
              onClick={onOpenEmergencyModal}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm border border-red-400/40 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              Dispatch Emergency Unit Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
