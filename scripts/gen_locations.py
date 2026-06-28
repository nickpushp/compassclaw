#!/usr/bin/env python3
"""
Compass Claw — Ohio SEO/AEO page generator.

Generates, from one data model:
  - Cornerstone service pages:  /services/{slug}/
  - A services hub:             /services/
  - Programmatic city pages:    /{city_slug}/{city}-oh/
  - A service-area hub:         /locations/
  - sitemap.xml and llms.txt (AEO)

Design goals: each SERVICE reads genuinely differently (no thin clones), every
page carries schema + internal links. AI Talking Website stays the flagship.

Usage:
    python scripts/gen_locations.py            # build everything
    python scripts/gen_locations.py --only columbus
"""
import os, sys, html, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://compassclaw.com"

BIZ = {
    "name": "Compass Claw",
    "phone_display": "(740) 831-3443",
    "phone_e164": "+1-740-831-3443",
    "street": "420 Second Street",
    "locality": "Portsmouth", "region": "OH", "postal": "45662",
    "lat": 38.7317, "lon": -82.9977,
    "gbp": "https://share.google/C8sZa1rz0fuIAz4Ll",
}

# --- Ohio cities. metro=True also gets the flagship industry variants. ---
CITIES = [
    {"name": "Portsmouth",     "county": "Scioto",     "metro": True,  "nearby": ["Wheelersburg", "New Boston", "Lucasville", "South Webster"]},
    {"name": "Columbus",       "county": "Franklin",   "metro": True,  "nearby": ["Dublin", "Westerville", "Hilliard", "Grove City"]},
    {"name": "Cleveland",      "county": "Cuyahoga",   "metro": True,  "nearby": ["Parma", "Lakewood", "Euclid", "Strongsville"]},
    {"name": "Cincinnati",     "county": "Hamilton",   "metro": True,  "nearby": ["Norwood", "Mason", "West Chester", "Blue Ash"]},
    {"name": "Dayton",         "county": "Montgomery", "metro": True,  "nearby": ["Kettering", "Beavercreek", "Huber Heights", "Centerville"]},
    {"name": "Toledo",         "county": "Lucas",      "metro": True,  "nearby": ["Sylvania", "Maumee", "Perrysburg", "Oregon"]},
    {"name": "Akron",          "county": "Summit",     "metro": True,  "nearby": ["Cuyahoga Falls", "Stow", "Barberton", "Tallmadge"]},
    {"name": "Canton",         "county": "Stark",      "metro": True,  "nearby": ["Massillon", "North Canton", "Alliance", "Louisville"]},
    {"name": "Youngstown",     "county": "Mahoning",   "metro": True,  "nearby": ["Boardman", "Austintown", "Canfield", "Struthers"]},
    {"name": "Springfield",    "county": "Clark",      "metro": True,  "nearby": ["Enon", "New Carlisle", "Northridge", "Springfield Township"]},
    {"name": "Hamilton",       "county": "Butler",     "metro": True,  "nearby": ["Fairfield", "Middletown", "Oxford", "Trenton"]},
    {"name": "Chillicothe",    "county": "Ross",       "metro": True,  "nearby": ["Waverly", "Frankfort", "Bainbridge", "Kingston"]},

    {"name": "Lorain",         "county": "Lorain",     "metro": False, "nearby": ["Elyria", "Sheffield Lake", "Amherst", "Avon"]},
    {"name": "Elyria",         "county": "Lorain",     "metro": False, "nearby": ["Lorain", "Avon", "North Ridgeville", "Grafton"]},
    {"name": "Middletown",     "county": "Butler",     "metro": False, "nearby": ["Franklin", "Trenton", "Monroe", "Hamilton"]},
    {"name": "Newark",         "county": "Licking",    "metro": False, "nearby": ["Heath", "Granville", "Pataskala", "Buckeye Lake"]},
    {"name": "Mansfield",      "county": "Richland",   "metro": False, "nearby": ["Ontario", "Lexington", "Shelby", "Bellville"]},
    {"name": "Mentor",         "county": "Lake",       "metro": False, "nearby": ["Willoughby", "Painesville", "Eastlake", "Kirtland"]},
    {"name": "Findlay",        "county": "Hancock",    "metro": False, "nearby": ["Fostoria", "Arlington", "Carey", "McComb"]},
    {"name": "Warren",         "county": "Trumbull",   "metro": False, "nearby": ["Niles", "Cortland", "Howland", "Champion"]},
    {"name": "Lancaster",      "county": "Fairfield",  "metro": False, "nearby": ["Pickerington", "Baltimore", "Carroll", "Sugar Grove"]},
    {"name": "Lima",           "county": "Allen",      "metro": False, "nearby": ["Elida", "Bath", "Shawnee", "Delphos"]},
    {"name": "Marion",         "county": "Marion",     "metro": False, "nearby": ["Prospect", "Caledonia", "LaRue", "Marion Township"]},
    {"name": "Delaware",       "county": "Delaware",   "metro": False, "nearby": ["Powell", "Sunbury", "Lewis Center", "Galena"]},
    {"name": "Zanesville",     "county": "Muskingum",  "metro": False, "nearby": ["New Concord", "Roseville", "South Zanesville", "Dresden"]},
    {"name": "Athens",         "county": "Athens",     "metro": False, "nearby": ["Nelsonville", "The Plains", "Albany", "Glouster"]},
    {"name": "Brunswick",      "county": "Medina",     "metro": False, "nearby": ["Medina", "Strongsville", "Hinckley", "Valley City"]},
    {"name": "Parma",          "county": "Cuyahoga",   "metro": False, "nearby": ["Brooklyn", "Seven Hills", "Parma Heights", "Independence"]},
    {"name": "Kettering",      "county": "Montgomery", "metro": False, "nearby": ["Centerville", "Oakwood", "Beavercreek", "Moraine"]},
    {"name": "Cuyahoga Falls", "county": "Summit",     "metro": False, "nearby": ["Stow", "Munroe Falls", "Tallmadge", "Hudson"]},
    {"name": "Dublin",         "county": "Franklin",   "metro": False, "nearby": ["Hilliard", "Powell", "Worthington", "Upper Arlington"]},
    {"name": "Westerville",    "county": "Franklin",   "metro": False, "nearby": ["Gahanna", "Worthington", "New Albany", "Blacklick"]},
    {"name": "Reynoldsburg",   "county": "Franklin",   "metro": False, "nearby": ["Pickerington", "Pataskala", "Blacklick", "Whitehall"]},
    {"name": "Grove City",     "county": "Franklin",   "metro": False, "nearby": ["Hilliard", "Galloway", "Urbancrest", "Columbus"]},
    {"name": "Fairfield",      "county": "Butler",     "metro": False, "nearby": ["Hamilton", "Forest Park", "Springdale", "West Chester"]},
    {"name": "Beavercreek",    "county": "Greene",     "metro": False, "nearby": ["Fairborn", "Kettering", "Xenia", "Bellbrook"]},
    {"name": "Strongsville",   "county": "Cuyahoga",   "metro": False, "nearby": ["Brunswick", "North Royalton", "Berea", "Middleburg Heights"]},
    {"name": "Stow",           "county": "Summit",     "metro": False, "nearby": ["Cuyahoga Falls", "Hudson", "Munroe Falls", "Kent"]},
    {"name": "Barberton",      "county": "Summit",     "metro": False, "nearby": ["Norton", "Akron", "Wadsworth", "Copley"]},
    {"name": "Wooster",        "county": "Wayne",      "metro": False, "nearby": ["Orrville", "Rittman", "Apple Creek", "Smithville"]},
    {"name": "Sandusky",       "county": "Erie",       "metro": False, "nearby": ["Huron", "Perkins", "Castalia", "Bay View"]},
    {"name": "Gahanna",        "county": "Franklin",   "metro": False, "nearby": ["New Albany", "Westerville", "Blacklick", "Columbus"]},
]

