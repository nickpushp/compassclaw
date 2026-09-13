import React, { useState } from 'react';
import { Calculator, X, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

interface EstimateCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const EstimateCalculator: React.FC<EstimateCalculatorProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const [serviceType, setServiceType] = useState(preselectedService || 'Panel Upgrade (100A to 200A/400A)');
  const [homeSize, setHomeSize] = useState('Medium (1,500 - 3,000 sq ft)');
  const [urgency, setUrgency] = useState('Standard (Within 24-48 Hours)');
  const [zipCode, setZipCode] = useState('46241');
  const [customerName, setNewCustomerName] = useState('');
  const [customerPhone, setNewCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  // Calculate dynamic estimate range
  const getEstimate = () => {
    let baseMin = 250;
    let baseMax = 450;

    if (serviceType.includes('Panel')) {
      baseMin = 1800;
      baseMax = 3200;
    } else if (serviceType.includes('EV Charger')) {
      baseMin = 650;
      baseMax = 1200;
    } else if (serviceType.includes('Outage') || serviceType.includes('Emergency')) {
      baseMin = 195;
      baseMax = 450;
    } else if (serviceType.includes('Rewiring')) {
      baseMin = 3500;
      baseMax = 8500;
    } else if (serviceType.includes('Lighting')) {
      baseMin = 450;
      baseMax = 1100;
    } else if (serviceType.includes('Generator')) {
      baseMin = 950;
      baseMax = 2200;
    }

    if (homeSize.includes('Large')) {
      baseMin = Math.round(baseMin * 1.25);
      baseMax = Math.round(baseMax * 1.3);
    } else if (homeSize.includes('Commercial')) {
      baseMin = Math.round(baseMin * 1.6);
      baseMax = Math.round(baseMax * 1.8);
    }

    if (urgency.includes('Immediate Emergency')) {
      baseMin += 100;
      baseMax += 150;
    }

    return { min: baseMin, max: baseMax };
  };

  const estimate = getEstimate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Instant Electrical Cost Calculator</h3>
            <p className="text-xs text-slate-400">Get an instant transparent estimate range for Indianapolis homes</p>
          </div>
        </div>

        {isBooked ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-white">Estimate Locked & Request Received!</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you <span className="text-cyan-400 font-bold">{customerName || 'Customer'}</span>! A Master Electrician from our 1401 Ingomar St shop will call <span className="text-white font-bold">{customerPhone}</span> within 15 minutes to confirm details.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="text-white font-bold">{serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Range:</span>
                <span className="text-cyan-400 font-bold">${estimate.min} - ${estimate.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Urgency:</span>
                <span className="text-emerald-400 font-bold">{urgency}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Service selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Electrical Service Required *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option>Panel Upgrade (100A to 200A/400A)</option>
                  <option>EV Charger Station Installation (Level 2)</option>
                  <option>24/7 Emergency Outage / Tripped Breakers</option>
                  <option>Whole-House Rewiring & Code Inspection</option>
                  <option>Recessed LED Lighting & Dimmers</option>
                  <option>Generator Transfer Switch & Inlet Box</option>
                  <option>Outlets, Switches & GFCI Upgrades</option>
                  <option>Commercial Electrical Service</option>
                </select>
              </div>

              {/* Property size */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Property Size / Scope
                </label>
                <select
                  value={homeSize}
                  onChange={(e) => setHomeSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option>Small (Under 1,500 sq ft / Condo)</option>
                  <option>Medium (1,500 - 3,000 sq ft)</option>
                  <option>Large (3,000+ sq ft / Multi-Story)</option>
                  <option>Commercial Facility / Industrial</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Desired Timeline / Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option>Standard (Within 24-48 Hours)</option>
                  <option>Immediate Emergency (Under 30 Min)</option>
                  <option>Same Day Service</option>
                  <option>Flexible / Planning Ahead</option>
                </select>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

            </div>

            {/* Instant Calculated Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 border border-cyan-500/40 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                  Calculated Estimate Range
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
                  <span>${estimate.min}</span>
                  <span className="text-slate-500 text-lg font-normal">–</span>
                  <span className="text-cyan-300">${estimate.max}</span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 space-y-0.5 hidden sm:block">
                <div className="flex items-center justify-end gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>No Hidden Fees</span>
                </div>
                <p>Includes parts, labor & guarantee</p>
              </div>
            </div>

            {/* Contact Form Inputs */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Lock In This Quote & Request Appointment:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={customerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none placeholder:text-slate-600"
                />

                <input
                  type="tel"
                  required
                  placeholder="Phone Number *"
                  value={customerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Additional details or specific questions (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder:text-slate-600"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Confirm & Request Electrician Dispatch</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
