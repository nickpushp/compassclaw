import React, { useState } from 'react';
import { Phone, Zap, Clock, ShieldCheck, MapPin, CheckCircle2, ChevronRight, AlertTriangle, Send } from 'lucide-react';

interface HeroProps {
  onOpenEmergencyModal: () => void;
  onOpenEstimateModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEmergencyModal, onOpenEstimateModal }) => {
  const [quickZip, setQuickZip] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('Outage / Tripped Breaker');
  const [submittedQuickForm, setSubmittedQuickForm] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickZip) return;
    setSubmittedQuickForm(true);
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#0b132b]">
      {/* Background Hero Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.jpg" 
          alt="Keetons Electrical Solutions Van and Master Electrician" 
          className="w-full h-full object-cover opacity-25 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b] via-[#0b132b]/90 to-[#0b132b]/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,210,255,0.15),transparent_60%)]"></div>
        
        {/* Animated Electric Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Main Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Urgent Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-semibold shadow-[0_0_15px_rgba(0,210,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>24/7 Emergency Electrician in Indianapolis</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Power Back On. <br />
              <span className="electric-gradient-text">Safe & Fast. Guaranteed.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed">
              From middle-of-the-night power outages & panel sparks to EV chargers and total house rewiring — 
              <span className="text-white font-semibold"> Keetons Electrical Solutions</span> delivers certified Master Electrician service across Indianapolis in under 30 minutes.
            </p>

            {/* Highlight Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Avg. Arrival</div>
                  <div className="text-base font-bold text-white">Under 30 Min</div>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Status</div>
                  <div className="text-base font-bold text-white">Licensed & Insured</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Zap className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Dispatch</div>
                  <div className="text-base font-bold text-white">Answered Live 24/7</div>
                </div>
              </div>
            </div>

            {/* Call Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:+17655438862"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-5 h-5 fill-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Call Now: +1 765-543-8862</span>
              </a>

              <button
                onClick={onOpenEstimateModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base bg-slate-900/90 hover:bg-slate-800 text-white border border-cyan-500/40 hover:border-cyan-400 transition-all hover:shadow-[0_0_20px_rgba(0,210,255,0.2)]"
              >
                <span>Request Free Estimate</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Location Guarantee Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Base Station: 1401 Ingomar St, Indianapolis, IN 46241 • Serving Wayne, Decatur, Speedway & Greater Indy</span>
            </div>
          </div>

          {/* Right Column - Quick Emergency & Quote Box */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_35px_rgba(0,168,255,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <h3 className="text-lg font-extrabold text-white">Fast Electrical Dispatch</h3>
                </div>
                <span className="text-xs text-cyan-400 font-semibold bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
                  Live Dispatch
                </span>
              </div>

              {submittedQuickForm ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Dispatch Notified!</h4>
                  <p className="text-sm text-slate-300">
                    A licensed electrician is reviewing your location in ZIP <span className="text-cyan-400 font-bold">{quickZip}</span> for immediate callback.
                  </p>
                  <p className="text-xs text-slate-400">
                    Need instant emergency response? Call directly:
                  </p>
                  <a
                    href="tel:+17655438862"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 text-sm shadow-md"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    +1 765-543-8862
                  </a>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      What issue are you experiencing?
                    </label>
                    <select
                      value={selectedIssue}
                      onChange={(e) => setSelectedIssue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option>Outage / Tripped Breaker / Sparks</option>
                      <option>Electrical Panel Upgrade (100A to 200A)</option>
                      <option>EV Charger Station Installation</option>
                      <option>Outlet / Switch / Lighting Repair</option>
                      <option>House Rewiring & Safety Code Inspection</option>
                      <option>Generator & Transfer Switch</option>
                      <option>Commercial Electrical Request</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Indianapolis ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 46241"
                        value={quickZip}
                        onChange={(e) => setQuickZip(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(317) 000-0000"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Emergency hazard or burning odor? Call immediately.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Check Technician Availability</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={onOpenEmergencyModal}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      Click here for instant 1-Tap Emergency Hotline
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