# --- Service catalog. Each = a cornerstone page + city pages. Flagship first. ---
SERVICES = [
    {
        "slug": "ai-talking-website", "city_slug": "ai-receptionist",
        "label": "AI Talking Website", "nav": "AI Talking Website", "flagship": True,
        "tagline": "A website that answers your phone 24/7.",
        "city_tier": "all",
        "feature_h": "What you get",
        "bullets": [
            "Answers every call in under one ring, 24/7",
            "Books appointments straight to your calendar",
            "Qualifies leads and texts you a summary of every call",
            "A fast, modern website built to convert",
        ],
        "para2": "Your AI receptionist sounds like a friendly member of your team, works every hour of every day, and never sends a customer to voicemail. Most owners are live in days, not months.",
        "corner_intro": "Most local businesses lose more jobs to the phone than to any competitor. The AI Talking Website is a fast, modern website with an AI receptionist built in—it answers every call day or night, books appointments, and captures every lead, so a missed call never means a missed job.",
        "city_h1": "AI Receptionist in {city}, Ohio",
        "city_intro": "If you run a local business in {city}, every missed call is a job handed to a competitor. Compass Claw gives you an AI receptionist that answers your phone 24/7—booking appointments, answering questions, and capturing every lead, even when you're on a job or closed for the night.",
        "faqs": [
            ("Do you work with businesses in {city}, Ohio?", "Yes—Compass Claw serves {city} and the surrounding {county} County area, including {nearby}."),
            ("Will it sound like a robot?", "No. It uses a natural, friendly voice trained on your business, so {city} callers get real answers—not a phone tree."),
            ("What happens to my current number?", "You keep it. We route calls so the AI answers when you can't—after hours, on a job, or already on the line."),
            ("How fast can I be live in {city}?", "Days, not months. We handle the setup—your website and AI receptionist, configured and ready to take calls."),
        ],
        "variants": [
            {"slug": "ai-receptionist-auto-body", "label": "AI Receptionist for Auto Body Shops", "industry": "auto body shop",
             "h1": "AI Receptionist for Auto Body Shops in {city}, Ohio",
             "intro": "Estimate calls don't wait. When a {city} driver needs collision work, they call shop after shop until someone picks up. Compass Claw answers every call to your auto body shop 24/7, captures the estimate, and books the drop-off."},
            {"slug": "ai-receptionist-home-services", "label": "AI Receptionist for Home Services", "industry": "home services company",
             "h1": "AI Receptionist for Plumbers, HVAC & Roofers in {city}, Ohio",
             "intro": "Burst pipe at 11pm? No-heat call in January? {city} homeowners call until someone answers. Compass Claw makes sure that's you—taking the call, qualifying the emergency, and booking the job around the clock."},
            {"slug": "ai-receptionist-real-estate", "label": "AI Receptionist for Real Estate", "industry": "real estate professional",
             "h1": "AI Receptionist for Real Estate Agents in {city}, Ohio",
             "intro": "A hot buyer who hits your voicemail is calling the next agent before you hear the message. Compass Claw answers and qualifies your {city} leads 24/7, so you never lose a deal to a missed call."},
        ],
    },
    {
        "slug": "website-design", "city_slug": "website-design",
        "label": "Website Design", "nav": "Website Design", "flagship": False,
        "tagline": "Fast, modern websites built to convert—not just look pretty.",
        "city_tier": "metros",
        "feature_h": "What's included",
        "bullets": [
            "Loads fast and looks great on every phone",
            "Built to rank in local Google search",
            "Clear calls-to-action that book real jobs",
            "Optional AI receptionist built right in",
        ],
        "para2": "A website should earn its keep. We design yours around one goal—turning local visitors into booked jobs—then keep it fast and up to date.",
        "corner_intro": "A slow, dated website quietly costs you customers every day. Compass Claw builds fast, mobile-first websites that load instantly, rank in local search, and turn visitors into booked jobs—with an AI receptionist available as a built-in upgrade.",
        "city_h1": "Website Design in {city}, Ohio",
        "city_intro": "A slow or dated website quietly costs you customers in {city} every day. Compass Claw builds fast, mobile-first websites that load instantly, rank locally, and turn {city} visitors into booked jobs.",
        "faqs": [
            ("How long does a new website take?", "Most {city} business sites launch in 1–2 weeks. We handle the build, copy, and setup."),
            ("Will it work on phones?", "Yes—every site is mobile-first and tested to load fast on phones, where most {city} customers will find you."),
            ("Do you handle hosting and updates?", "We can. You get a fast, maintained site without touching code or wrestling with plugins."),
            ("Can it rank on Google?", "Yes. We build with local SEO baked in so {city} customers can actually find you."),
        ],
        "variants": [],
    },
    {
        "slug": "local-seo", "city_slug": "local-seo",
        "label": "Local SEO", "nav": "Local SEO", "flagship": False,
        "tagline": "Get found when customers search 'near me'.",
        "city_tier": "metros",
        "feature_h": "What we do",
        "bullets": [
            "Google Business Profile optimization",
            "Local keyword and 'near me' targeting",
            "Citations, directories, and a review strategy",
            "Location pages that actually rank",
        ],
        "para2": "Local SEO is a compounding asset, not an ad you rent. Done right, it sends you customers month after month without paying per click.",
        "corner_intro": "When someone searches for what you do, you want to be the first name they see. Compass Claw gets your business into Google's local results and the map pack—through Google Business Profile optimization, local content, citations, and reviews—so the right customers find you first.",
        "city_h1": "Local SEO in {city}, Ohio",
        "city_intro": "When someone in {city} searches for what you do, you want to be the first name they see. Compass Claw gets your business ranking in {city} local results and the Google map pack so the right customers find you first.",
        "faqs": [
            ("How long does SEO take to work?", "Local SEO usually shows movement in 2–4 months and compounds from there. It's a long-term asset, not an overnight switch."),
            ("What is the Google map pack?", "It's the top 3 local businesses shown on the map for a search. Ranking there is where most {city} 'near me' clicks go."),
            ("Do reviews matter for ranking?", "A lot. Review count and recency are among the strongest local ranking signals—we build a system to earn them."),
            ("Do you guarantee #1 rankings?", "No honest agency can guarantee a specific rank. We focus on the signals that reliably move you up over time."),
        ],
        "variants": [],
    },
    {
        "slug": "social-media-management", "city_slug": "social-media-management",
        "label": "Social Media & AI Content", "nav": "Social & Content", "flagship": False,
        "tagline": "Stay in the feed without lifting a finger.",
        "city_tier": "metros",
        "feature_h": "What you get",
        "bullets": [
            "Done-for-you posts and short-form videos",
            "AI-generated content—no filming required",
            "On-brand for your business and your town",
            "Consistent posting that builds trust",
        ],
        "para2": "Customers check you out on social before they call. We keep your feed active and credible so you look established—without you spending a minute shooting or editing.",
        "corner_intro": "Customers check you out on social before they ever call. Compass Claw keeps your feed active with done-for-you posts and AI-generated video content—so you look established and stay top of mind, with zero time spent shooting or editing.",
        "city_h1": "Social Media Management in {city}, Ohio",
        "city_intro": "{city} customers check you out on social before they call. Compass Claw keeps your feed active with done-for-you posts and AI-generated video—so you look established and stay top of mind, with zero time shooting or editing.",
        "faqs": [
            ("Do I have to film anything?", "No. Our AI content creates scroll-stopping video without you ever picking up a camera."),
            ("Which platforms do you cover?", "The ones your {city} customers actually use—typically Facebook, Instagram, and TikTok."),
            ("How many posts per month?", "Plans are built around staying consistently visible—usually several posts a week, done for you."),
            ("Can you match my brand?", "Yes. Everything is on-brand for your business and tuned to your local market."),
        ],
        "variants": [],
    },
    {
        "slug": "google-ads", "city_slug": "google-ads",
        "label": "Google Ads Management", "nav": "Google Ads", "flagship": False,
        "tagline": "Show up at the top the day you need leads.",
        "city_tier": "metros",
        "feature_h": "What we manage",
        "bullets": [
            "Local campaigns targeted to your service area",
            "Call-focused ads that drive booked jobs",
            "Landing pages built to convert",
            "Transparent reporting—no jargon",
        ],
        "para2": "SEO is the long game; ads turn on leads now. We run lean, call-focused campaigns so your budget buys booked jobs, not clicks that go nowhere.",
        "corner_intro": "SEO is the long game; Google Ads turns on leads now. Compass Claw builds and manages local ad campaigns that put your business at the top of search for the exact services you want more of—paired with landing pages built to convert.",
        "city_h1": "Google Ads Management in {city}, Ohio",
        "city_intro": "SEO is the long game; Google Ads turns on leads now. Compass Claw builds and manages local campaigns that put your {city} business at the top of search for the exact services you want more of.",
        "faqs": [
            ("How much should I budget for ads?", "We start lean and scale what works. Most local {city} businesses begin with a modest test budget plus management."),
            ("How fast do ads bring leads?", "Ads can drive calls within days of launch—unlike SEO, which builds over months. Many clients run both."),
            ("Do you charge a management fee?", "Yes—a transparent flat fee. You always know what goes to ads versus management."),
            ("Can ads and SEO work together?", "That's the ideal combo: ads for leads today, SEO for free leads tomorrow."),
        ],
        "variants": [],
    },
]


