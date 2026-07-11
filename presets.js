/* ============================================================
   Compass Claw — Trade Presets (shared by /d and /c renderers)
   One row of prospect data + a trade key -> full demo + dashboard.
   ============================================================ */
window.CC_PRESETS = {
  /* ---- palettes ---- */
  _palettes: {
    amber:   {a:"#ff7a18", a2:"#ffab5e"},
    gold:    {a:"#d4af5a", a2:"#e7cd94"},
    blue:    {a:"#3b82f6", a2:"#7dabff"},
    teal:    {a:"#14b8a6", a2:"#5eead4"},
    red:     {a:"#ef4444", a2:"#fca5a5"},
    green:   {a:"#22c55e", a2:"#86efac"},
    violet:  {a:"#8b5cf6", a2:"#c4b5fd"}
  },

  /* ---- trade definitions ---- */
  trades: {
    towing: {
      label:"Towing & Roadside", palette:"amber", hero:"/lib/towing/hero.webp",
      kicker:"24/7 Towing & Roadside Assistance",
      head:["Stranded?","Help","is minutes away."],
      sub:"Fast, reliable towing and roadside assistance — day or night. Every call answered live, a truck dispatched in minutes, and upfront pricing before we roll.",
      resp:"15–30 min", jobWord:"job", jobWordPl:"jobs", verb:"dispatched",
      avgTicket:275, bookRate:0.55,
      services:[
        {name:"Emergency Towing",desc:"Fast, damage-free towing to wherever you need — 24 hours a day."},
        {name:"Roadside Assistance",desc:"Jump-starts, lockouts, tire changes, and fuel delivery on the spot."},
        {name:"Accident Recovery",desc:"Careful recovery and winch-outs, coordinated with your insurer."},
        {name:"Heavy-Duty Towing",desc:"Trucks, RVs, and equipment — the right rig for any load."},
        {name:"Motorcycle Towing",desc:"Specialized, secure transport that protects your bike."},
        {name:"Private Property",desc:"Reliable removals and impound management for property owners."}
      ],
      dispositions:[
        {key:"booked",label:"Job dispatched",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours dispatch",color:"#ff7a18"},
        {key:"quote",label:"Price quote given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Local tow","Long-distance tow","Jump-start","Lockout","Tire change","Winch-out","Accident recovery","Fuel delivery"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Blown tire on the interstate at 11pm. Someone answered on the first ring and a truck was there in 20 minutes. Lifesaver."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Every other company sent me to voicemail. These guys picked up, quoted me straight, and showed up early. Highly recommend."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"Professional, fast, and fair on price. They handled the whole insurance side for me after my accident. Can't ask for more."}
      ],
      faq:[
        {q:"How fast can you get to me?",a:"Most calls see a truck on scene in 15–30 minutes. When you call, we give you a real ETA on the spot — no guessing, no waiting on a callback."},
        {q:"Do you answer 24/7?",a:"Yes. Every call is answered live, day or night — because breakdowns don't keep business hours."},
        {q:"How much will it cost?",a:"We quote you upfront before we roll, so there are no surprises. Pricing depends on distance and service, and we'll always tell you before you commit."},
        {q:"Do you work with my insurance?",a:"Absolutely. We coordinate directly with most major insurers and can handle accident recovery paperwork for you."},
        {q:"What areas do you cover?",a:"We cover the whole metro and surrounding highways. Tell us where you are when you call and we'll confirm instantly."}
      ]
    },

    autobody: {
      label:"Auto Body & Collision", palette:"red", hero:"/lib/autobody/hero.webp",
      kicker:"Collision Repair & Auto Body",
      head:["Back on the road,","better","than before."],
      sub:"Expert collision repair and refinishing with a lifetime workmanship warranty. Every call answered, free estimates, and we handle the insurance headache for you.",
      resp:"same day", jobWord:"estimate", jobWordPl:"estimates", verb:"booked",
      avgTicket:3200, bookRate:0.4,
      services:[
        {name:"Collision Repair",desc:"Precision frame and body repair that restores your vehicle to factory spec."},
        {name:"Paint & Refinishing",desc:"Computerized color-match and premium refinishing for a flawless finish."},
        {name:"Dent Removal",desc:"Paintless dent repair that saves time and keeps your original finish."},
        {name:"Insurance Claims",desc:"We work directly with your insurer and handle the paperwork end to end."},
        {name:"Frame Straightening",desc:"Laser-measured frame correction for safe, precise alignment."},
        {name:"Detailing",desc:"Showroom-quality detailing so your car leaves looking brand new."}
      ],
      dispositions:[
        {key:"booked",label:"Estimate booked",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours request",color:"#ef4444"},
        {key:"quote",label:"Insurance question",color:"#60a5fa"},
        {key:"question",label:"Repair question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Collision estimate","Insurance claim","Paint job","Dent repair","Frame work","Detailing","Bumper repair","Glass"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Someone rear-ended me and I was dreading the whole process. They answered every call, dealt with my insurance, and my car looks brand new."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Got a free estimate the same day I called. No runaround, no voicemail. The paint match is absolutely perfect."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"Best body shop in town. Professional from the first phone call to picking up my car. Lifetime warranty sealed it."}
      ],
      faq:[
        {q:"Do you offer free estimates?",a:"Yes — free, no-obligation estimates, and we can usually get you in the same day you call."},
        {q:"Will you work with my insurance?",a:"We work with all major insurers and handle the claim paperwork for you, so you don't have to chase anyone."},
        {q:"How long will my repair take?",a:"It depends on the damage, but we give you a clear timeline upfront and keep you updated the whole way through."},
        {q:"Do you guarantee your work?",a:"Every repair comes with a lifetime workmanship warranty. If anything isn't right, we make it right."},
        {q:"Can I get a rental while you work?",a:"Yes — we coordinate rentals and can arrange one as part of your insurance claim."}
      ]
    },

    hvac: {
      label:"HVAC", palette:"blue", hero:"/lib/hvac/hero.webp",
      kicker:"Heating, Cooling & Air Quality",
      head:["Comfort","restored","— fast."],
      sub:"Fast, reliable heating and cooling repair, installation, and maintenance. Every call answered live, same-day service, and upfront pricing before any work begins.",
      resp:"same day", jobWord:"job", jobWordPl:"jobs", verb:"booked",
      avgTicket:450, bookRate:0.5,
      services:[
        {name:"AC Repair",desc:"Fast diagnosis and repair to get your cooling back — same day in most cases."},
        {name:"Heating Repair",desc:"Furnace and heat-pump repair that keeps you warm when it matters."},
        {name:"New Installations",desc:"Right-sized, energy-efficient systems with financing options available."},
        {name:"Maintenance Plans",desc:"Seasonal tune-ups that prevent breakdowns and extend system life."},
        {name:"Indoor Air Quality",desc:"Filtration, humidity control, and cleaner air for your whole home."},
        {name:"Emergency Service",desc:"After-hours help when your system fails at the worst time."}
      ],
      dispositions:[
        {key:"booked",label:"Service booked",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours dispatch",color:"#3b82f6"},
        {key:"quote",label:"Estimate given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["AC repair","Heating repair","Install quote","Maintenance","No cooling","No heat","Thermostat","Air quality"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"AC died in a heat wave. They answered right away and had a tech out the same afternoon. Cool house by dinner."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Called three companies — only these guys picked up. Honest pricing, no upsell, fixed it in one visit."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"New system install was smooth from the first call. Fair quote, clean work, and my energy bill dropped."}
      ],
      faq:[
        {q:"Can you come out today?",a:"In most cases, yes. We answer every call live and offer same-day service so you're not left sweating — or freezing."},
        {q:"Do you charge for estimates?",a:"We give upfront pricing before any work starts, so you always know the cost before you commit."},
        {q:"Do you offer financing on new systems?",a:"Yes — flexible financing options are available so a new system fits your budget."},
        {q:"Do you service all brands?",a:"Our technicians are trained on all major makes and models, so we can repair whatever you have."},
        {q:"What about after-hours emergencies?",a:"We answer around the clock and dispatch for true emergencies so you're never stuck."}
      ]
    },

    plumbing: {
      label:"Plumbing", palette:"blue", hero:"/lib/plumbing/hero.webp",
      kicker:"Licensed Plumbing Services",
      head:["Leaks, clogs, chaos —","handled."],
      sub:"Licensed, upfront plumbing repair and installation. Every call answered live, fast dispatch, and a clear price before we start — no surprises.",
      resp:"same day", jobWord:"job", jobWordPl:"jobs", verb:"dispatched",
      avgTicket:380, bookRate:0.52,
      services:[
        {name:"Drain Cleaning",desc:"Fast, thorough clearing of any clog — sinks, tubs, and main lines."},
        {name:"Leak Repair",desc:"Quick detection and repair before a small leak becomes big damage."},
        {name:"Water Heaters",desc:"Repair and replacement, including tankless — hot water restored fast."},
        {name:"Emergency Plumbing",desc:"Burst pipes and overflows handled around the clock."},
        {name:"Repiping",desc:"Whole-home repiping done clean, code-compliant, and guaranteed."},
        {name:"Fixture Install",desc:"Faucets, toilets, and fixtures installed right the first time."}
      ],
      dispositions:[
        {key:"booked",label:"Job dispatched",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours dispatch",color:"#3b82f6"},
        {key:"quote",label:"Price quote given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Drain clog","Leak repair","Water heater","Burst pipe","Toilet repair","Faucet install","Repipe","Sewer line"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Water heater burst on a Sunday. They answered, dispatched fast, and had hot water back same day. Incredible."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"No voicemail runaround — a real person answered and quoted me straight. Fixed my clog in 30 minutes."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"Honest, licensed, and upfront on price. They've earned all our plumbing work from now on."}
      ],
      faq:[
        {q:"Do you offer emergency service?",a:"Yes — burst pipes and overflows can't wait. We answer around the clock and dispatch fast."},
        {q:"Will I know the price before you start?",a:"Always. We give you a clear, upfront price before any work begins — no surprises on the invoice."},
        {q:"Are you licensed and insured?",a:"Fully licensed and insured, and every job is guaranteed."},
        {q:"Can you come out today?",a:"In most cases, yes. Call and we'll confirm a same-day window on the spot."},
        {q:"Do you handle water heaters?",a:"We repair and replace all types, including tankless, and can usually restore hot water the same day."}
      ]
    },

    cleaning: {
      label:"Cleaning & Restoration", palette:"teal", hero:"/lib/cleaning/hero.webp",
      kicker:"Cleaning & Restoration",
      head:["Like it","never","happened."],
      sub:"Professional carpet, water, and damage restoration done right. Every call answered live, fast response, and upfront pricing before we start.",
      resp:"same day", jobWord:"job", jobWordPl:"jobs", verb:"booked",
      avgTicket:420, bookRate:0.48,
      services:[
        {name:"Carpet Cleaning",desc:"Deep, professional cleaning that lifts stains and refreshes any room."},
        {name:"Water Damage",desc:"Fast extraction and drying to stop damage and prevent mold."},
        {name:"Upholstery",desc:"Gentle, thorough cleaning that revives furniture and fabrics."},
        {name:"Tile & Grout",desc:"Restore tile and grout to like-new with deep steam cleaning."},
        {name:"Odor Removal",desc:"Complete odor elimination — smoke, pet, and more — not just masking."},
        {name:"Emergency Restoration",desc:"Around-the-clock response for floods and disasters."}
      ],
      dispositions:[
        {key:"booked",label:"Job booked",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours booking",color:"#14b8a6"},
        {key:"quote",label:"Price quote given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Carpet cleaning","Water damage","Upholstery","Tile & grout","Odor removal","Move-out clean","Commercial","Emergency"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Basement flooded overnight. They answered at 6am and had a crew extracting water by 9. Saved our home."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Booked a carpet cleaning in one quick call — no voicemail tag. Carpets look brand new. Amazing service."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"Fast, professional, and fair. They quoted me on the phone and stuck to it. Highly recommend."}
      ],
      faq:[
        {q:"How fast can you respond to water damage?",a:"Fast — every minute counts with water. We answer around the clock and dispatch a crew as quickly as possible."},
        {q:"Do you give upfront pricing?",a:"Yes. We quote you clearly before any work starts, so there are no surprises."},
        {q:"Do you work with insurance?",a:"We work directly with most insurers on restoration jobs and can help document the claim."},
        {q:"Can you remove tough stains and odors?",a:"Our process lifts deep stains and fully eliminates odors at the source — not just masking them."},
        {q:"Do you offer same-day appointments?",a:"In most cases, yes. Call and we'll confirm the soonest available window."}
      ]
    },

    locksmith: {
      label:"Locksmith", palette:"amber", hero:"/lib/locksmith/hero.webp",
      kicker:"24/7 Locksmith Services",
      head:["Locked out?","In","minutes."],
      sub:"Fast, licensed locksmith service — homes, cars, and businesses. Every call answered live, quick arrival, and upfront pricing before any work.",
      resp:"15–30 min", jobWord:"job", jobWordPl:"jobs", verb:"dispatched",
      avgTicket:165, bookRate:0.58,
      services:[
        {name:"Emergency Lockout",desc:"Fast, damage-free entry for homes, cars, and businesses."},
        {name:"Rekeying",desc:"Rekey locks quickly for security and peace of mind."},
        {name:"Car Keys",desc:"Cut and program keys and fobs on site — no dealership wait."},
        {name:"Lock Installation",desc:"High-security lock installation and upgrades."},
        {name:"Safe Services",desc:"Safe opening, repair, and installation by pros."},
        {name:"Commercial",desc:"Master key systems and access control for businesses."}
      ],
      dispositions:[
        {key:"booked",label:"Job dispatched",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours dispatch",color:"#ff7a18"},
        {key:"quote",label:"Price quote given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Home lockout","Car lockout","Rekey","Car key/fob","Lock install","Safe","Commercial","Broken key"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Locked out of my car in a parking lot at night. They answered instantly and had me in within 20 minutes."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Fast, friendly, and fair priced. Quoted me on the phone and stuck to it. No damage to my door at all."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"Rekeyed my whole house after we moved in. Professional from the first call. Highly recommend."}
      ],
      faq:[
        {q:"How fast can you get to me?",a:"Most lockouts see us on scene in 15–30 minutes. Call and we'll give you a real ETA immediately."},
        {q:"Do you answer 24/7?",a:"Yes — lockouts don't wait for business hours, and neither do we. Every call is answered live."},
        {q:"Will you damage my lock or door?",a:"No. Our techs use professional, damage-free entry methods on homes and vehicles."},
        {q:"Can you make car keys?",a:"Yes — we cut and program most keys and fobs on site, saving you a costly dealership trip."},
        {q:"Do you give upfront pricing?",a:"Always. We quote you before any work begins so there are no surprises."}
      ]
    },

    garage: {
      label:"Garage Door", palette:"amber", hero:"/lib/garage/hero.webp",
      kicker:"Garage Door Repair & Install",
      head:["Stuck door?","Fixed","today."],
      sub:"Fast garage door repair, springs, openers, and new installs. Every call answered live, same-day service, and clear pricing before we start.",
      resp:"same day", jobWord:"job", jobWordPl:"jobs", verb:"booked",
      avgTicket:340, bookRate:0.5,
      services:[
        {name:"Spring Repair",desc:"Broken spring replacement done safely and same-day."},
        {name:"Opener Repair",desc:"Repair or replace openers of every make and model."},
        {name:"Off-Track Doors",desc:"Fast correction to get your door moving safely again."},
        {name:"New Installations",desc:"Beautiful, energy-efficient new doors with financing available."},
        {name:"Cable & Roller",desc:"Cable, roller, and hardware repair for smooth, quiet operation."},
        {name:"Tune-Ups",desc:"Preventive maintenance that keeps your door reliable for years."}
      ],
      dispositions:[
        {key:"booked",label:"Job booked",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours request",color:"#ff7a18"},
        {key:"quote",label:"Price quote given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Spring repair","Opener repair","Off-track","New door quote","Cable/roller","Tune-up","Panel repair","Remote"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Spring snapped and my car was trapped inside. They answered, came same day, and fixed it in an hour."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Called and a real person picked up, quoted me fair, and showed up on time. Door is quiet as new."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"New door install looks fantastic. Smooth process from the first phone call. Highly recommend."}
      ],
      faq:[
        {q:"Can you come out today?",a:"In most cases, yes. We answer every call live and offer same-day service for repairs."},
        {q:"My spring broke — is that dangerous?",a:"Yes, springs are under high tension and should only be handled by a pro. Call us and we'll take care of it safely, same day."},
        {q:"Do you give upfront pricing?",a:"Always. You'll know the price before any work starts — no surprises."},
        {q:"Do you install new doors?",a:"We install a wide range of styles with financing available, and we'll help you choose the right fit."},
        {q:"Do you service all opener brands?",a:"Yes — we repair and replace all major opener makes and models."}
      ]
    },

    dental: {
      label:"Dental / Cosmetic", palette:"gold", hero:"/dental/assets/hero.webp", team:"/dental/assets/clinic.webp",
      kicker:"Cosmetic & Implant Dentistry",
      head:["The smile you've","always","wanted."],
      sub:"Advanced cosmetic and implant dentistry in a calm, modern practice. Same-day consultations, transparent pricing, and a team that answers every call.",
      resp:"same day", jobWord:"consult", jobWordPl:"consults", verb:"booked",
      avgTicket:2800, bookRate:0.42,
      services:[
        {name:"Dental Implants",desc:"Permanent, natural-looking replacements for missing teeth."},
        {name:"Porcelain Veneers",desc:"Custom-crafted veneers for a flawless, natural smile."},
        {name:"Smile Makeovers",desc:"A complete cosmetic plan combining whitening, veneers, and contouring."},
        {name:"Invisalign®",desc:"Clear, comfortable aligners that straighten without metal braces."},
        {name:"Teeth Whitening",desc:"Professional-grade whitening for a brighter smile in one visit."},
        {name:"All-on-4® Implants",desc:"A full arch of fixed teeth in as little as one day."}
      ],
      dispositions:[
        {key:"booked",label:"Consult booked",color:"#5ccf9e"},
        {key:"afterhrs",label:"After-hours booking",color:"#d4af5a"},
        {key:"quote",label:"Pricing / financing",color:"#60a5fa"},
        {key:"question",label:"Treatment question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Implant consult","Veneers inquiry","Invisalign","Smile makeover","Teeth whitening","New patient","Emergency visit","All-on-4"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"I put off implants for years out of fear. They made it painless and the result is unbelievable — I can't stop smiling."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"From the first call to my final reveal, everything was seamless. They answered every question, day or night."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"The most professional dental experience I've ever had. Booking was effortless and my smile has never looked better."}
      ],
      faq:[
        {q:"How much do implants or veneers cost?",a:"It depends on your goals, but we give clear, upfront pricing at your consultation. We also offer 0% financing so your ideal smile fits your budget."},
        {q:"Can I book a consultation same day?",a:"Yes. When you call, our team can check availability and secure your consultation immediately — no phone tag."},
        {q:"Does it hurt? I'm nervous.",a:"You're in good hands. We're known for a gentle approach and comfort options that keep you completely relaxed."},
        {q:"Do you offer financing?",a:"We do — including 0% options. We'll walk you through the plans so you can move forward with confidence."},
        {q:"What if I have an emergency?",a:"Call right away — every call is answered instantly, and we prioritize getting you seen and out of pain fast."}
      ]
    },

    realestate: {
      label:"Real Estate", palette:"violet", hero:"/lib/realestate/hero.webp",
      kicker:"Your Local Real Estate Expert",
      head:["Your next move,","made","simple."],
      sub:"Buy or sell with an agent who answers every call. Instant response to every inquiry, expert local guidance, and a smooth process from first showing to closing.",
      resp:"same day", jobWord:"showing", jobWordPl:"showings", verb:"booked",
      avgTicket:9000, bookRate:0.35,
      services:[
        {name:"Buying",desc:"Find the right home with an expert who knows the local market cold."},
        {name:"Selling",desc:"Sell for top dollar with pro marketing and sharp negotiation."},
        {name:"Free Home Valuation",desc:"Know exactly what your home is worth in today's market."},
        {name:"Investment Property",desc:"Build wealth with guidance on income and investment properties."},
        {name:"Relocation",desc:"Moving to the area? We make the transition seamless."},
        {name:"First-Time Buyers",desc:"Patient, step-by-step guidance through your first purchase."}
      ],
      dispositions:[
        {key:"booked",label:"Showing booked",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours inquiry",color:"#8b5cf6"},
        {key:"quote",label:"Valuation request",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["Buyer inquiry","Listing appt","Home valuation","Showing request","Investment","Relocation","First-time buyer","Open house"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Responded to my inquiry within minutes when other agents took days. Sold our home above asking in a week."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Always reachable, always on top of it. Made our first home purchase feel easy and stress-free."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"True local expert. Every call answered, every question handled. We'll never use anyone else."}
      ],
      faq:[
        {q:"What's my home worth?",a:"Call for a free, no-obligation valuation based on real local market data — you'll know exactly where you stand."},
        {q:"How quickly will you respond?",a:"Fast — every call and inquiry is answered promptly, because in this market timing wins deals."},
        {q:"Do you help first-time buyers?",a:"Absolutely. We guide you step by step so the process feels clear and manageable from start to finish."},
        {q:"What areas do you cover?",a:"We know the whole metro and surrounding neighborhoods in depth. Tell us where you're looking and we'll guide you."},
        {q:"What does it cost to work with you?",a:"We'll walk you through commissions and costs upfront and transparently, with no pressure."}
      ]
    },

    generic: {
      label:"Other / General", palette:"amber", hero:"",
      kicker:"Local Service You Can Count On",
      head:["Every call","answered","— every time."],
      sub:"Professional local service with a team that actually picks up. Fast response, upfront pricing, and a smooth experience from first call to finished job.",
      resp:"same day", jobWord:"job", jobWordPl:"jobs", verb:"booked",
      avgTicket:350, bookRate:0.5,
      services:[
        {name:"Fast Response",desc:"Every call answered live — no voicemail, no waiting on a callback."},
        {name:"Upfront Pricing",desc:"Clear pricing before any work begins, so there are no surprises."},
        {name:"Expert Service",desc:"Experienced professionals who get the job done right the first time."},
        {name:"Flexible Scheduling",desc:"Same-day and after-hours availability that works around you."},
        {name:"Satisfaction Guaranteed",desc:"We stand behind our work — your satisfaction comes first."},
        {name:"Local & Trusted",desc:"A local team your neighbors already know and recommend."}
      ],
      dispositions:[
        {key:"booked",label:"Job booked",color:"#4ade80"},
        {key:"afterhrs",label:"After-hours booking",color:"#ff7a18"},
        {key:"quote",label:"Price quote given",color:"#60a5fa"},
        {key:"question",label:"General question",color:"#a78bfa"},
        {key:"spam",label:"Spam / robocall",color:"#6b6f79"}
      ],
      serviceTypes:["New inquiry","Quote request","Booking","Follow-up","Service call","After-hours","Referral","General"],
      reviews:[
        {name:"Marcus T.",loc:"Google review",stars:5,text:"Every other place sent me to voicemail. These folks answered on the first ring and took care of everything."},
        {name:"Renee W.",loc:"Google review",stars:5,text:"Fast, professional, and fair on price. Quoted me straight and delivered exactly what they promised."},
        {name:"Gary P.",loc:"Google review",stars:5,text:"Best service in town. Answered every call and every question. Couldn't recommend them more highly."}
      ],
      faq:[
        {q:"Do you answer after hours?",a:"Yes — every call is answered live, so you're never stuck waiting on a callback."},
        {q:"Will I know the price upfront?",a:"Always. We quote you clearly before any work begins — no surprises."},
        {q:"Can you help me today?",a:"In most cases, yes. Call and we'll confirm the soonest available time on the spot."},
        {q:"Are you licensed and insured?",a:"Yes, fully — and we stand behind every job we do."},
        {q:"What areas do you serve?",a:"We cover the whole local area. Tell us where you are and we'll confirm instantly."}
      ]
    }
  }
};
