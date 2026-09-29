/* ==========================================================================
   COMPASS CLAW FUNNEL — STRIPE GLUE
   The only file in this funnel that knows Stripe exists. funnel.js asks for a
   card form and this file supplies one, so every Stripe-specific name — the
   beta flag, the appearance, the confirm wiring — lives in one place instead
   of being smeared through the sales flow.

   It stays inert until ALL of these are set in funnel-content.js:
       checkout.mode                      "embed"
       checkout.embed.publishableKey      "pk_live_…" or "pk_test_…"
       checkout.embed.endpoint            a URL that POSTs → { client_secret }

   Stripe.js itself is loaded once in index.html's head, straight from
   https://js.stripe.com/dahlia/stripe.js — the dahlia build, the one that
   carries initCheckoutFormSdk. Never bundle it, never self-host it (PCI).

   Why a server is unavoidable: the payment form only renders inside a page
   whose own Checkout Session was created for it, and only your server may hold
   the secret key that creates one. A Payment Link (buy.stripe.com/…) can never
   be framed — that is Stripe's rule, not a limit of this funnel — so
   links.stripe stays in view on step 8 whatever happens in here.

   Once the endpoint answers, nothing else in the funnel changes: step 8 simply
   carries Stripe's own form inside it and the buyer never leaves the page.
   ========================================================================== */