def city_slug(name): return name.lower().replace(" ", "-")

def nearby_phrase(n):
    return ", ".join(n[:-1]) + " and " + n[-1] if len(n) > 1 else n[0]

def bullets_html(bullets):
    return "\n            ".join(f"<li>{html.escape(b)}</li>" for b in bullets)

CHEV = ('<span class="chev" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" '
        'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
        '<polyline points="6 9 12 15 18 9"/></svg></span>')

def faq_html(faqs, ctx):
    out = []
    for q, a in faqs:
        out.append(f'<div class="faq-item glass"><button class="faq-q" aria-expanded="false">'
                   f'{html.escape(q.format(**ctx))}{CHEV}</button>'
                   f'<div class="faq-a"><div class="faq-a-inner">{html.escape(a.format(**ctx))}</div></div></div>')
    return "\n          ".join(out)


def footer_links_html():
    svc = "\n          ".join(
        f'<li><a href="/services/{s["slug"]}/">{html.escape(s["label"])}</a></li>' for s in SERVICES)
    metros = [c for c in CITIES if c["metro"]]
    area = "\n          ".join(
        f'<li><a href="/ai-receptionist/{city_slug(c["name"])}-oh/">{html.escape(c["name"])}, OH</a></li>'
        for c in metros)
    return (f'<div class="footer-links">\n'
            f'  <div><h4>Services</h4><ul>\n          {svc}\n        </ul></div>\n'
            f'  <div><h4>Popular Ohio areas</h4><ul>\n          {area}\n        </ul>'
            f'<p class="footer-links-more"><a href="/locations/">All Ohio service areas →</a></p></div>\n'
            f'</div>')


