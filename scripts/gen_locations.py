#!/usr/bin/env python3
"""
Compass Claw — Ohio location page generator.

Stamps out localized {service}/{city}-oh/ landing pages from one template plus
the CITIES and OFFERINGS data below, and regenerates sitemap.xml.

Goal: a FOCUSED set of genuinely useful pages (not thin doorway clones). Each
page gets city-specific copy (nearby towns, county) and per-industry framing.

Usage:
    python scripts/gen_locations.py            # generate everything
    python scripts/gen_locations.py --only columbus   # one city (sample)
"""
import os, sys, html, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://compassclaw.com"

# --- Business identity (real NAP) ---
BIZ = {
    "name": "Compass Claw",
    "phone_display": "(740) 831-3443",
    "phone_e164": "+1-740-831-3443",
    "street": "420 Second Street",
    "locality": "Portsmouth",
    "region": "OH",
    "postal": "45662",
    "lat": 38.7317,
    "lon": -82.9977,
    "gbp": "https://share.google/C8sZa1rz0fuIAz4Ll",
}

# --- Ohio cities. metro=True cities also get the industry-specific variants.
#     nearby/county are real for local relevance. ---
CITIES = [
    {"name": "Portsmouth",       "county": "Scioto",     "metro": True,  "nearby": ["Wheelersburg", "New Boston", "Lucasville", "South Webster"]},
    {"name": "Columbus",         "county": "Franklin",   "metro": True,  "nearby": ["Dublin", "Westerville", "Hilliard", "Grove City"]},
    {"name": "Cleveland",        "county": "Cuyahoga",   "metro": True,  "nearby": ["Parma", "Lakewood", "Euclid", "Strongsville"]},
    {"name": "Cincinnati",       "county": "Hamilton",   "metro": True,  "nearby": ["Norwood", "Mason", "West Chester", "Blue Ash"]},
    {"name": "Dayton",           "county": "Montgomery", "metro": True,  "nearby": ["Kettering", "Beavercreek", "Huber Heights", "Centerville"]},
    {"name": "Toledo",           "county": "Lucas",      "metro": True,  "nearby": ["Sylvania", "Maumee", "Perrysburg", "Oregon"]},
    {"name": "Akron",            "county": "Summit",     "metro": True,  "nearby": ["Cuyahoga Falls", "Stow", "Barberton", "Tallmadge"]},
    {"name": "Canton",           "county": "Stark",      "metro": True,  "nearby": ["Massillon", "North Canton", "Alliance", "Louisville"]},
    {"name": "Youngstown",       "county": "Mahoning",   "metro": True,  "nearby": ["Boardman", "Austintown", "Canfield", "Struthers"]},
    {"name": "Springfield",      "county": "Clark",      "metro": True,  "nearby": ["Enon", "New Carlisle", "Northridge", "Springfield Township"]},
    {"name": "Hamilton",         "county": "Butler",     "metro": True,  "nearby": ["Fairfield", "Middletown", "Oxford", "Trenton"]},
    {"name": "Chillicothe",      "county": "Ross",       "metro": True,  "nearby": ["Waverly", "Frankfort", "Bainbridge", "Kingston"]},

    {"name": "Lorain",           "county": "Lorain",     "metro": False, "nearby": ["Elyria", "Sheffield Lake", "Amherst", "Avon"]},
    {"name": "Elyria",           "county": "Lorain",     "metro": False, "nearby": ["Lorain", "Avon", "North Ridgeville", "Grafton"]},
    {"name": "Middletown",       "county": "Butler",     "metro": False, "nearby": ["Franklin", "Trenton", "Monroe", "Hamilton"]},
    {"name": "Newark",           "county": "Licking",    "metro": False, "nearby": ["Heath", "Granville", "Pataskala", "Buckeye Lake"]},
    {"name": "Mansfield",        "county": "Richland",   "metro": False, "nearby": ["Ontario", "Lexington", "Shelby", "Bellville"]},
    {"name": "Mentor",           "county": "Lake",       "metro": False, "nearby": ["Willoughby", "Painesville", "Eastlake", "Kirtland"]},
    {"name": "Findlay",          "county": "Hancock",    "metro": False, "nearby": ["Fostoria", "Arlington", "Carey", "McComb"]},
    {"name": "Warren",           "county": "Trumbull",   "metro": False, "nearby": ["Niles", "Cortland", "Howland", "Champion"]},
    {"name": "Lancaster",        "county": "Fairfield",  "metro": False, "nearby": ["Pickerington", "Baltimore", "Carroll", "Sugar Grove"]},
    {"name": "Lima",             "county": "Allen",      "metro": False, "nearby": ["Elida", "Bath", "Shawnee", "Delphos"]},
    {"name": "Marion",           "county": "Marion",     "metro": False, "nearby": ["Prospect", "Caledonia", "LaRue", "Marion Township"]},
    {"name": "Delaware",         "county": "Delaware",   "metro": False, "nearby": ["Powell", "Sunbury", "Lewis Center", "Galena"]},
    {"name": "Zanesville",       "county": "Muskingum",  "metro": False, "nearby": ["New Concord", "Roseville", "South Zanesville", "Dresden"]},
    {"name": "Athens",           "county": "Athens",     "metro": False, "nearby": ["Nelsonville", "The Plains", "Albany", "Glouster"]},
    {"name": "Brunswick",        "county": "Medina",     "metro": False, "nearby": ["Medina", "Strongsville", "Hinckley", "Valley City"]},
    {"name": "Parma",            "county": "Cuyahoga",   "metro": False, "nearby": ["Brooklyn", "Seven Hills", "Parma Heights", "Independence"]},
    {"name": "Kettering",        "county": "Montgomery", "metro": False, "nearby": ["Centerville", "Oakwood", "Beavercreek", "Moraine"]},
    {"name": "Cuyahoga Falls",   "county": "Summit",     "metro": False, "nearby": ["Stow", "Munroe Falls", "Tallmadge", "Hudson"]},
    {"name": "Dublin",           "county": "Franklin",   "metro": False, "nearby": ["Hilliard", "Powell", "Worthington", "Upper Arlington"]},
    {"name": "Westerville",      "county": "Franklin",   "metro": False, "nearby": ["Gahanna", "Worthington", "New Albany", "Blacklick"]},
    {"name": "Reynoldsburg",     "county": "Franklin",   "metro": False, "nearby": ["Pickerington", "Pataskala", "Blacklick", "Whitehall"]},
    {"name": "Grove City",       "county": "Franklin",   "metro": False, "nearby": ["Hilliard", "Galloway", "Urbancrest", "Columbus"]},
    {"name": "Fairfield",        "county": "Butler",     "metro": False, "nearby": ["Hamilton", "Forest Park", "Springdale", "West Chester"]},
    {"name": "Beavercreek",      "county": "Greene",     "metro": False, "nearby": ["Fairborn", "Kettering", "Xenia", "Bellbrook"]},
    {"name": "Strongsville",     "county": "Cuyahoga",   "metro": False, "nearby": ["Brunswick", "North Royalton", "Berea", "Middleburg Heights"]},
    {"name": "Stow",             "county": "Summit",     "metro": False, "nearby": ["Cuyahoga Falls", "Hudson", "Munroe Falls", "Kent"]},
    {"name": "Barberton",        "county": "Summit",     "metro": False, "nearby": ["Norton", "Akron", "Wadsworth", "Copley"]},
    {"name": "Wooster",          "county": "Wayne",      "metro": False, "nearby": ["Orrville", "Rittman", "Apple Creek", "Smithville"]},
    {"name": "Sandusky",         "county": "Erie",       "metro": False, "nearby": ["Huron", "Perkins", "Castalia", "Bay View"]},
    {"name": "Gahanna",          "county": "Franklin",   "metro": False, "nearby": ["New Albany", "Westerville", "Blacklick", "Columbus"]},
]

