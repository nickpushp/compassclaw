import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, Clock, Phone, AlertCircle, Navigation } from 'lucide-react';

export const ServiceArea: React.FC = () => {
  const [searchZip, setSearchZip] = useState('');
  const [zipResult, setZipResult] = useState<{ covered: boolean; message: string; estTime: string } | null>(null);

  const coveredZips = [
    '46241', '46224', '46231', '46214', '46221', '46113', '46123', '46168',
    '46227', '46237', '46032', '46033', '46037', '46038', '46220', '46201',
    '46202', '46204', '46208', '46254', '46268', '46158', '46118'
  ];

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = searchZip.trim();
    if (!cleanZip) return;

    if (coveredZips.includes(cleanZip) || cleanZip.startsWith('460') || cleanZip.startsWith('461') || cleanZip.startsWith('462')) {
      setZipResult({
        covered: true,
        message: `Great news! ZIP ${cleanZip} is in our primary high-speed service zone.`,
        estTime: '15 - 30 Minutes'
      });
    } else {
      setZipResult({
        covered: false,
        message: `ZIP ${cleanZip} is outside our standard local zone, but we do take extended callouts upon request.`,
        estTime: '30 - 45 Minutes'
      });
    }
  };

  const areaList = [
    { name: 'Wayne Township / Ingomar St HQ', zip: '46241', time: '15-20 Min', status: 'Primary Hub' },
    { name: 'Speedway & West Indy', zip: '46224 / 46214', time: '15-25 Min', status: 'High Availability' },
    { name: 'Decatur Township & Camby', zip: '46221 / 46113', time: '15-25 Min', status: 'High Availability' },
    { name: 'Avon & Plainfield', zip: '46123 / 46168', time: '20-30 Min', status: 'Active Units' },
    { name: 'Greenwood & South Indy', zip: '46227 / 46142', time: '20-30 Min', status: 'Active Units' },
    { name: 'Carmel & Fishers', zip: '46032 / 46038', time: '25-35 Min', status: 'Active Units' },
    { name: 'Downtown Indianapolis', zip: '46204 / 46202', time: '15-25 Min', status: 'High Availability' },
    { name: 'Mooresville & Morgan County', zip: '46158', time: '20-30 Min', status: 'Active Units' }
  ];

  return (
    <section id="service-area" className="py-20 lg:py-28 bg-[#0f172a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Service Coverage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Serving your corner of <span className="electric-gradient-text">Greater Indianapolis.</span>
          </h2>

          <p className="text-slate-300 text-base">
            Based centrally at <strong>1401 Ingomar St, Indianapolis, IN 46241</strong>, our fleet of mobile service vans is strategically positioned across Marion and surrounding counties for fast dispatch.
          </p>
        </div>

        {/* Interactive Zip Code Availability Search */}
        <div className="mt-10 max-w-2xl mx-auto bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,168,255,0.15)]">
          <h3 className="text-white font-bold text-base mb-2 text-center">
            Check Live Dispatch Availability for Your ZIP Code
          </h3>

          <form onSubmit={handleZipCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter 5-digit ZIP (e.g. 46241, 46123)"
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shrink-0 shadow-md"
            >
              Check Availability
            </button>
          </form>

          {zipResult && (
            <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 text-sm transition-all ${
              zipResult.covered 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
            }`}>
              {zipResult.covered ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold">{zipResult.message}</p>
                <div className="flex items-center gap-2 text-xs opacity-90">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Est. Response Time: <strong>{zipResult.estTime}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Diagram & Townships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-center">
          
          {/* Map Visual Card */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-white text-base">Dispatch Base & Operations</h4>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30">
                Units Active
              </span>
            </div>

            {/* Stylized Circuit / Map Grid Visual */}
            <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
              
              {/* HQ Glowing Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-500/30 border-2 border-cyan-400 flex items-center justify-center animate-ping absolute"></div>
                <div className="w-8 h-8 rounded-full bg-cyan-500 border border-white flex items-center justify-center relative z-10 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.8)]">
                  <MapPin className="w-5 h-5 fill-slate-950" />
                </div>
                <span className="bg-slate-900 border border-cyan-400/50 text-cyan-300 font-extrabold text-[10px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  1401 Ingomar St HQ
                </span>
              </div>

              {/* Sub-pins */}
              <div className="absolute top-1/4 left-1/4 flex items-center gap-1 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Speedway</span>
              </div>

              <div className="absolute bottom-1/4 right-1/4 flex items-center gap-1 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Greenwood</span>
              </div>

              <div className="absolute top-1/3 right-1/3 flex items-center gap-1 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Avon</span>
              </div>

              <div className="mt-auto relative z-10 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span>GPS Radius: 35 Mile Radius</span>
                <span className="text-cyan-400 font-bold">24/7 Rapid Response</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Primary Address:</strong> 1401 Ingomar St, Indianapolis, IN 46241</p>
              <p><strong>Phone Hotline:</strong> <a href="tel:+17655438862" className="text-cyan-400 hover:underline font-bold">+1 765-543-8862</a></p>
            </div>
          </div>

          {/* Area List Grid */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-lg font-bold text-white mb-2">Primary Communities Served:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {areaList.map((area, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 p-3.5 rounded-xl transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-white">{area.name}</h5>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">
                      {area.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                    <span>ZIP: {area.zip}</span>
                    <span className="text-slate-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {area.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center sm:text-left">
              <a
                href="tel:+17655438862"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm group"
              >
                <span>Don't see your neighborhood? Give us a quick call to check</span>
                <Phone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