def header_html():
    return f'''<header class="site-header" id="top">
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Compass Claw home">
        <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9 16.2 7.8" fill="currentColor" stroke="none"></polygon></svg></span>
        <span class="brand-name">Compass<span class="brand-accent">Claw</span></span>
      </a>
      <nav class="header-nav">
        <a href="/services/">Services</a>
        <a href="/locations/">Service Areas</a>
      </nav>
      <nav class="header-actions">
        <a href="tel:{BIZ['phone_e164']}" class="header-phone"><span>{BIZ['phone_display']}</span></a>
        <a href="/#calculator" class="btn btn-primary btn-sm header-cta">Get a Free Demo</a>
      </nav>
    </div>
  </header>'''


def footer_html(extra_line=""):
    return f'''<footer class="site-footer">
    <div class="container">{footer_links_html()}</div>
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="brand-name">Compass<span class="brand-accent">Claw</span></span>
        <p>The AI Talking Website that answers every call for local business.</p>
        <p class="footer-nap">{BIZ['street']}, {BIZ['locality']}, {BIZ['region']} {BIZ['postal']} &middot; Open 24/7</p>
      </div>
      <div class="footer-contact">
        <a href="tel:{BIZ['phone_e164']}" class="footer-phone">\U0001F4DE {BIZ['phone_display']}</a>
        <a href="/#calculator" class="btn btn-primary btn-sm">Get a Free Demo</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; <span id="year"></span> Compass Claw &middot; {BIZ['locality']}, OH</span>
      <span>{extra_line}</span>
    </div>
  </footer>'''


HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{meta_desc}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{meta_desc}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
{schema}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="bg-void" aria-hidden="true"></div>
  <div class="bg-grid" aria-hidden="true"></div>
'''


def city_page(service, city, variant):
    cs = city_slug(city["name"])
    slug = variant["slug"] if variant else service["city_slug"]
    label = variant["label"] if variant else service["label"]
    canonical = f"{SITE}/{slug}/{cs}-oh/"
    nearby = nearby_phrase(city["nearby"])
    h1 = (variant["h1"] if variant else service["city_h1"]).format(city=city["name"])
    intro = (variant["intro"] if variant else service["city_intro"]).format(city=city["name"])
    sub = f'{service["tagline"]} Serving {city["name"]}, Ohio and {city["county"]} County, 24/7.'
    meta_desc = f'{label} in {city["name"]}, OH. {service["tagline"]} Free demo for {city["name"]} businesses from Compass Claw.'
    ctx = {"city": city["name"], "county": city["county"], "nearby": nearby}

    faqs = service["faqs"]
    faq_entities = [{"@type": "Question", "name": q.format(**ctx),
                     "acceptedAnswer": {"@type": "Answer", "text": a.format(**ctx)}} for q, a in faqs]
    schema = json.dumps({"@context": "https://schema.org", "@graph": [
        {"@type": "LocalBusiness", "@id": canonical + "#biz",
         "name": f'{BIZ["name"]} — {label} ({city["name"]}, OH)', "url": canonical,
         "telephone": BIZ["phone_e164"], "priceRange": "$$",
         "address": {"@type": "PostalAddress", "streetAddress": BIZ["street"], "addressLocality": BIZ["locality"],
                     "addressRegion": BIZ["region"], "postalCode": BIZ["postal"], "addressCountry": "US"},
         "geo": {"@type": "GeoCoordinates", "latitude": BIZ["lat"], "longitude": BIZ["lon"]},
         "openingHoursSpecification": {"@type": "OpeningHoursSpecification",
             "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
             "opens": "00:00", "closes": "23:59"},
         "areaServed": [{"@type": "City", "name": city["name"]}] + [{"@type": "City", "name": n} for n in city["nearby"]],
         "sameAs": [BIZ["gbp"]], "description": meta_desc},
        {"@type": "Service", "name": f'{label} in {city["name"]}, Ohio',
         "provider": {"@id": SITE + "/#org"}, "areaServed": {"@type": "City", "name": city["name"]},
         "description": intro},
        {"@type": "FAQPage", "mainEntity": faq_entities},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": label, "item": f'{SITE}/services/{service["slug"]}/'},
            {"@type": "ListItem", "position": 3, "name": f'{city["name"]}, OH', "item": canonical}]},
    ]}, indent=2)

    body = f'''  {header_html()}
  <main>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/services/{service["slug"]}/">{html.escape(label)}</a> / <span>{html.escape(city["name"])}, OH</span></nav>
    </div>
    <section class="loc-hero">
      <div class="container">
        <span class="eyebrow"><span class="live-dot"></span> Serving {html.escape(city["name"])} &amp; {html.escape(city["county"])} County</span>
        <h1>{html.escape(h1)}<br /><span class="gradient-text">{html.escape(service["tagline"])}</span></h1>
        <p class="loc-sub">{html.escape(sub)}</p>
        <a href="/#calculator" class="btn btn-primary btn-lg">See what missed calls cost you →</a>
      </div>
    </section>
    <section class="section">
      <div class="container loc-prose">
        <p>{html.escape(intro)}</p>
        <p>{html.escape(service["para2"])}</p>
        <div class="feature" style="margin-top:32px;">
          <span class="feature-badge"><span class="live-dot"></span> {html.escape(label)}</span>
          <h3>{html.escape(service["feature_h"])} for {html.escape(city["name"])} businesses</h3>
          <ul class="feature-list">
            {bullets_html(service["bullets"])}
          </ul>
        </div>
        <p class="loc-nearby">Proudly serving {html.escape(city["name"])} and nearby {html.escape(nearby)} across {html.escape(city["county"])} County, Ohio.</p>
      </div>
    </section>
    <section class="section" id="faq">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Questions</span><h2>{html.escape(city["name"])} owners ask us</h2></div>
        <div class="faq-wrap">
          {faq_html(faqs, ctx)}
        </div>
      </div>
    </section>
    <section class="section final-cta">
      <div class="container">
        <div class="final-card glass">
          <h2>Stop letting the phone cost you jobs in {html.escape(city["name"])}.</h2>
          <p>See exactly how much you're losing to missed calls—and get a free AI demo built for your {html.escape(city["name"])} business.</p>
          <div class="final-actions">
            <a href="/#calculator" class="btn btn-primary btn-lg">Get my free demo</a>
            <a href="tel:{BIZ["phone_e164"]}" class="btn btn-glass btn-lg">Or call {BIZ["phone_display"]}</a>
          </div>
        </div>
      </div>
    </section>
  </main>
  {footer_html(f"Serving {html.escape(city['name'])}, Ohio and the surrounding area.")}
  <script src="/script.js" defer></script>
