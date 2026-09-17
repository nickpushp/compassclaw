import React from 'react';
import { Users, Award, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export const AboutTeam: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#0f172a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Team Picture & Stats */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(0,168,255,0.2)]">
              <img 
                src="/compassclaw/clients/keeton-electric/team-electricians.jpg" 
                alt="Keeton Electric Team" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">Keetons Electrical Solutions</h4>
                  <p className="text-slate-400 text-xs">Master Electrician License #IN-EL-88492</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                  <span>★ 5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Overlapping Badge */}
            <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 bg-cyan-500 text-slate-950 p-4 rounded-2xl font-black text-sm shadow-xl shadow-cyan-500/20 max-w-[200px] border border-cyan-300">
              <Award className="w-8 h-8 shrink-0" />
              <div>
                <div className="text-base leading-tight">100% Local</div>
                <div className="text-[10px] uppercase font-bold opacity-90">Indianapolis Owned</div>
              </div>
            </div>
          </div>

          {/* Right Column: Copywriting */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Who You're Calling</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Locally owned & operated right here in <span className="electric-gradient-text">Indianapolis.</span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              When you call <span className="text-white font-semibold">Keetons Electrical Solutions</span>, you’re not talking to a national call center. You’re connecting directly with licensed Indianapolis electricians based out of our shop at <strong>1401 Ingomar St</strong>.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              Founded on principles of extreme safety, honest flat-rate pricing, and rapid local response, we treat every home and business like it belongs to our own family. No shortcuts, no hidden charges, just clean, guaranteed electrical work.
            </p>

            {/* Trust Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Licensed Indiana Master Electricians',
                'Full Liability & Workers Comp Insured',
                'Background Checked & Drug Tested Staff',
                'Upfront Flat-Rate Pricing (No Surprises)',
                'Fully Stocked Vans for Same-Day Fixes',
                '100% Satisfaction & Safety Guarantee'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Address & Phone Direct Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1401 Ingomar St, Indianapolis, IN 46241</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Direct Line: +1 765-543-8862</span>
                </div>
              </div>

              <a
                href="tel:+17655438862"
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md"
              >
                Call Our Shop Now
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
