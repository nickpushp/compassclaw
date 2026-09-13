import React from 'react';
import { Phone, Zap, X, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Urgent Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/40 animate-pulse">
            <Zap className="w-9 h-9 fill-red-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-300 text-xs font-bold border border-red-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>24/7 LIVE EMERGENCY DISPATCH</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Electrical Emergency? <br />
            <span className="text-red-400">Don't Wait.</span>
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
            One call and an electrician is on the way to your door. We answer live 24/7 — day, night, weekends, and holidays.
          </p>
        </div>

        {/* Warning card */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-400">Safety Precaution:</span>
            If you see active flame, burning odor, or water leaking near live outlets, turn off your main panel breaker immediately if safe to do so.
          </div>
        </div>

        {/* Direct Call Button */}
        <div className="space-y-3">
          <a
            href="tel:+17655438862"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
          >
            <Phone className="w-6 h-6 fill-white" />
            <span>Call Now: +1 765-543-8862</span>
          </a>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Master Electrician
            </span>
            <span>•</span>
            <span>Avg Arrival 20-30 Min</span>
            <span>•</span>
            <span>Indianapolis, IN</span>
          </div>
        </div>

      </div>
    </div>
  );
};