</body>
</html>
'''
    page = HEAD.format(title=f"{h1} | Compass Claw", meta_desc=meta_desc, canonical=canonical, schema=schema) + body
    out_dir = os.path.join(ROOT, slug, f"{cs}-oh")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    return canonical


def service_page(service):
    canonical = f'{SITE}/services/{service["slug"]}/'
    label = service["label"]
    meta_desc = f'{label} for Ohio local businesses. {service["tagline"]} Compass Claw, Portsmouth OH.'
    faqs = service["faqs"]
    ctx = {"city": "Ohio", "county": "your", "nearby": "your area"}
    faq_entities = [{"@type": "Question", "name": q.format(**ctx),
                     "acceptedAnswer": {"@type": "Answer", "text": a.format(**ctx)}} for q, a in faqs]
    schema = json.dumps({"@context": "https://schema.org", "@graph": [
        {"@type": "Service", "name": label, "provider": {"@id": SITE + "/#org"},
         "areaServed": {"@type": "State", "name": "Ohio"}, "url": canonical,
         "description": service["corner_intro"]},
        {"@type": "FAQPage", "mainEntity": faq_entities},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Services", "item": SITE + "/services/"},
            {"@type": "ListItem", "position": 3, "name": label, "item": canonical}]},
    ]}, indent=2)

    metros = [c for c in CITIES if c["metro"]] if service["city_tier"] == "metros" else CITIES
    city_links = "\n          ".join(
        f'<li><a href="/{service["city_slug"]}/{city_slug(c["name"])}-oh/">{html.escape(label)} in {html.escape(c["name"])}, OH</a></li>'
        for c in metros)

    body = f'''  {header_html()}
  <main>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/services/">Services</a> / <span>{html.escape(label)}</span></nav>
    </div>
    <section class="loc-hero">
      <div class="container">
        <span class="eyebrow"><span class="live-dot"></span> {"Flagship offer" if service["flagship"] else "Service"}</span>
        <h1>{html.escape(label)}<br /><span class="gradient-text">{html.escape(service["tagline"])}</span></h1>
        <p class="loc-sub">For local businesses across Ohio. Done-for-you, no jargon, built to bring you more jobs.</p>
        <a href="/#calculator" class="btn btn-primary btn-lg">Get a free demo →</a>
      </div>
    </section>
    <section class="section">
      <div class="container loc-prose">
        <p>{html.escape(service["corner_intro"])}</p>
        <p>{html.escape(service["para2"])}</p>
        <div class="feature" style="margin-top:32px;">
          <span class="feature-badge"><span class="live-dot"></span> {html.escape(label)}</span>
          <h3>{html.escape(service["feature_h"])}</h3>
          <ul class="feature-list">
            {bullets_html(service["bullets"])}
          </ul>
        </div>
      </div>
    </section>
    <section class="section" id="faq">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Questions</span><h2>Common questions</h2></div>
        <div class="faq-wrap">
          {faq_html(faqs, ctx)}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container loc-prose">
        <h2>{html.escape(label)} across Ohio</h2>
        <ul class="loc-list">
          {city_links}
        </ul>
      </div>
    </section>
    <section class="section final-cta">
      <div class="container">
        <div class="final-card glass">
          <h2>Ready to bring in more jobs?</h2>
          <p>See how much you're leaving on the table—and get a free demo built for your business.</p>
          <div class="final-actions">
            <a href="/#calculator" class="btn btn-primary btn-lg">Get my free demo</a>
            <a href="tel:{BIZ["phone_e164"]}" class="btn btn-glass btn-lg">Or call {BIZ["phone_display"]}</a>
          </div>
        </div>
      </div>
    </section>
  </main>
  {footer_html("Done-for-you growth for Ohio local business.")}
  <script src="/script.js" defer></script>