# --- Offerings. metros_only=True restricts to metro cities (keeps the set focused). ---
OFFERINGS = [
    {
        "slug": "ai-receptionist",
        "label": "AI Receptionist",
        "industry": None,
        "metros_only": False,
        "h1": "AI Receptionist in {city}, Ohio",
        "intro": "If you run a local business in {city}, every missed call is a job handed to a competitor. Compass Claw gives you an AI receptionist that answers your phone 24/7—booking appointments, answering questions, and capturing every lead, even when you're on a job or closed for the night.",
    },
    {
        "slug": "ai-receptionist-auto-body",
        "label": "AI Receptionist for Auto Body Shops",
        "industry": "auto body shop",
        "metros_only": True,
        "h1": "AI Receptionist for Auto Body Shops in {city}, Ohio",
        "intro": "Estimate calls don't wait. When a {city} driver needs collision work, they call shop after shop until someone picks up. Compass Claw answers every call to your auto body shop 24/7, captures the estimate, and books the drop-off—so you stop losing jobs to voicemail.",
    },
    {
        "slug": "ai-receptionist-home-services",
        "label": "AI Receptionist for Home Services",
        "industry": "home services company",
        "metros_only": True,
        "h1": "AI Receptionist for Plumbers, HVAC & Roofers in {city}, Ohio",
        "intro": "Burst pipe at 11pm? No-heat call in January? {city} homeowners call until someone answers. Compass Claw makes sure that's you—your AI receptionist takes the call, qualifies the emergency, and books the job around the clock.",
    },
    {
        "slug": "ai-receptionist-real-estate",
        "label": "AI Receptionist for Real Estate",
        "industry": "real estate professional",
        "metros_only": True,
        "h1": "AI Receptionist for Real Estate Agents in {city}, Ohio",
        "intro": "A hot buyer who hits your voicemail is calling the next agent before you hear the message. Compass Claw answers and qualifies your {city} leads 24/7, so you never lose a deal to a missed call again.",
    },
]


