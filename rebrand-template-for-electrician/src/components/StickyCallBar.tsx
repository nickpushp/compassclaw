import React from 'react';
import { Phone, Zap, Calculator } from 'lucide-react';

interface StickyCallBarProps {
  onOpenEmergencyModal: () => void;
  onOpenEstimateModal: () => void;
}

export const StickyCallBar: React.FC<StickyCallBarProps> = ({
  onOpenEmergencyModal,
  onOpenEstimateModal,
}) => {
  return (
    <aside aria-label="Quick Actions" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-cyan-500/30 p-2.5 sm:p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Info pill */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-white font-bold">Keetons Electrical Solutions</span>
          <span className="text-slate-400">· 1401 Ingomar St, Indianapolis, IN</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          
          <button
            onClick={onOpenEstimateModal}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs sm:text-sm border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Instant Quote</span>
          </button>

          <button
            onClick={onOpenEmergencyModal}
            className="hidden sm:flex px-3.5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs sm:text-sm border border-red-500/40 transition-all items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-red-400 fill-red-400" />
            <span>24/7 Emergency</span>
          </button>

          <a
            href="tel:+17655438862"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Phone className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>Call +1 765-543-8862</span>
          </a>

        </div>

      </div>
    </aside>
  );
};