</body>
</html>
'''
    page = HEAD.format(title=f"{label} in Ohio | Compass Claw", meta_desc=meta_desc, canonical=canonical, schema=schema) + body
    out_dir = os.path.join(ROOT, "services", service["slug"])
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    return canonical


def services_hub():
    canonical = f"{SITE}/services/"
    cards = "\n        ".join(
        f'''<a class="svc-card glass" href="/services/{s["slug"]}/">
          <span class="svc-tag">{"Flagship" if s["flagship"] else "Service"}</span>
          <h3>{html.escape(s["label"])}</h3>
          <p>{html.escape(s["tagline"])}</p>
          <span class="svc-go">Learn more →</span>
        </a>''' for s in SERVICES)
    schema = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Services", "item": canonical}]}, indent=2)
    body = f'''  {header_html()}
  <main>
    <div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Services</span></nav></div>
    <section class="loc-hero">
      <div class="container">
        <span class="eyebrow"><span class="live-dot"></span> Full-service, done for you</span>
        <h1>Everything your business needs to <span class="gradient-text">win more jobs.</span></h1>
        <p class="loc-sub">Start with the AI Talking Website, add what you need as you grow. One team, no extra vendors.</p>
        <a href="/#calculator" class="btn btn-primary btn-lg">Get a free demo →</a>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="svc-grid">
        {cards}
        </div>
      </div>
    </section>
  </main>
  {footer_html("One team for everything local businesses need to grow.")}
  <script src="/script.js" defer></script>