def city_slug(name):
    return name.lower().replace(" ", "-")


def nearby_phrase(nearby):
    if len(nearby) > 1:
        return ", ".join(nearby[:-1]) + " and " + nearby[-1]
    return nearby[0]


PAGE = """<!DOCTYPE html>
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

  <header class="site-header" id="top">
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Compass Claw home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9 16.2 7.8" fill="currentColor" stroke="none"></polygon></svg>
        </span>
        <span class="brand-name">Compass<span class="brand-accent">Claw</span></span>
      </a>
      <nav class="header-actions">
        <a href="tel:{phone_e164}" class="header-phone" aria-label="Call us">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>{phone_display}</span>
        </a>
        <a href="/#calculator" class="btn btn-primary btn-sm header-cta">Get a Free Demo</a>
      </nav>
    </div>
  </header>

  <main>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/{slug}/">{label}</a> / <span>{city}, OH</span>
      </nav>
    </div>

    <section class="loc-hero">
      <div class="container">
        <span class="eyebrow"><span class="live-dot"></span> Serving {city} &amp; {county} County</span>
        <h1>{h1}<br /><span class="gradient-text">Never Miss Another Call.</span></h1>
        <p class="loc-sub">{sub}</p>
        <a href="/#calculator" class="btn btn-primary btn-lg">See what missed calls cost you →</a>
      </div>
    </section>

    <section class="section">
      <div class="container loc-prose">
        <p>{intro}</p>
        <p>Your AI receptionist picks up in under one ring—day or night, weekends and holidays. It sounds like a friendly member of your team, answers your most common questions, and books jobs straight onto your calendar. You get a text summary after every call. No voicemail, no phone tree, no missed revenue.</p>
        <div class="feature" style="margin-top:32px;">
          <span class="feature-badge"><span class="live-dot"></span> The AI Talking Website</span>
          <h3>What {city_short} businesses get</h3>
          <ul class="feature-list">
            <li>A 24/7 AI receptionist that answers every call in under one ring</li>
            <li>Appointments booked straight to your calendar</li>
            <li>Lead qualification + a text summary of every call</li>
            <li>A fast, modern website built to convert {city_short} customers</li>
          </ul>
        </div>
        <p class="loc-nearby">Proudly serving {city} and nearby {nearby} across {county} County, Ohio.</p>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Questions</span><h2>{city} owners ask us</h2></div>
        <div class="faq-wrap" id="faq">
          {faq_html}
        </div>
      </div>
    </section>

    <section class="section final-cta">
      <div class="container">
        <div class="final-card glass">
          <h2>Stop letting the phone cost you jobs in {city}.</h2>
          <p>See exactly how much you're losing to missed calls—and get a free AI demo built for your {city} business.</p>
          <div class="final-actions">
            <a href="/#calculator" class="btn btn-primary btn-lg">Get my free demo</a>
            <a href="tel:{phone_e164}" class="btn btn-glass btn-lg">Or call {phone_display}</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="brand-name">Compass<span class="brand-accent">Claw</span></span>
        <p>The AI Talking Website that answers every call for local business.</p>
      </div>
      <div class="footer-contact">
        <a href="tel:{phone_e164}" class="footer-phone">\U0001F4DE {phone_display}</a>
        <a href="/">Back to home</a>
        <a href="/#calculator" class="btn btn-primary btn-sm">Get a Free Demo</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; <span id="year"></span> Compass Claw. All rights reserved.</span>
      <span>Serving {city}, Ohio and the surrounding area.</span>
    </div>
  </footer>
  <script src="/script.js" defer></script>
</body>
</html>
"""

