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

    /* The product demo: the Swayze Towing front page (site/swayze/), staged from sales flow/example website (index + overlays + assets only). DirectoryIndexes is off on the host, so point at the exact file. */
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
      publishableKey: "pk_test_...",                   /* "pk_live_…" or "pk_test_…" */
      endpoint: "/api/checkout-session.php",                         /* POST → { client_secret } */
      container: "checkout-form"
    },
    /* Stripe dashboard → this payment link → After payment → Redirect to:
       <host>/demo/?paid=1   (see README). Landing here unlocks onboarding. */
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
    zoomHint: "Click the graphic to enlarge",
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
      line: "Two numbers from you. The rest is the industry average."
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
     Two questions, and nothing else. Anything the buyer cannot answer is taken
     from the benchmark below, so the step never stalls on a question they would
     have to guess at. Tune the averages here; this is the only place they live.

     The arithmetic is self-consistent, which is what makes it defensible on a
     call: if `callsPerJob` calls come in for every booked job, a missed call
     was worth 1/callsPerJob of a job, so the missed-call rate lands directly on
     booked jobs and `callsPerJob` only drives the "calls you are not reaching"
     line. Defaults (6 jobs, $450, 40%) give about 7 missed calls a week and
     $4,644 a month. */
  leak: {
    fields: [
      { key: "jobs",   label: "Jobs you book a week", min: 1,  max: 60,    step: 1,  value: 6 },
      { key: "ticket", label: "Average job value",    min: 50, max: 20000, step: 25, value: 450, prefix: "$" }
    ],
    /* Industry averages: shown as read-only figures, editable behind "adjust".
       `short` is what the summary line under the sliders is built from. */
    benchmarks: [
      { key: "missedRate",  short: "of calls go unanswered",
        label: "Calls that go unanswered",     min: 5, max: 90, step: 1, value: 40, suffix: "%" },
      { key: "callsPerJob", short: "calls per booked job",
        label: "Calls it takes to book a job", min: 1, max: 12, step: 1, value: 3 }
    ],
    benchmarkNote: "Not asked. The averages for a local service business, shown so you can see where the total comes from.",
    adjust: "These are averages. Put your own in.",
    adjustDone: "Back to the averages",
    derivedLabel: "Calls a week you are not reaching",
    result: "Monthly revenue sitting in calls that went unanswered",
    qualifier: "Your two numbers, the industry's average. Not a projection.",
    weeksPerMonth: 4.3
  },

  /* ----------------------------- steps 3/4/6: optional graphic overlays
     Shipped empty on purpose: the graphic is authoritative. Add a label and a
     hotspot appears. x/y are percentages of the image box (top-left origin). */
  overlays: {
    goals: [
      { x: 26, y: 26, label: "" }, { x: 74, y: 26, label: "" },
      { x: 26, y: 74, label: "" }, { x: 74, y: 74, label: "" }
    ],
    system: [
      { x: 18, y: 50, label: "" }, { x: 39, y: 50, label: "" },
      { x: 60, y: 50, label: "" }, { x: 81, y: 50, label: "" }
    ],
    loop: [
      { x: 50, y: 12, label: "" }, { x: 88, y: 50, label: "" },
      { x: 50, y: 88, label: "" }, { x: 12, y: 50, label: "" }
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
    storageKey: "compass-claw-funnel-v2",
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
