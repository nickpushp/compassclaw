/*
 * SWAYZE TOWING - CLIENT DEMO CONFIGURATION
 * DEMO DATA: Replace these simulated values with approved client details before launch.
 */
window.SITE_CONFIG = {
  business: {
    name: "Swayze Towing",
    legalName: "Swayze Towing",
    niche: "Towing & Roadside Assistance",
    serviceArea: "Denver Metro & Front Range",
    tagline: "Reliable Towing & Roadside Assistance",
    logoUrl: "assets/821d9b11-504bd4622a9f63a98c60939ed08d932a.favicon.ico",
    faviconUrl: "assets/821d9b11-504bd4622a9f63a98c60939ed08d932a.favicon.ico",
    websiteUrl: "https://demo.swayzetowing.com"
  },

  contact: {
    phone: "(303) 555-0147",
    phoneHref: "3035550147",
    email: "hello@swayzetowing.demo",
    address: "1450 W Colfax Ave, Denver, CO 80204",
    hours: "Open 24 hours · 7 days a week",
    mapUrl: "https://maps.google.com/?q=1450+W+Colfax+Ave+Denver+CO+80204"
  },

  seo: {
    title: "Swayze Towing | Towing & Roadside Assistance",
    description: "Swayze Towing provides fast, dependable towing and roadside assistance. Service area, hours, and booking details coming soon.",
    ogImage: "",
    canonicalUrl: "https://demo.swayzetowing.com"
  },

  hero: {
    title: "Swayze Towing",
    eyebrow: "Towing & Roadside Assistance",
    displayLines: [
      "Fast, Reliable Towing",
      "When You Need Help Most,",
      "We Get You Moving Again."
    ],
    formTitle: "Get Towing Help Now",
    primaryCta: "Get Towing Help",
    secondaryCta: "Call Swayze Towing"
  },

  services: [
    "Emergency Towing",
    "Roadside Assistance",
    "Flatbed Towing",
    "Accident Recovery",
    "Jump Starts",
    "Lockout Service",
    "Flat Tire Assistance",
    "Fuel Delivery",
    "Long-Distance Towing"
  ],

  locations: {
    areas: [
      {
        name: "Denver Metro & Front Range",
        cities: ["Denver", "Aurora", "Lakewood", "Arvada"]
      }
    ],
    footerOffices: [
      {
        address: "1450 W Colfax Ave, Denver, CO 80204",
        phone: "(303) 555-0147",
        phoneHref: "3035550147",
        mapUrl: "https://maps.google.com/?q=1450+W+Colfax+Ave+Denver+CO+80204"
      }
    ]
  },

  testimonials: [
    { name: "Maya R.", text: "Swayze Towing arrived quickly, explained everything clearly, and handled my car with care. I felt taken care of from the first call." },
    { name: "Jordan T.", text: "Professional, friendly, and right on time. The driver made a stressful roadside situation much easier." },
    { name: "Chris D.", text: "Fair communication and a smooth tow from start to finish. I would call Swayze again." }
  ],

  reviewSummary: {
    rating: "5.0",
    countLabel: "48 reviews"
  },

  faqs: [
    { q: "How quickly can a Swayze driver arrive?", a: "For local calls, we provide an arrival estimate during dispatch and keep you updated by phone or text. Exact timing depends on traffic, location, and vehicle access." },
    { q: "Can you tow cars, trucks, SUVs, and motorcycles?", a: "Yes. We coordinate the right equipment for everyday cars, SUVs, light trucks, motorcycles, and specialty vehicles. Share your vehicle details when you schedule service." },
    { q: "Do you provide roadside assistance without a tow?", a: "Yes. Jump starts, lockouts, flat-tire assistance, and fuel delivery are available when a tow is not required." },
    { q: "Can I schedule a tow for a later time?", a: "Yes. Schedule a service window for shop delivery, transport, roadside help, or a planned move. Emergency dispatch is also available when you need help now." },
    { q: "Where can you take my vehicle?", a: "We can coordinate delivery to a repair shop, dealership, home, storage facility, or another approved destination across the Denver Metro and Front Range." },
    { q: "What information should I have ready?", a: "Your location, vehicle year and model, destination, and a short description of what happened help us send the right equipment and give you a faster estimate." },
    { q: "Are your rates explained before service begins?", a: "Yes. We aim to explain the dispatch, mileage, equipment, and any applicable service charges before work begins so there are no avoidable surprises." },
    { q: "How do I request help or schedule service?", a: "Use the Schedule Service button, start a chat, or call the dispatch line. We will collect the details needed to coordinate the next step." }
  ],

  colors: {
    cssVariables: {}
  },

  /*
   * Add approved client files to this folder and set their paths here.
   * Empty values currently preserve the original template assets.
   */
  assets: {
    logoUrl: "assets/821d9b11-504bd4622a9f63a98c60939ed08d932a.favicon.ico",
    heroImageUrl: "assets/d3e11ca0-services-banner.webp",
    ogImageUrl: "assets/b4c97562-og-default-green.jpg"
  },

  integrations: {
    leadEndpoint: "",
    callTrackingScript: "",
    analyticsId: "",
    aiChatProvider: "retell",
    aiChatEndpoint: "",
    calendarUrl: "https://calendly.com/swayze-towing-demo/roadside-help",
    googleReviewUrl: "#review-capture",
    privateFeedbackEndpoint: "#private-feedback-demo",
    smsProvider: "Demo SMS workflow",
    missedCallWebhook: "#missed-call-demo",
    instantLeadSmsWebhook: "#instant-lead-sms-demo",
    consentRequired: true
  },

  social: {
    facebook: "https://www.facebook.com/swayzetowingdemo",
    instagram: "https://www.instagram.com/swayzetowingdemo",
    youtube: "https://www.youtube.com/@swayzetowingdemo",
    tiktok: "https://www.tiktok.com/@swayzetowingdemo"
  }
};