FAQS = [
    ("Do you work with businesses in {city}, Ohio?",
     "Yes—Compass Claw serves {city} and the surrounding {county} County area, including {nearby}. Your AI receptionist is configured for your business and your local customers."),
    ("Will it sound like a robot?",
     "No. It uses a natural, friendly voice trained on your business, so {city} callers get real answers—not a phone tree. Most people don't realize it's AI."),
    ("What happens to my current number?",
     "You keep it. We route calls so the AI answers when you can't—after hours, on a job, or already on the line—so you never miss a lead."),
    ("How fast can I be live in {city}?",
     "Days, not months. We handle the setup—your website and AI receptionist, configured and ready to take calls."),
]


def build_faq_html(ctx):
    chev = ('<span class="chev" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" '
            'fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" '
            'stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>')
    blocks = []
    for q, a in FAQS:
        q2 = html.escape(q.format(**ctx)); a2 = html.escape(a.format(**ctx))
        blocks.append(
            f'<div class="faq-item glass"><button class="faq-q" aria-expanded="false">{q2}{chev}</button>'
            f'<div class="faq-a"><div class="faq-a-inner">{a2}</div></div></div>'
        )
    return "\n          ".join(blocks)


def build_schema(ctx, off):
    canonical = ctx["canonical"]
    faq_entities = [
        {"@type": "Question", "name": q.format(**ctx),
         "acceptedAnswer": {"@type": "Answer", "text": a.format(**ctx)}}
        for q, a in FAQS
    ]
    graph = [
        {
            "@type": "LocalBusiness", "@id": canonical + "#biz",
            "name": f'{BIZ["name"]} — {off["label"]} ({ctx["city"]}, OH)',
            "url": canonical,
            "telephone": BIZ["phone_e164"],
            "priceRange": "$$",
            "address": {"@type": "PostalAddress", "streetAddress": BIZ["street"],
                        "addressLocality": BIZ["locality"], "addressRegion": BIZ["region"],
                        "postalCode": BIZ["postal"], "addressCountry": "US"},
            "geo": {"@type": "GeoCoordinates", "latitude": BIZ["lat"], "longitude": BIZ["lon"]},
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00", "closes": "23:59",
            },
            "areaServed": [{"@type": "City", "name": ctx["city"]}] +
                          [{"@type": "City", "name": n} for n in ctx["nearby_list"]],
            "sameAs": [BIZ["gbp"]],
            "description": ctx["meta_desc"],
        },
        {"@type": "Service", "name": f'{off["label"]} in {ctx["city"]}, Ohio',
         "provider": {"@id": canonical + "#biz"},
         "areaServed": {"@type": "City", "name": ctx["city"]},
         "description": ctx["intro"]},
        {"@type": "FAQPage", "mainEntity": faq_entities},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": off["label"], "item": f'{SITE}/{off["slug"]}/'},
            {"@type": "ListItem", "position": 3, "name": f'{ctx["city"]}, OH', "item": canonical},
        ]},
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=2)


