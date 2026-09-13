import React, { useState } from 'react';
import { Zap, ShieldCheck, Wrench, BatteryCharging, Home, Lightbulb, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'emergency' | 'residential' | 'panels' | 'commercial'>('all');

  const servicesList = [
    {
      id: 'emergency-outage',
      category: 'emergency',
      icon: Zap,
      title: '24/7 Emergency Outage & Arc Repair',
      badge: 'Immediate Dispatch (30 Min)',
      description: 'Sudden blackout, burning electrical smell, sparking outlets, or buzzing breakers? Our emergency response team brings immediate diagnostic tools and replacement gear.',
      image: 'https://images.pexels.com/photos/7359566/pexels-photo-7359566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      features: [
        'Live 24/7 Phone Dispatch',
        'Arc-fault & Short Circuit Detection',
        'Burned Breaker & Main Fuse Repairs',
        'Emergency Power Restoration'
      ],
      priceRange: 'Flat-rate Diagnostic + Repair'
    },
    {
      id: 'panel-upgrades',
      category: 'panels',
      icon: ShieldCheck,
      title: 'Electrical Panel & Breaker Upgrades',
      badge: 'Most Popular',
      description: 'Upgrade outdated 60A or 100A fuse boxes to heavy-duty 200A or 400A breaker panels to power modern appliances, central AC, and EV fast chargers safely.',
      image: '/panel-upgrade.jpg',
      features: [
        '100A to 200A/400A Heavy-Up Panel Service',
        'Whole-House Surge Protection Built-In',
        'Indianapolis Code Compliance Guarantee',
        'Utility Meter Base & Wire Upgrades'
      ],
      priceRange: 'Upfront Flat Rate Estimates'
    },
    {
      id: 'ev-chargers',
      category: 'residential',
      icon: BatteryCharging,
      title: 'EV Fast Charger Installation (Level 2)',
      badge: 'Certified EV Specialist',
      description: 'Official Tesla Wall Connector & Universal Level 2 (40A-80A) home charger installations. Get up to 44 miles of range per hour of charging in your home garage.',
      image: 'https://images.pexels.com/photos/7285965/pexels-photo-7285965.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      features: [
        'Tesla, ChargePoint, JuiceBox & Ford Pro',
        'Dedicated 240V Heavy Conduit Circuit',
        'Garages, Carports & Outdoor Mounting',
        'Load Management & Permit Handling'
      ],
      priceRange: 'Fixed Quote + Rebate Guidance'
    },
    {
      id: 'rewiring-safety',
      category: 'residential',
      icon: Home,
      title: 'Whole-House Rewiring & Safety Inspections',
      badge: 'Safety First',
      description: 'Remediate dangerous vintage knob-and-tube or aluminum wiring in older Indianapolis homes. Complete whole-home grounding, GFCI protection, and insurance certifications.',
      image: 'https://images.pexels.com/photos/29491360/pexels-photo-29491360.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      features: [
        'Aluminum & Knob-and-Tube Remediation',
        'GFCI / AFCI Outlet Upgrades (Kitchens/Baths)',
        'Full Pre-Purchase Electrical Inspections',
        'Grounding Rod & Water Pipe Bonding'
      ],
      priceRange: 'Comprehensive Free Estimate'
    },
    {
      id: 'custom-lighting',
      category: 'residential',
      icon: Lightbulb,
      title: 'Custom Recessed LED & Architectural Lighting',
      badge: 'Energy Saver',
      description: 'Transform your indoor spaces and exterior curb appeal with ultra-efficient, dimmable wafer recessed lights, chandelier installations, and security floodlights.',
      image: 'https://images.pexels.com/photos/7647233/pexels-photo-7647233.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      features: [
        'Canless Slim LED Recessed Lighting',
        'Under-Cabinet Accent & Smart Dimmers',
        'High-Ceiling Chandelier & Fan Mounting',
        'Motion Floodlights & Dusk-to-Dawn Exterior'
      ],
      priceRange: 'Custom Design Quote'
    },
    {
      id: 'commercial-electrical',
      category: 'commercial',
      icon: Building2,
      title: 'Commercial Electrical & Maintenance',
      badge: 'Commercial Master',
      description: 'Full-service commercial electrician solutions for Indianapolis retail, warehouses, offices, restaurants, and industrial facilities. Minimal operational downtime guaranteed.',
      image: 'https://images.pexels.com/photos/28265032/pexels-photo-28265032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      features: [
        'Three-Phase 480V Power Distribution',
        'Commercial High-Bay LED Upgrades',
        'Emergency Exit Lighting & Signage',
        'Scheduled Preventive Maintenance Contracts'
      ],
      priceRange: 'Custom Commercial Proposal'
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? servicesList 
    : servicesList.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#0f172a] relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>What We Do</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Whatever your electrical needs, <span className="electric-gradient-text">we handle it.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            From quick troubleshooting and emergency repairs to full panel modernizations and high-tech EV installs, Keetons Electrical Solutions delivers clean, compliant, precision workmanship.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 mb-12">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'emergency', label: '⚡ Emergency & Outages' },
            { id: 'panels', label: '🔌 Panel Upgrades' },
            { id: 'residential', label: '🏡 Residential & EV' },
            { id: 'commercial', label: '🏢 Commercial Solutions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-[0_0_30px_rgba(0,168,255,0.15)]"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold backdrop-blur">
                      {service.badge}
                    </span>

                    <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-cyan-500/90 text-slate-950 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Feature bullet list */}
                    <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-6 pt-0 border-t border-slate-800/40 flex items-center justify-between mt-4">
                  <div className="text-xs text-slate-400 font-medium">
                    <span className="block text-[10px] text-slate-500 uppercase">Pricing</span>
                    {service.priceRange}
                  </div>

                  <button
                    onClick={() => onSelectService(service.title)}
                    className="px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Get Quote</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 shrink-0">
              <Zap className="w-8 h-8 fill-cyan-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Need something specific or custom electrical work?</h4>
              <p className="text-sm text-slate-300">Our Master Electricians provide free on-site consultations and transparent flat-rate pricing.</p>
            </div>
          </div>

          <a
            href="tel:+17655438862"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all flex items-center gap-2"
          >
            <span>Speak With Electrician: (765) 543-8862</span>
          </a>
        </div>

      </div>
    </section>
  );
};