(function () {
  "use strict";

  var C = window.COMPASS;
  if (!C || !C.checkout) return;

  /* Read the config live rather than snapshotting it, so a settings change in
     funnel-content.js is what decides behaviour, not load order. */
  function cfg() { return C.checkout.embed || {}; }

  var instance = null;     /* { form, checkout } once mounted */
  var opening = false;     /* a mount is in flight, so step 8 cannot mount twice */

  function ready() {
    return C.checkout.mode === "embed" && !!cfg().endpoint && !!cfg().publishableKey;
  }

  /* One trip to your server, which is the only place allowed to decide a price.
     `meta` travels with the request — jobs, job value, the leak, the step — so
     the server can see what the funnel worked out. An amount is never sent
     from the browser. */
  function fetchClientSecret(meta) {
    return fetch(cfg().endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(meta || {})
    }).then(function (res) {
      if (!res.ok) throw new Error("checkout endpoint replied " + res.status);
      return res.json();
    }).then(function (data) {
      var got = data && (data.clientSecret || data.client_secret);
      if (!got) throw new Error("checkout endpoint returned no client_secret");
      /* A checkout client secret is always "cs_…_secret_…". Anything else means
         the session was created for the wrong ui_mode — a one-line server
         mistake — and Stripe reports it only inside its own frame, where this
         page cannot see it. Checked here so the funnel can fall back instead. */
      if (!/^cs_[A-Za-z0-9_-]+_secret_[A-Za-z0-9_-]+$/.test(String(got))) {
        throw new Error('that is not a checkout client secret — create the ' +
          'session with ui_mode: "form" and return its client_secret');
      }
      return got;
    });
  }

  /* The trip happens once per payment screen: one session per attempt, so the
     price the seller quoted and the price on the card form cannot drift apart
     halfway down the screen. fail() and unmount() clear it, so a retry or a
     restarted call always earns a fresh one. */
  var session = null;

  function clientSecret(meta) {
    if (!session) {
      session = fetchClientSecret(meta);
      session.catch(function () { session = null; });   /* so a retry can try again */
    }
    return session;
  }

  /* The appearance is Checkout Studio's own configuration — every name in it is
     validated by Stripe — so it is passed through exactly as given rather than
     probed the way initEmbeddedCheckout's options once had to be. */
  var appearance = {
    theme: "stripe",
    labels: "auto",
    inputs: "spaced",
    variables: {
      borderRadius: "4px",
      colorBackground: "#ffffff",
      colorDanger: "#df1b41",
      colorPrimary: "#0570de",
      colorSuccess: "#00c853",
      colorText: "#30313d",
      fontFamily: "default",
      fontSizeBase: "16px",
      spacingUnit: "4px"
    }
  };

  /* The form mounts into an element; a selector works too, so both are tried.
     A throw here means the form is never going to appear. */
  function attach(form, slot) {
    try { form.mount(slot); }
    catch (e) {
      if (slot && slot.id) { form.mount("#" + slot.id); return; }
      throw e;
    }
  }

  /* opts: { slot, meta, onPaid(sessionId), onReady(), onError(err) } */
  function mount(opts) {
    opts = opts || {};
    if (instance || opening) return;        /* already mounted, or on its way */
    if (!ready()) { fail(opts, "embedded checkout is not configured"); return; }
    if (!window.Stripe) {
      fail(opts, "Stripe.js (dahlia) is not on the page — check the script tag in index.html");
      return;
    }
    opening = true;

    /* Ask for the session before showing anything. Stripe renders the form
       inside its own frame and reports a bad session only there, so a
       half-configured backend would otherwise leave the buyer staring at
       Stripe's own error with no way back. Earning the client secret first
       means the form only appears when it can work, and a failure lands in
       seconds. */
    clientSecret(opts.meta).then(function (secret) {
      var stripe = window.Stripe(cfg().publishableKey, {
        betas: ["custom_checkout_payment_form_1"]
      });
      var checkout = stripe.initCheckoutFormSdk({
        clientSecret: secret,
        appearance: appearance
      });
      var form = checkout.createForm({ layout: "expanded" });
      attach(form, opts.slot);
      instance = { form: form, checkout: checkout };
      opening = false;
      if (opts.onReady) opts.onReady();

      /* Nothing is wired until the form says it can load: a load that did not
         succeed would leave the buyer with fields that can never pay, and this
         page cannot see inside the frame to find out why. */
      return Promise.resolve(checkout.loadActions()).then(function (load) {
        if (!load || load.type !== "success") {
          throw new Error((load && load.error && load.error.message) ||
            "Stripe's card form could not load");
        }
        /* The form's own confirm button pays: Stripe reports the result through
           this callback rather than through a redirect. */
        form.on("confirm", function (event) {
          Promise.resolve(load.actions.confirm({ formConfirmEvent: event }))
            .then(function () {
              /* The session id is what ties this payment to the intake form. */
              if (opts.onPaid) opts.onPaid(String(secret).split("_secret_")[0]);
            })
            .catch(function (err) {
              /* A declined card is the buyer's to fix, not the form's: leave it
                 up so they can try another one. */
              if (window.console) console.error("[compass] payment confirmation error:", err);
            });
        });
      });
    }).catch(function (err) {
      fail(opts, (err && err.message) || "embedded checkout failed");
    });
  }

  /* What this cannot know: once the form is up, Stripe runs the card fields in
     a cross-origin document this page cannot read. `confirm` is the only event
     offered out here — a form that stops working inside that frame after a
     successful load reports nothing this code can hook. That is why the client
     secret is earned before the frame appears, why its shape is checked, and
     why step 8 keeps a Payment Link in view: the buyer's second door has to be
     visible, because the first one cannot be monitored. */

  /* One way out, taken once: the funnel has a payment window to fall back to,
     so an embedded attempt that cannot render must give the slot back. */
  function fail(opts, message) {
    opening = false;
    var err = new Error(message);   /* unmount() clears the cached session */
    unmount();
    if (opts.onError) opts.onError(err);
    else if (window.console) console.warn("[compass] embedded checkout:", message);
  }

  function unmount() {
    session = null;             /* a remount gets a fresh session, not a spent one */
    var gone = instance;
    instance = null;
    if (!gone) return;
    /* Stripe allows exactly one payment form per page, so a discarded one is
       unmounted and torn down rather than parked; otherwise a restarted call
       could never mount a new one. */
    try { if (gone.form && gone.form.unmount) gone.form.unmount(); } catch (e) { /* already gone */ }
    try {
      var teardown = gone.checkout && (gone.checkout.destroy || gone.checkout.unmount);
      if (teardown) teardown.call(gone.checkout);
    } catch (e) { /* already gone */ }
  }

  window.COMPASS_STRIPE = { mount: mount, unmount: unmount, ready: ready };
})();
