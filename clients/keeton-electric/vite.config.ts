import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements: Record<string, string> = {
  "Keetons Electrical Solutions": "Keeton Electric",
  "Keetons": "Keeton Electric",
  "Indianapolis, IN 46241": "Tacoma, WA 98404",
  "Indianapolis, IN": "Tacoma, WA",
  "Indianapolis": "Tacoma",
  "Greater Indy": "South Puget Sound",
  "Wayne, Decatur, Speedway & Greater Indy": "Tacoma, Federal Way, Puyallup & surrounding areas",
  "1401 Ingomar St, Indianapolis, IN 46241": "1309 E 41st St, Tacoma, WA 98404",
  "1401 Ingomar St": "1309 E 41st St",
  "+1 765-543-8862": "+1 253-448-3210",
  "+17655438862": "+12534483210",
  "765-543-8862": "253-448-3210",
  "Master Electrician License #IN-EL-88492": "WA Contractor License #KEETOE872C6",
  "Licensed Indiana Master Electricians": "Washington Licensed Electrical Contractor",
  "Indianapolis ZIP Code": "Tacoma ZIP Code",
  "24/7 Emergency Electrician in Indianapolis": "Residential & Commercial Electrician in Tacoma",
  "24/7 Emergency Electrician in Tacoma": "Residential & Commercial Electrician in Tacoma",
  "24/7": "Emergency",
  "Under 30 Min": "Local Service",
  "Avg. Arrival": "Service Area",
  "Answered Live 24/7": "Call Keeton Electric",
  "Live Dispatch": "Tacoma Service",
  "Fast Electrical Dispatch": "Electrical Service",
  "Immediate Dispatch (30 Min)": "Call for Service",
  "30 Min": "Call for Service",
  "Master Electricians": "Licensed Electrical Contractors",
  "Commercial Master": "Commercial Service",
  "Certified EV Specialist": "EV Charger Service",
  "certified Master Electrician service across Tacoma in Local Service": "professional electrical service for Tacoma-area homes and businesses",
  "From middle-of-the-night power outages & panel sparks to EV chargers and total house rewiring — Keeton Electric delivers certified Master Electrician service across Tacoma in Local Service.": "From electrical panel upgrades and EV chargers to ceiling fans and everyday repairs — Keeton Electric provides practical electrical service for Tacoma-area homes and businesses.",
  "Full Liability & Workers Comp Insured": "Professional electrical contractor",
  "Background Checked & Drug Tested Staff": "Experienced electrical service",
  "Fully Stocked Vans for Same-Day Fixes": "Practical service and repair",
  "100% Satisfaction & Safety Guarantee": "Safety-focused workmanship",
  "Indianapolis Owned": "Tacoma Service Area",
  "Indianapolis code compliance guarantee": "code-conscious installation",
  "Indianapolis Code Compliance Guarantee": "Code-conscious installation",
  "Minimal operational downtime guaranteed": "Work planned to reduce disruption",
  "free on-site consultations": "project consultations",
  "Free on-site consultations": "Project consultations",
  "guaranteed": "planned",
  "Guarantee": "Commitment",
  "/hero-bg.jpg": "https://pikwizard.com/pw/medium/834b29f0a72096129d59235ad7766ce2.jpg",
  "/team-electricians.jpg": "https://pikwizard.com/pw/medium/6e38937a8fc28da731e15772109f8003.png"
};

function keetonRebrand() {
  return {
    name: "keeton-rebrand",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (!/\\.(tsx|ts|jsx|js)$/.test(id)) return null;
      let next = code;
      for (const [from, to] of Object.entries(replacements)) {
        next = next.split(from).join(to);
      }
      return next === code ? null : { code: next, map: null };
    }
  };
}

export default defineConfig({
  base: "/compassclaw/clients/keeton-electric/",
  plugins: [keetonRebrand(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
