import React from 'react';
import { CheckCircle, MessageSquare, Zap, ShieldCheck, Wrench, Car, Fan, Thermometer, Lightbulb } from 'lucide-react';

const serviceHighlights = [
  { icon: Zap, service: 'Electrical Panel Upgrades', copy: 'Modernize aging panels and improve capacity for today’s electrical demands.' },
  { icon: Car, service: 'EV Charger Installation', copy: 'Get your home ready for convenient, dedicated EV charging.' },
  { icon: Fan, service: 'Ceiling Fan Installation', copy: 'Professional installation and repair for ceiling fans and related wiring.' },
  { icon: Thermometer, service: 'Thermostat Repair', copy: 'Electrical troubleshooting for thermostat and control issues.' },
  { icon: Lightbulb, service: 'Lighting & Electrical Repairs', copy: 'Practical repairs for switches, outlets, fixtures and everyday electrical issues.' },
  { icon: Wrench, service: 'Residential & Commercial', copy: 'Electrical work for homes, businesses and larger project needs.' },
];

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#0b132b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Electrical Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Electrical work that fits <span className="electric-gradient-text">your needs.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From everyday repairs to larger electrical projects, Keeton Electric provides practical service for Tacoma-area homes and businesses.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              Washington Licensed Contractor
            </div>
            <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20 font-bold text-sm">
              <CheckCircle className="w-5 h-5" />
              Serving Tacoma & surrounding areas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {serviceHighlights.map(({ icon: Icon, service, copy }) => (
            <div key={service} className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,168,255,0.1)]">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded inline-block border border-cyan-500/20">Keeton Electric</div>
                <h3 className="text-xl font-bold text-white">{service}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{copy}</p>
              </div>
              <div className="pt-4 mt-5 border-t border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                Request service or an estimate
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