</body>
</html>
'''
    page = HEAD.format(title="Services | Compass Claw — Ohio AI & Marketing for Local Business",
                       meta_desc="Full-service growth for Ohio local businesses: AI Talking Website, website design, local SEO, social media & AI content, and Google Ads.",
                       canonical=canonical, schema=schema) + body
    out_dir = os.path.join(ROOT, "services")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    return canonical


LOCATIONS_HEAD = HEAD  # reuse


def locations_hub(pages):
    canonical = f"{SITE}/locations/"
    by_label = {}
    for label, city, url in pages:
        by_label.setdefault(label, []).append((city, url))
    groups = []
    order = [s["label"] for s in SERVICES] + [v["label"] for s in SERVICES for v in s["variants"]]
    for label in order:
        if label not in by_label:
            continue
        links = "\n          ".join(
            f'<li><a href="{url}">{html.escape(label)} in {html.escape(city)}, OH</a></li>'
            for city, url in sorted(by_label[label]))
        groups.append(f'<h2>{html.escape(label)}</h2>\n        <ul class="loc-list">\n          {links}\n        </ul>')
    schema = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Service Areas", "item": canonical}]}, indent=2)
    body = f'''  {header_html()}
  <main>
    <div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Service Areas</span></nav></div>
    <section class="loc-hero">
      <div class="container">
        <span class="eyebrow"><span class="live-dot"></span> Ohio Service Areas</span>
        <h1>Serving <span class="gradient-text">local businesses across Ohio.</span></h1>
        <p class="loc-sub">We answer the phones and bring in jobs for businesses statewide, 24/7. Find your city below.</p>
      </div>
    </section>
    <section class="section">
      <div class="container loc-prose">
        {"".join(g + chr(10) + "        " for g in groups)}
      </div>
    </section>
  </main>
  {footer_html("AI receptionists and marketing for Ohio local business.")}
  <script src="/script.js" defer></script>
</body>
</html>
'''
    page = LOCATIONS_HEAD.format(title="Ohio Service Areas | Compass Claw",
                                 meta_desc="Compass Claw serves local businesses across Ohio with 24/7 AI receptionists, websites, and marketing. Find your city.",
                                 canonical=canonical, schema=schema) + body
    out_dir = os.path.join(ROOT, "locations")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    return canonical


def write_sitemap(urls):
    seen, ordered = set(), []
    for u in [SITE + "/", SITE + "/services/", SITE + "/locations/"] + urls:
        if u not in seen:
            seen.add(u); ordered.append(u)
    items = "\n".join(f"  <url>\n    <loc>{u}</loc>\n    <changefreq>weekly</changefreq>\n  </url>" for u in ordered)
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + items + "\n</urlset>\n")


def write_llms():
    lines = ["# Compass Claw",
             "", f"> {SERVICES[0]['corner_intro']}", "",
             f"Compass Claw is a local business growth agency in {BIZ['locality']}, Ohio, serving businesses across Ohio. "
             f"Address: {BIZ['street']}, {BIZ['locality']}, {BIZ['region']} {BIZ['postal']}. Phone: {BIZ['phone_display']}. Open 24/7.",
             "", "## Services"]
    for s in SERVICES:
        lines.append(f"- [{s['label']}]({SITE}/services/{s['slug']}/): {s['tagline']}")
    lines += ["", "## Key pages",
              f"- [Home]({SITE}/): AI Talking Website + free missed-revenue calculator",
              f"- [Services]({SITE}/services/)",
              f"- [Ohio service areas]({SITE}/locations/)", ""]
    with open(os.path.join(ROOT, "llms.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1].lower()
    urls, pages = [], []
    for service in SERVICES:
        if not only:
            urls.append(service_page(service))
        tier_cities = [c for c in CITIES if c["metro"]] if service["city_tier"] == "metros" else CITIES
        for city in tier_cities:
            if only and city_slug(city["name"]) != only:
                continue
            urls.append(city_page(service, city, None)); pages.append((service["label"], city["name"], urls[-1]))
            for variant in service["variants"]:
                if not city["metro"]:
                    continue
                urls.append(city_page(service, city, variant)); pages.append((variant["label"], city["name"], urls[-1]))
    if not only:
        urls.append(services_hub())
        urls.append(locations_hub(pages))
        write_sitemap(urls)
        write_llms()
    print(f"Generated {len(urls)} page(s)" + ("" if only else " + hubs, sitemap, llms.txt"))


if __name__ == "__main__":
    main()
