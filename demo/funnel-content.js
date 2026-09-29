/* ==========================================================================
   COMPASS CLAW FUNNEL — CONTENT LAYER
   Every word the funnel speaks lives in this file. No logic, no markup.
   Default copy is intentionally minimal: the five graphics carry the message,
   this file only adds connective tissue + UI labels.
   Edit a string, reload the page. Nothing else needs to change.
   ========================================================================== */

window.COMPASS = {

  /* ---------------------------------------------------------------- brand */
  brand: {
    name: "Compass Claw",
    logo: "assets/logo.jpg"
  },

  /* ---------------------------------------------------------------- links */
  links: {
    /* Stripe Payment Link — from assets/stripe link.txt */
    stripe: "https://buy.stripe.com/aFa8wO55kg1q9kC7WXgjC06",

    /* Tally onboarding intake — from assets/tally link.txt.
       `embed` renders inline, `form` is the share link used as fallback. */
    tally: {
      embed: "https://tally.so/embed/obPvzb?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
      form:  "https://tally.so/r/obPvzb"
    },

    /* The product demo: the Swayze Towing front page.
       Local (sales flow/funnel/): the source bundle one folder up, with the
       space URL-encoded.
       Live (site/demo/): the staged copy on the same host, addressed by file so
       it never depends on a directory index existing. Two files, each right
       for where it runs. */
    demo: "/swayze/index.html"
  },

  /* --------------------------------------------------- checkout behaviour */
  checkout: {
    /* Two ways to take payment; the rest of the funnel is identical either way.

       "popup"   (default) Stripe's own page opens as a centred window sized like
                 a modal, so this screen never navigates away — the numbers stay
                 on screen and the call keeps its rhythm. When the payment window
                 comes back (or a second window of this page reports success
                 through localStorage) the funnel unlocks itself. Works with a
                 plain Payment Link and no server.
       "newtab"  same link, in a real browser tab.
       "embed"   the card form renders inside step 8 and the buyer never leaves
                 the page. This one needs a server: Stripe only renders its
                 payment form inside a Checkout Session created for it, and
                 only your server may hold the secret key that creates one.
                 Fill embed.publishableKey and embed.endpoint below (see README,
                 "Embedded checkout"); the Stripe-specific code lives on its own
                 in funnel-stripe.js. Until both are set, step 8 falls back to
                 the payment window exactly as "popup" would. */
    mode: "embed",
    popup: { width: 540, height: 820 },
    embed: {
      publishableKey: "",                   /* "pk_live_…" or "pk_test_…" */
      endpoint: "",                         /* POST → { client_secret } */
      container: "checkout-form"
    },
    /* Stripe dashboard → this payment link → After payment → Redirect to:
       <host>/funnel/?paid=1   (see README). Landing here unlocks onboarding. */
    paidQueryFlag: "paid"
  },

  /* ------------------------------------------------- funnel-wide UI words */
  ui: {
    continue: "Continue",
    back: "Back",
    restart: "Restart",
    restartQuestion: "Restart the funnel? The numbers from this call are cleared.",
    cancel: "Cancel",
    confirmRestart: "Restart",
    chapterAria: "Go to {label}",
    artHint: "Click a dot to see what it does \u00b7 click the graphic to enlarge",
    close: "Close",
    locked: "Onboarding unlocks as soon as payment is confirmed.",
    waitingTitle: "Waiting on payment",
    paidYes: "I've already paid",
    backToCheckout: "Back to checkout",
    tallyFallback: "If the form does not appear, open it in a new tab.",
    tallyOpen: "Open the intake form",
    tallyWaiting: "Loading your intake form…",
    recapCopy: "Copy recap",
    recapCopied: "Copied",
    demoOpen: "Open the demo full size",
    demoWide: "Fill the screen",
    demoWideOn: "Back to the funnel",
    secureNote: "You'll finish on Stripe's secure page, then come straight back here.",
    paymentConfirmed: "Payment confirmed",
    through: "You're through.",
    unlocked: "Onboarding unlocked",
    scopeLabel: "Scope",
    summaryTitle: "This call, in numbers",
    recapTitle: "call recap",
    copyFail: "Copy failed — select the text manually",

    /* payment: popup mode (no server) + embedded mode (see checkout.embed) */
    paymentTitle: "Payment",
    paymentBody: "The payment page opens as a window on top of this one. Nothing here moves while they pay.",
    paymentOpened: "Payment window open. This page waits for Stripe.",
    paymentWaiting: "Waiting on Stripe. This page unlocks itself the moment the payment lands.",
    paymentBlocked: "Your browser blocked the payment window. Allow pop-ups, or send the link below.",
    paymentCopy: "Copy payment link",
    paymentCopied: "Payment link copied",
    paymentElsewhere: "Open the payment page in a new tab",
    embedBody: "Pay with the card form below. It is Stripe's own form, running inside this page.",
    embedMissing: "The card form is not loading. Use the button below instead.",
    /* Embed mode cannot see inside Stripe's frame, so this is the buyer's door
       out when the form itself will not appear. */
    embedEscape: "Not showing? Take the payment page in a new tab"
  },

  /* ---------------------------------------------------------- the 9 steps
     id       routing (#/goals) + rail position
     label    rail chapter name (short)
     line     the single connective sentence spoken on screen
     cta      forward button (falls back to ui.continue when omitted)         */
  steps: [
    {
      id: "open",
      label: "Open",
      line: "One system that catches every lead and compounds it.",
      cta: "Begin"
    },
    {
      id: "leak",
      label: "The leak",
      line: "Four questions, then the number nobody likes."
    },
    {
      id: "goals",
      label: "4 goals",
      line: "Four goals. The whole system exists to hit them."
    },
    {
      id: "system",
      label: "The system",
      line: "This is the machine. Click any part of it."
    },
    {
      id: "demo",
      label: "Live demo",
      line: "This is a working one, live right now. Not a mockup."
    },
    {
      id: "loop",
      label: "Compounding",
      line: "Every month feeds the next one. That's the part that compounds."
    },
    {
      id: "offer",
      label: "The offer",
      line: "Here's exactly what gets installed.",
      cta: "Proceed to secure checkout"
    },
    {
      id: "checkout",
      label: "Checkout",
      line: "Secure checkout. Two minutes, then the intake form opens right here.",
      cta: "Open secure checkout"
    },
    {
      id: "onboarding",
      label: "Onboarding",
      line: "Now the intake — this is what starts your build.",
      cta: ""
    }
  ],

  /* ------------------------------------------ step 2: leak (their numbers)
     Five asked, nothing guessed: team size for context, monthly jobs and
     ticket for the missed-business part, CRM + past-client count for the
     dormant-list part. missedRate/reactRate are industry averages until the
     buyer adjusts them behind "Put your own in".

     The arithmetic is additive and stated on screen: missed new business
     plus dormant-list reactivation (halved when a CRM already works half
     the list). Defaults (120 jobs/mo, $450, 500 past clients, no CRM) give
     about 42 missed jobs and $22,233 a month. */
  leak: {
    fields: [
      { key: "employees", label: "Employees", min: 1, max: 60, step: 1, value: 5 },
      { key: "jobsMonth", label: "Jobs per month", min: 5, max: 2000, step: 5, value: 120 },
      { key: "ticket", label: "Average job revenue", min: 25, max: 25000, step: 25, value: 450, prefix: "$" },
      { key: "hasCrm", label: "Using a CRM?", type: "toggle", value: false, offLabel: "No", onLabel: "Yes" },
      { key: "pastClients", label: "Past clients on the list", min: 0, max: 20000, step: 10, value: 500 },
      { key: "crmCount", label: "How many past clients in it?", min: 0, max: 20000, step: 10, value: 500, showIf: "hasCrm" }
    ],
    /* Industry averages: shown as read-only figures, editable behind "adjust".
       `short` is what the summary line under the sliders is built from. */
    benchmarks: [
      { key: "missedRate", short: "of jobs go unanswered",
        label: "Jobs going unanswered", min: 5, max: 90, step: 1, value: 35, suffix: "%" },
      { key: "reactRate", short: "of the list reactivates yearly",
        label: "List reactivating yearly", min: 1, max: 30, step: 0.5, value: 8, suffix: "%" }
    ],
    benchmarkNote: "Not asked. The averages for a local service business, shown so you can see where the total comes from.",
    adjust: "These are averages. Put your own in.",
    adjustDone: "Back to the averages",
    derivedLabel: "Missed jobs a month",
    result: "Monthly revenue left on the table",
    qualifier: "Your numbers, the industry's average. Not a projection.",
    crmHalves: 0.5,
    breakdownMissed: "Missed new business",
    breakdownDormant: "Dormant list",
    perHead: "Unrealised per employee"
  },

  /* ----------------------------- steps 3/4/6: clickable graphic objects
     Each hotspot is a pulsing dot that opens a card: title + what it does +
     why it matters. x/y are percentages of the image box (top-left origin).
     Nudge coordinates here after seeing the dots on the live graphics. */
  overlays: {
    /* The goals graphic is a vertical list, not a 2x2 grid: the icon column sits
       at about 16% and the four rows run 46 / 60 / 71 / 85% down. */
    goals: [
      { x: 16, y: 46, title: "Booked appointments",
        what: "Every call, chat, and form answered fast enough to win the booking.",
        why: "Speed-to-lead wins the job before a competitor calls back." },
      { x: 16, y: 60, title: "Google ranking",
        what: "More completed jobs feeding more reviews into the profile.",
        why: "Reviews compound into map-pack position that paid ads cannot rent." },
      { x: 16, y: 71, title: "Repeat customers",
        what: "Follow-up on every finished job, so the next one comes back.",
        why: "A past customer costs nothing to reach and books at a higher rate." },
      { x: 16, y: 85, title: "Simplify operations",
        what: "One system for calls, booking, reviews, and follow-up.",
        why: "Fewer tools to feed means fewer leads fall between them." }
    ],
    /* The system diagram: four outer cards around the hub, one below. Dots sit
       on each card's centre, which is what makes the pairing obvious. */
    system: [
      { x: 17, y: 18, title: "Website",
        what: "The site you will click through in the demo: quote flow, proof, and call paths.",
        why: "It turns lookers into booked jobs instead of bounces." },
      { x: 83, y: 18, title: "Reputation",
        what: "Review capture on the back of every completed job.",
        why: "Fresh reviews lift ranking, and ranking lifts every future lead." },
      { x: 17, y: 51, title: "Instant lead follow-up",
        what: "Every new lead answered in seconds, automatically.",
        why: "The first business to respond wins most booked jobs." },
      { x: 83, y: 51, title: "Auto call, text, and email AI",
        what: "AI works the missed calls and cold leads a crew never has time for.",
        why: "Unanswered lines stop being lost revenue and start booking." },
      { x: 50, y: 88, title: "Keep growing",
        what: "Referral memory and monthly numbers, so the loop has somewhere to live.",
        why: "Every finished job feeds the next month's pipeline." }
    ],
    /* The loop's four nodes sit around the circle: AI badge and phone down the
       left, stars and chart down the right. */
    loop: [
      { x: 17, y: 49, title: "AI captured jobs",
        what: "Missed calls and cold leads worked until they book.",
        why: "Recovered jobs are the cheapest revenue in the business." },
      { x: 82, y: 49, title: "More reviews",
        what: "Each finished job asks for a review while the work is fresh.",
        why: "Review velocity is what moves a profile up the map." },
      { x: 82, y: 77, title: "Higher ranking",
        what: "Reviews and completed jobs compound into map-pack position.",
        why: "Ranking brings leads that cost nothing per click." },
      { x: 18, y: 80, title: "More calls and leads",
        what: "Ranking and reputation send the next wave of inbound work.",
        why: "That wave feeds the loop again, which is the compounding part." }
    ]
  },

  /* --------------------------- step 5: what to try inside the live demo */
  demo: {
    checklist: [
      { key: "chat",  label: "Ask it for a quote in the chat" },
      { key: "form",  label: "Run the request form to the end" },
      { key: "proof", label: "Scroll the proof on the page" }
    ],
    note: "Same site you're looking at, wired to your business."
  },

  /* -------------------------------- step 6: compounding (their numbers) */
  compounding: {
    fields: [
      { key: "leads",  label: "Leads per month",          min: 10, max: 2000,  step: 10,  value: 120 },
      { key: "close",  label: "Close rate",               min: 1,  max: 90,    step: 1,   value: 35, suffix: "%" },
      { key: "ticket", label: "Average job value",        min: 25, max: 25000, step: 25,  value: 450, prefix: "$" },
      { key: "lift",   label: "Monthly compounding lift", min: 0,  max: 25,    step: 0.5, value: 6,  suffix: "%" }
    ],
    startLabel: "Month 1",
    endLabel: "Month 12",
    delta: "Same system, one year of compounding",
    qualifier: "Your numbers, your rate of change. Not a promise.",
    months: 12
  },

  /* ------------------------------------ step 7: what gets installed */
  offer: {
    scopeNote: "{n} items, exactly as listed here",
    included: [
      "The website you just clicked through, on your name",
      "Missed-call recovery on every unanswered line",
      "Quote and booking flow that finishes itself",
      "Review capture on the back of every completed job",
      "Referral memory, so the loop has somewhere to live",
      "The monthly numbers, in plain English"
    ]
  },

  /* ----------------------------- step 9: handoff timeline (neutral verbs) */
  handoff: {
    title: "You're in. Here's what happens next.",
    recapLine: "Everything you entered, so nothing gets repeated.",
    timeline: [
      { label: "Intake",  body: "This form lands with the build team the moment you submit it." },
      { label: "Kickoff", body: "One call to lock scope, access, and the launch date." },
      { label: "Assets",  body: "Logos, photos, service list, and anything you want said." },
      { label: "Build",   body: "Your version of the demo you just used, wired to your business." },
      { label: "Launch",  body: "Live on your number and domain, with the loop running." }
    ]
  },

  /* ------------------------------------------------------------ behaviour */
  behaviour: {
    /* The buyer's progress through this call. */
    storageKey: "compass-claw-funnel-v3",
    /* The seller's own settings (demo viewport). Kept apart so R clears the
       call without switching them off. */
    prefsKey: "compass-claw-prefs",
    /* Load the 12.9 MB demo bundle only when the demo step is opened. */
    lazyDemo: true,
    /* ms to wait for the Tally iframe to announce itself before the fallback
       link is offered. The iframe stays either way. */
    tallyLoadTimeout: 9000
  }
};