def render(city, off):
    cs = city_slug(city["name"])
    canonical = f'{SITE}/{off["slug"]}/{cs}-oh/'
    nearby = nearby_phrase(city["nearby"])
    h1 = off["h1"].format(city=city["name"])
    intro = off["intro"].format(city=city["name"])
    sub = (f'24/7 AI voice receptionist for {off["industry"] or "local"} businesses in '
           f'{city["name"]}, Ohio. Book more jobs, answer every call, and stop losing leads to voicemail.')
    meta_desc = (f'{off["label"]} in {city["name"]}, OH. A 24/7 AI-powered website that answers your '
                 f'phone, books appointments, and captures every lead. Free demo for {city["name"]} businesses.')
    ctx = {
        "title": f'{h1} | Compass Claw',
        "meta_desc": meta_desc, "canonical": canonical, "slug": off["slug"], "label": off["label"],
        "city": city["name"], "city_short": city["name"], "county": city["county"],
        "nearby": nearby, "nearby_list": city["nearby"], "h1": h1, "sub": sub, "intro": intro,
        "phone_display": BIZ["phone_display"], "phone_e164": BIZ["phone_e164"],
    }
    page = PAGE.format(
        faq_html=build_faq_html(ctx), schema=build_schema(ctx, off), **ctx
    )
    out_dir = os.path.join(ROOT, off["slug"], f"{cs}-oh")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    return canonical


def write_sitemap(urls):
    items = "\n".join(
        f"  <url>\n    <loc>{u}</loc>\n    <changefreq>weekly</changefreq>\n  </url>"
        for u in urls
    )
    body = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f'  <url>\n    <loc>{SITE}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n'
            f'{items}\n</urlset>\n')
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(body)


LOCATIONS_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ohio Service Areas | Compass Claw AI Receptionist</title>
  <meta name="description" content="Compass Claw provides 24/7 AI receptionists and AI Talking Websites to local businesses across Ohio. Find your city." />
  <link rel="canonical" href="{site}/locations/" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="bg-void" aria-hidden="true"></div>
  <div class="bg-grid" aria-hidden="true"></div>
  <header class="site-header" id="top">
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Compass Claw home">
        <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9 16.2 7.8" fill="currentColor" stroke="none"></polygon></svg></span>
        <span class="brand-name">Compass<span class="brand-accent">Claw</span></span>
      </a>
      <nav class="header-actions">
        <a href="tel:{phone_e164}" class="header-phone"><span>{phone_display}</span></a>
        <a href="/#calculator" class="btn btn-primary btn-sm header-cta">Get a Free Demo</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="loc-hero">
      <div class="container">
        <span class="eyebrow"><span class="live-dot"></span> Ohio Service Areas</span>
        <h1>AI Receptionists for <span class="gradient-text">Ohio Businesses</span></h1>
        <p class="loc-sub">We answer the phones for local businesses across the state, 24/7. Find your city below.</p>
      </div>
    </section>
    <section class="section">
      <div class="container loc-prose">
        {groups}
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="container footer-bottom">
      <span>&copy; <span id="year"></span> Compass Claw &middot; {street}, {locality}, {region} {postal} &middot; {phone_display}</span>
      <span><a href="/">Home</a></span>
    </div>
  </footer>
  <script src="/script.js" defer></script>
</body>
</html>
"""


def write_locations_index(pages):
    """pages: list of (offering_label, city_name, url)"""
    by_off = {}
    for label, city, url in pages:
        by_off.setdefault(label, []).append((city, url))
    groups = []
    for label in [o["label"] for o in OFFERINGS]:
        if label not in by_off:
            continue
        links = "\n          ".join(
            f'<li><a href="{url}">{html.escape(label)} in {html.escape(city)}, OH</a></li>'
            for city, url in sorted(by_off[label])
        )
        groups.append(f'<h2>{html.escape(label)}</h2>\n        <ul class="loc-list">\n          {links}\n        </ul>')
    page = LOCATIONS_PAGE.format(
        site=SITE, groups="\n        ".join(groups),
        phone_display=BIZ["phone_display"], phone_e164=BIZ["phone_e164"],
        street=BIZ["street"], locality=BIZ["locality"], region=BIZ["region"], postal=BIZ["postal"],
    )
    out_dir = os.path.join(ROOT, "locations")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)


def main():
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1].lower()
    urls = []
    pages = []
    for city in CITIES:
        if only and city_slug(city["name"]) != only:
            continue
        for off in OFFERINGS:
            if off["metros_only"] and not city.get("metro"):
                continue
            url = render(city, off)
            urls.append(url)
            pages.append((off["label"], city["name"], url))
    if not only:  # full run: rebuild sitemap + locations index
        write_locations_index(pages)
        write_sitemap([SITE + "/locations/"] + urls)
    print(f"Generated {len(urls)} location page(s)" + ("" if only else " + locations index."))
    for u in urls:
        print("  ", u)


if __name__ == "__main__":
    main()
