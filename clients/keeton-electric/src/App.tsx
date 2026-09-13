import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { AboutTeam } from './components/AboutTeam';
import { Reviews } from './components/Reviews';
import { ServiceArea } from './components/ServiceArea';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { EmergencyModal } from './components/EmergencyModal';
import { EstimateCalculator } from './components/EstimateCalculator';
import { StickyCallBar } from './components/StickyCallBar';

export function App() {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedServiceForEstimate, setSelectedServiceForEstimate] = useState<string | undefined>(undefined);

  const handleSelectService = (serviceName: string) => {
    setSelectedServiceForEstimate(serviceName);
    setIsEstimateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Fixed Navigation Bar */}
      <Navbar 
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenEstimateModal={() => {
          setSelectedServiceForEstimate(undefined);
          setIsEstimateModalOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Banner */}
        <Hero 
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          onOpenEstimateModal={() => {
            setSelectedServiceForEstimate(undefined);
            setIsEstimateModalOpen(true);
          }}
        />

        {/* Services / What We Do */}
        <Services onSelectService={handleSelectService} />

        {/* How It Works / 3 Step Process */}
        <Process onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)} />

        {/* Who You're Calling / Team */}
        <AboutTeam />

        {/* Reviews / Testimonials */}
        <Reviews />

        {/* Service Area / Indianapolis Metro & Zip Lookup */}
        <ServiceArea />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Call & Action Bar */}
      <StickyCallBar 
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenEstimateModal={() => {
          setSelectedServiceForEstimate(undefined);
          setIsEstimateModalOpen(true);
        }}
      />

      {/* Emergency Hotline Modal */}
      <EmergencyModal 
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Interactive Instant Estimate & Booking Modal */}
      <EstimateCalculator 
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        preselectedService={selectedServiceForEstimate}
      />
    </div>
  );
}

export default App;
