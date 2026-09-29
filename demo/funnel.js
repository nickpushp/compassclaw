/* ==========================================================================
   COMPASS CLAW FUNNEL — ENGINE
   Step machine + calculators + Stripe handoff + Tally onboarding gate.
   No dependencies, no build step.
   Reads everything (copy, links, tuning) from funnel-content.js.
   ========================================================================== */

(function () {
  "use strict";

  var C = window.COMPASS;
  var steps = C.steps;
  var LAST = steps.length - 1;

  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var money = function (n) {
    return "$" + Math.round(n || 0).toLocaleString("en-US");
  };
  var clamp = function (n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };

  /* ------------------------------------------------------------ state -- */
  function blank() {
    return {
      step: 0,
      leak: {},          /* the two numbers asked: jobs, ticket */
      leakBench: {},     /* industry averages: missedRate, callsPerJob (+ open) */
      loop: {},
      loopSeeded: false,
      demo: { device: "desktop", checks: {} },
      paid: false,
      paidVia: "",
      session: "",
      awaiting: false,
      tallyDone: false
    };
  }

  function load() {
    var base = blank();
    try {
      var raw = localStorage.getItem(C.behaviour.storageKey);
      if (!raw) return base;
      var got = JSON.parse(raw) || {};
      Object.keys(base).forEach(function (k) {
        if (!(k in got)) return;
        if (k === "demo") {
          base[k] = Object.assign({}, base[k], got[k] || {});
          base[k].checks = Object.assign({}, (base[k].checks || {}), ((got[k] || {}).checks || {}));
        } else if (typeof base[k] === "object" && base[k]) {
          base[k] = Object.assign({}, base[k], got[k] || {});
        } else {
          base[k] = got[k];
        }
      });
      if (typeof base.step !== "number" || base.step < 0 || base.step > LAST) base.step = 0;
    } catch (e) { /* private mode / corrupt blob: start fresh */ }
    return base;
  }

  var state = load();

  function save() {
    try { localStorage.setItem(C.behaviour.storageKey, JSON.stringify(state)); }
    catch (e) { /* storage disabled: funnel still runs, just won't resume */ }
  }

  /* The demo viewport preference lives under its own key, apart from the
     buyer's progress: R clears the call, never the seller's own kit. A restart,
     a reload, or a second window all open with the same viewport choice. */
  function savePrefs() {
    try {
      localStorage.setItem(C.behaviour.prefsKey, JSON.stringify({
        device: state.demo.device
      }));
    } catch (e) { /* storage disabled: settings last for this call only */ }
  }

  function applyPrefs() {
    var p = {};
    try { p = JSON.parse(localStorage.getItem(C.behaviour.prefsKey)) || {}; }
    catch (e) { p = {}; }
    if (p.device === "mobile" || p.device === "desktop") state.demo.device = p.device;
  }

  var step = function () { return steps[state.step]; };

  /* ------------------------------------------------------ tiny DOM utils */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function show(node, on) { node.hidden = !on; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  var toastTimer = null;
  function toast(msg) {
    var t = $("js-toast");
    t.textContent = msg;
    show(t, true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { show(t, false); }, 2600);
  }

  /* --------------------------------------------------------------- rail */
  function buildRail() {
    var rail = $("js-rail");
    clear(rail);
    steps.forEach(function (s, i) {
      var b = el("button", "chap");
      b.type = "button";
      b.dataset.index = String(i);
      b.title = s.label;
      b.appendChild(el("i"));
      b.appendChild(el("span", null, s.label));
      b.setAttribute("aria-label",
        C.ui.chapterAria.replace("{label}", (i + 1) + ". " + s.label));
      b.addEventListener("click", function () {
        if (locked(i)) { toast(C.ui.locked); return; }
        goTo(i);
      });
      rail.appendChild(b);
    });
  }

  /* Onboarding is the only chapter that cannot be walked into freely. */
  function locked(i) {
    return steps[i].id === "onboarding" && !state.paid;
  }

  /* ------------------------------------------------------------- render */
  function render() {
    var s = step();

    $$(".screen").forEach(function (sc) {
      sc.classList.toggle("on", sc.dataset.step === s.id);
    });

    var screen = $("screen-" + s.id);
    $$("[data-bind]", screen).forEach(function (node) {
      var key = node.dataset.bind;
      if (s[key] != null) {
        node.textContent = s[key];
      } else if (C.ui[key] != null) {
        node.textContent = C.ui[key];
      }
    });

    $("js-progress").style.width = (((state.step + 1) / steps.length) * 100) + "%";

    $$(".chap").forEach(function (b, i) {
      b.classList.toggle("now", i === state.step);
      b.classList.toggle("done", i < state.step);
      b.classList.toggle("locked", locked(i));
    });

    renderNav();

    if (s.id === "leak") paintLeak();
    if (s.id === "loop") { seedLoop(); paintLoop(); }
    if (s.id === "demo") ensureDemoLoaded();
    if (s.id === "checkout") renderCheckout();
    if (s.id === "onboarding") renderOnboarding();

    $("stage").scrollTop = 0;
    save();
  }

  /* Which label + which action the single forward button carries. */
  function navPlan() {
    var s = step();
    if (s.id === "checkout" && !state.paid) {
      /* Embedded mode: Stripe's own pay button is on the screen, so this one
         stands down instead of offering a second way to pay. */
      if (embedReady()) return { label: "", act: "none" };
      return { label: s.cta || C.ui.continue, act: "open-stripe" };
    }
    if (s.id === "onboarding") return { label: "", act: "none" };
    return { label: s.cta || C.ui.continue, act: "advance" };
  }

  function renderNav() {
    var plan = navPlan();
    var next = $("js-next");
    next.textContent = plan.label;
    show(next, !!plan.label);
    next.dataset.act = plan.act;
    /* One step per press, and step one has nothing behind it. */
    $("js-back").disabled = state.step === 0;
  }

  /* ------------------------------------------------------------ routing */
  var hashGuard = false;

  function setHash(id) {
    var want = "#/" + id;
    if (location.hash !== want) {
      hashGuard = true;
      location.hash = want;
      setTimeout(function () { hashGuard = false; }, 0);
    }
  }

  function indexOfHash() {
    var id = decodeURIComponent((location.hash || "").replace(/^#\/?/, ""));
    for (var i = 0; i < steps.length; i++) if (steps[i].id === id) return i;
    return -1;
  }

  function goTo(i) {
    i = clamp(i, 0, LAST);
    if (locked(i)) { toast(C.ui.locked); return false; }
    state.step = i;
    render();
    setHash(steps[i].id);
    return true;
  }

  function next() {
    var plan = navPlan();
    if (plan.act === "open-stripe") return openStripe();
    if (plan.act === "advance") goTo(state.step + 1);
    return undefined;
  }

  /* One press, one step back. */
  function back() {
    if (state.step === 0) return;
    goTo(state.step - 1);
  }

  /* ---------------------------------------------------- generic controls */
  /* A saved state written under earlier field ranges must never render
     off-scale, so every restored value is clamped and snapped to the step. */
  function snap(v, f) {
    if (!isFinite(v)) return f.value;
    var bounded = Math.min(f.max, Math.max(f.min, v));
    var stepped = f.min + Math.round((bounded - f.min) / f.step) * f.step;
    return Number(Math.min(f.max, Math.max(f.min, stepped)).toFixed(2));
  }

  function buildSliders(host, defs, store, onInput) {
    clear(host);
    defs.forEach(function (f) {
      if (store[f.key] == null) store[f.key] = f.value;
      store[f.key] = snap(Number(store[f.key]), f);

      var box = el("div", "slider");
      var top = el("div", "slider-top");
      top.appendChild(el("span", null, f.label));
      var out = el("strong");
      top.appendChild(out);

      var range = el("input");
      range.type = "range";
      range.min = String(f.min);
      range.max = String(f.max);
      range.step = String(f.step);
      range.value = String(store[f.key]);
      range.setAttribute("aria-label", f.label);

      function paint() {
        var v = Number(range.value);
        out.textContent = (f.prefix || "") + v.toLocaleString("en-US") + (f.suffix || "");
        var pct = ((v - f.min) / (f.max - f.min)) * 100;
        range.style.setProperty("--pct", pct + "%");
      }
      range.addEventListener("input", function () {
        store[f.key] = Number(range.value);
        paint();
        onInput();
      });
      paint();

      box.appendChild(top);
      box.appendChild(range);
      host.appendChild(box);
    });
  }

  /* ------------------------------------------------------- step 2 · leak
     Two sliders asked, the industry benchmark stated underneath them, and one
     total that moves as they drag. Nothing on this screen asks a buyer for a
     statistic they would have to guess at. */
  function buildLeak() {
    $("js-leak-label").textContent = C.leak.result;
    $("js-leak-qualifier").textContent = C.leak.qualifier;
    buildSliders($("js-leak-fields"), C.leak.fields, state.leak, function () {
      paintLeak();
      save();
    });
    renderBench();
    paintLeak();
  }

  function benchmarkDefs() { return C.leak.benchmarks || []; }

  /* Read through here so the two questions stay the only thing asked: a
     benchmark falls back to the content-file average until it is adjusted. */
  function bench(key) {
    var defs = benchmarkDefs();
    for (var i = 0; i < defs.length; i++) {
      if (defs[i].key !== key) continue;
      var v = state.leakBench[key];
      return v == null ? defs[i].value : snap(Number(v), defs[i]);
    }
    return 0;
  }

  /* Missed calls are a rate on booked work. `callsPerJob` therefore moves the
     call-volume line, not the money — see the note beside C.leak. */
  function leakMonthly() {
    var jobs = Number(state.leak.jobs || 0);
    var ticket = Number(state.leak.ticket || 0);
    return jobs * (bench("missedRate") / 100) *
      (C.leak.weeksPerMonth || 4.3) * ticket;
  }

  function missedCallsPerWeek() {
    return Number(state.leak.jobs || 0) * bench("callsPerJob") *
      (bench("missedRate") / 100);
  }

  function paintLeak() {
    $("js-leak-num").textContent = money(leakMonthly());
    $("js-leak-derived").textContent = C.leak.derivedLabel + ": " +
      Math.round(missedCallsPerWeek() || 0).toLocaleString("en-US") + " a week";
  }

  /* The benchmark strip: plain figures, with the averages opened on request so
     a buyer who disputes one is never stuck arguing with a number they cannot
     find. Sliders are only built when opened — dragging them rebuilds the
     figures line, never the strip itself, so the handle keeps focus. */
  function renderBench() {
    var host = $("js-leak-bench");
    clear(host);
    host.appendChild(el("p", "bench-note", C.leak.benchmarkNote));

    var figs = el("p", "bench-figures");
    figs.id = "js-bench-figures";
    host.appendChild(figs);
    paintBenchFigures();

    var open = !!state.leakBench.open;
    var toggle = el("button", "btn ghost sm", open ? C.leak.adjustDone : C.leak.adjust);
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.addEventListener("click", function () {
      state.leakBench.open = !state.leakBench.open;
      if (!state.leakBench.open) {
        /* "Back to the averages" means the averages. A figure nudged mid-call
           should never follow the buyer quietly into the next step. */
        benchmarkDefs().forEach(function (b) { delete state.leakBench[b.key]; });
      }
      save();
      renderBench();
      paintLeak();
      if (!state.leakBench.open) return;
      var first = host.querySelector("input[type=range]");
      if (first) first.focus();
    });
    host.appendChild(toggle);
    if (!open) return;

    var fields = el("div", "bench-fields");
    buildSliders(fields, benchmarkDefs(), state.leakBench, function () {
      paintBenchFigures();
      paintLeak();
      save();
    });
    host.appendChild(fields);
  }

  function paintBenchFigures() {
    var line = benchmarkDefs().map(function (b) {
      return bench(b.key) + (b.suffix || "") + " " + b.short;
    }).join("  \u00b7  ");
    $("js-bench-figures").textContent = line;
  }

  /* -------------------------------------------------- step 6 · compounding */
  function seedLoop() {
    if (state.loopSeeded) return;
    state.loopSeeded = true;
    var jobs = Number(state.leak.jobs || 0);
    var ticket = Number(state.leak.ticket || 0);
    if (ticket) state.loop.ticket = ticket;
    if (jobs) {
      /* Their own job value, and enough leads each month for the jobs they said
         they book at the step's default close rate. buildSliders snaps it onto
         the compounding scale, so the curve always opens on a real point. */
      var close = 35;
      C.compounding.fields.forEach(function (f) { if (f.key === "close") close = f.value; });
      state.loop.leads = Math.round((jobs * (C.leak.weeksPerMonth || 4.3)) / (close / 100));
    }
    buildLoop();
    save();
  }

  function buildLoop() {
    buildSliders($("js-loop-fields"), C.compounding.fields, state.loop, function () {
      paintLoop();
      save();
    });
    $("js-loop-start-label").textContent = C.compounding.startLabel;
    $("js-loop-end-label").textContent = C.compounding.endLabel;
    $("js-loop-qualifier").textContent = C.compounding.qualifier;
  }

  function series() {
    var l = state.loop;
    var base = Number(l.leads || 0) * (Number(l.close || 0) / 100) * Number(l.ticket || 0);
    var growth = 1 + (Number(l.lift || 0) / 100);
    var out = [];
    for (var m = 0; m < C.compounding.months; m++) out.push(base * Math.pow(growth, m));
    return out;
  }

  function paintLoop() {
    var data = series();
    var first = data[0] || 0;
    var last = data[data.length - 1] || 0;
    $("js-loop-start").textContent = money(first);
    $("js-loop-end").textContent = money(last);
    var gain = last - first;
    var pct = first > 0 ? Math.round((gain / first) * 100) : 0;
    $("js-loop-delta").innerHTML = "";
    $("js-loop-delta").appendChild(document.createTextNode(C.compounding.delta + ": "));
    var b = el("b", null, "+" + money(gain) + " / mo (+" + pct + "%)");
    $("js-loop-delta").appendChild(b);
    drawChart(data);
  }

  function drawChart(data) {
    var canvas = $("js-loop-chart");
    var cssW = canvas.clientWidth || 640;
    var cssH = 260;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = cssH + "px";

    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var padL = 8, padR = 8, padT = 14, padB = 22;
    var w = Math.max(40, cssW - padL - padR);
    var h = Math.max(30, cssH - padT - padB);
    var max = Math.max.apply(null, data) || 1;
    var pts = data.map(function (v, i) {
      return [
        padL + (w * i) / (data.length - 1),
        padT + h - (v / max) * h
      ];
    });

    ctx.strokeStyle = "rgba(255,255,255,.06)";
    ctx.lineWidth = 1;
    for (var g = 0; g <= 3; g++) {
      var y = padT + (h * g) / 3;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + w, y); ctx.stroke();
    }

    var fill = ctx.createLinearGradient(0, padT, 0, padT + h);
    fill.addColorStop(0, "rgba(224,192,128,.34)");
    fill.addColorStop(1, "rgba(224,192,128,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0][0], padT + h);
    pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
    ctx.lineTo(pts[pts.length - 1][0], padT + h);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.beginPath();
    pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.strokeStyle = "#e0c080";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.fillStyle = "#e0c080";
    [pts[0], pts[pts.length - 1]].forEach(function (p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = "rgba(140,132,119,.85)";
    ctx.font = "11px ui-monospace, Consolas, monospace";
    ctx.fillText("M1", padL, cssH - 6);
    var endLabel = "M" + data.length;
    ctx.fillText(endLabel, padL + w - ctx.measureText(endLabel).width, cssH - 6);
  }

  /* --------------------------------------------------- graphic overlays */
  function buildOverlays() {
    $$("[data-hotspots]").forEach(function (host) {
      clear(host);
      var list = C.overlays[host.dataset.hotspots] || [];
      list.forEach(function (h) {
        if (!h.label) return;                 /* empty label = no overlay */
        var dot = el("button", "hot");
        dot.type = "button";
        dot.style.left = h.x + "%";
        dot.style.top = h.y + "%";
        dot.dataset.label = h.label;
        dot.setAttribute("aria-label", h.label);
        dot.addEventListener("click", function (ev) { ev.stopPropagation(); });
        host.appendChild(dot);
      });
    });
  }

  /* ----------------------------------------------------------- step 5   */
  var demoLoaded = false;

  function ensureDemoLoaded() {
    var frame = $("js-demo-frame");
    if (C.behaviour.lazyDemo && !demoLoaded) {
      frame.src = C.links.demo;
      demoLoaded = true;
    }
    var device = $("js-device");
    device.dataset.device = state.demo.device || "desktop";
    $$(".seg-btn").forEach(function (b) {
      b.classList.toggle("on", b.dataset.device === device.dataset.device);
    });
    try {
      $("js-demo-url").textContent = new URL(frame.src, location.href).pathname
        .replace(/^\/+/, "");
    } catch (e) {
      $("js-demo-url").textContent = C.links.demo;
    }
  }

  function buildChecklist() {
    var host = $("js-demo-check");
    clear(host);
    C.demo.checklist.forEach(function (item) {
      var li = el("li");
      var label = el("label");
      var box = el("input");
      box.type = "checkbox";
      box.checked = !!state.demo.checks[item.key];
      if (box.checked) li.classList.add("done");
      box.addEventListener("change", function () {
        state.demo.checks[item.key] = box.checked;
        li.classList.toggle("done", box.checked);
        save();
      });
      label.appendChild(box);
      label.appendChild(document.createTextNode(item.label));
      li.appendChild(label);
      host.appendChild(li);
    });
    $("js-demo-note").textContent = C.demo.note;
  }

  /* --------------------------------------------------------- step 7 / 8 */
  function buildIncluded() {
    var host = $("js-included");
    clear(host);
    C.offer.included.forEach(function (line) { host.appendChild(el("li", null, line)); });
  }

  /* ------------------------------------------------------------ payment
     C.links.stripe is a Payment Link, and Stripe refuses to be framed: the only
     page its form renders inside is one it issued itself. So "embed" mode does
     not point at the link — it goes through funnel-stripe.js to a Checkout
     Session created by your server. Everything below holds for both modes. */
  function paymentUrl() {
    return C.links.stripe || "";
  }

  function embedReady() {
    var e = C.checkout.embed || {};
    return C.checkout.mode === "embed" && !embedFailed && !!e.endpoint &&
      !!e.publishableKey && !!(window.COMPASS_STRIPE && window.COMPASS_STRIPE.mount);
  }

  function openStripe() {
    var url = paymentUrl();
    if (!url) { toast(C.ui.embedMissing); return; }

    if (C.checkout.mode === "newtab") {
      window.open(url, "_blank", "noopener");
      state.awaiting = true;
      save();
      renderCheckout();
      return;
    }

    /* A centred window rather than a tab: it reads as part of this page, and
       the funnel behind it keeps showing the numbers just agreed. */
    var p = C.checkout.popup || {};
    var w = Math.min(p.width || 540, (window.screen || {}).width - 40 || 540);
    var h = Math.min(p.height || 820, (window.screen || {}).height - 40 || 820);
    var left = Math.max(0, Math.round((((window.screen || {}).width || 1280) - w) / 2));
    var top = Math.max(0, Math.round((((window.screen || {}).height || 900) - h) / 2));
    var win = window.open(url, "compass-claw-payment",
      "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top +
      ",scrollbars=yes,resizable=yes");

    state.awaiting = true;
    save();
    toast(win ? C.ui.paymentOpened : C.ui.paymentBlocked);
    renderCheckout();
  }

  /* Two honest routes to "paid": the redirect Stripe was given lands a window
     of this page that writes the fact to localStorage (see adoptPayment), or the
     seller says it went through. Never a guess. */
  function paymentSucceeded(via, session) {
    var fresh = !state.paid;
    state.paid = true;
    state.awaiting = false;
    state.paidVia = via;
    if (session) state.session = session;
    save();
    if (fresh) {
      toast(C.ui.unlocked);
      if (step().id === "checkout") goTo(LAST);
      else render();
    }
  }

  function markPaid(via, session) { paymentSucceeded(via, session); }

  /* Adopt a payment confirmed by another window of this same funnel: Stripe
     redirects to ?paid=1, that window unlocks and saves, and the storage event
     carries it back here. Same origin, no polling, no server round trip. */
  function adoptPayment() {
    if (state.paid) return;
    var got = {};
    try { got = JSON.parse(localStorage.getItem(C.behaviour.storageKey)) || {}; }
    catch (e) { return; }
    if (!got.paid) return;
    state.paid = true;
    state.awaiting = false;
    state.paidVia = got.paidVia || "other-window";
    if (got.session) state.session = got.session;
    save();
    toast(C.ui.unlocked);
    if (step().id === "checkout") goTo(LAST);
    else render();
  }

  /* Embedded mode only. Everything Stripe-version-specific — API names, the
     client secret handshake — lives in funnel-stripe.js, so a change of Stripe
     API touches one small file and never the funnel. */
  var embedFailed = false;

  function mountStripeEmbed() {
    var slot = $(C.checkout.embed.container || "checkout-form");
    if (!embedReady()) { show(slot, false); return false; }
    show(slot, true);
    window.COMPASS_STRIPE.mount({
      slot: slot,
      meta: {
        jobs: state.leak.jobs,
        ticket: state.leak.ticket,
        leakMonthly: Math.round(leakMonthly()),
        step: steps[state.step].id
      },
      onPaid: function (session) { paymentSucceeded("embedded", session); },
      onError: function (err) {
        /* A misconfigured or unreachable endpoint must not strand the buyer with
           no way to pay: say so once, then behave like popup mode from here on. */
        embedFailed = true;
        if (window.console) console.warn("[compass] embedded checkout:", err && err.message);
        show(slot, false);
        renderCheckout(C.ui.embedMissing);
      }
    });
    return true;
  }

  function fieldLabel(defs, key) {
    var out = key;
    (defs || []).forEach(function (f) { if (f.key === key) out = f.label; });
    return out;
  }

  function renderSummary() {
    var host = $("js-summary");
    clear(host);
    var rows = [
      [fieldLabel(C.leak.fields, "jobs"),
        (Number(state.leak.jobs) || 0).toLocaleString("en-US") + " / week"],
      [fieldLabel(C.leak.fields, "ticket"), money(state.leak.ticket)],
      [C.leak.derivedLabel,
        Math.round(missedCallsPerWeek() || 0).toLocaleString("en-US") + " / week"],
      ["Unrealised", money(leakMonthly()) + " / month"],
      [C.ui.scopeLabel, C.offer.scopeNote.replace("{n}", String(C.offer.included.length))]
    ];
    rows.forEach(function (r) {
      if (!r[1]) return;
      host.appendChild(el("dt", null, r[0]));
      host.appendChild(el("dd", null, String(r[1])));
    });
  }

  /* The payment screen never takes the buyer away from the numbers that
     justified the price: the card form either opens as a window on top of this
     page or renders inside it, and this panel only ever says what is being
     waited for. */
  function renderCheckout(note) {
    renderSummary();
    var host = $("js-checkout-status");
    clear(host);

    if (state.paid) {
      host.appendChild(badge(true, C.ui.paymentConfirmed));
      host.appendChild(el("h3", "status-title", C.ui.through));
      host.appendChild(el("p", "status-body", C.steps[LAST].line));
      var go = el("button", "btn primary", C.ui.continue);
      go.type = "button";
      go.addEventListener("click", function () { goTo(LAST); });
      host.appendChild(go);
      renderNav();          /* Stripe's pay button is off the screen now */
      return;
    }

    var embedded = mountStripeEmbed();      /* no-op unless configured */

    host.appendChild(badge(false, state.awaiting ? C.ui.waitingTitle : C.ui.paymentTitle));
    host.appendChild(el("p", "status-body", note || (embedded ? C.ui.embedBody :
      state.awaiting ? C.ui.paymentWaiting : C.ui.paymentBody)));

    /* The link itself stays reachable: a blocked window, a phone, or a buyer
       who would rather be sent the page than watch it open. */
    if (!embedded) {
      var row = el("div", "row");
      var copy = el("button", "btn ghost sm", C.ui.paymentCopy);
      copy.type = "button";
      copy.addEventListener("click", function () {
        copyText(paymentUrl(), C.ui.paymentCopied);
      });
      var elsewhere = el("a", "btn ghost sm", C.ui.paymentElsewhere);
      elsewhere.href = paymentUrl();
      elsewhere.target = "_blank";
      elsewhere.rel = "noopener";
      row.appendChild(copy);
      row.appendChild(elsewhere);
      host.appendChild(row);
    } else if (paymentUrl()) {
      /* Nothing on this page can look inside Stripe's frame, so a form that
         refuses to render would be a dead end. A Payment Link, if there is one,
         keeps the door open: same price, one click, no waiting on a fix. */
      var escapeRow = el("div", "row");
      var escape = el("a", "btn ghost sm", C.ui.embedEscape);
      escape.href = paymentUrl();
      escape.target = "_blank";
      escape.rel = "noopener";
      escapeRow.appendChild(escape);
      host.appendChild(escapeRow);
    }

    /* Honour bar, not a detector: nobody is ever unlocked on a guess. */
    var confirm = el("button", "btn ghost sm", C.ui.paidYes);
    confirm.type = "button";
    confirm.addEventListener("click", function () { markPaid("manual", ""); });
    host.appendChild(confirm);

    /* This panel decides whether Stripe's own pay button is on screen, so the
       bar's forward button is re-planned here rather than only on navigation:
       if the embedded form failed to render, this is the moment the funnel
       stops standing down and offers the payment window again. */
    renderNav();
  }

  function badge(ok, text) {
    var b = el("span", "badge" + (ok ? " ok" : ""));
    b.appendChild(el("i"));
    b.appendChild(document.createTextNode(text));
    return b;
  }

  /* ------------------------------------------ step 9 · onboarding + Tally */
  var tallyPhase = "idle";      /* idle -> loading -> ready -> submitted */
  var tallyTimer = null;

  function tallySrc() {
    var src = C.links.tally.embed;
    /* Nothing is prefilled: the funnel no longer asks for a name or an email
       before payment, so the form asks for all of it in its own words. Only the
       Stripe session id travels, so the build team can tie an intake back to the
       payment that opened it. */
    if (!state.session) return src;
    return src + (src.indexOf("?") > -1 ? "&" : "?") +
      "stripe_session=" + encodeURIComponent(state.session);
  }

  function renderOnboarding() {
    var done = $("js-done");
    var wrap = $("js-form-wrap");
    var lock = $("js-lock");

    if (state.tallyDone) {
      buildHandoff();
      show(done, true); show(wrap, false); show(lock, false);
      return;
    }
    show(done, false);

    if (!state.paid) {
      show(wrap, false);
      show(lock, true);
      renderLock();
      return;
    }

    show(lock, false);
    show(wrap, true);
    $("js-tally-open").href = C.links.tally.form;
    $("js-tally-open").textContent = C.ui.tallyOpen;
    $("js-tally-fallback-text").textContent = C.ui.tallyFallback;
    loadTally();
  }

  function renderLock() {
    var host = $("js-lock");
    clear(host);
    host.appendChild(badge(false, C.ui.waitingTitle));
    host.appendChild(el("p", "status-body", C.ui.locked));

    var row = el("div", "row");
    var back = el("button", "btn ghost", C.ui.backToCheckout);
    back.type = "button";
    back.addEventListener("click", function () {
      for (var i = 0; i < steps.length; i++) if (steps[i].id === "checkout") { goTo(i); return; }
    });
    var yes = el("button", "btn primary", C.ui.paidYes);
    yes.type = "button";
    yes.addEventListener("click", function () { markPaid("manual", ""); });
    row.appendChild(back);
    row.appendChild(yes);
    host.appendChild(row);
  }

  function loadTally() {
    if (tallyPhase !== "idle") return;
    tallyPhase = "loading";
    $("js-tally-status").textContent = C.ui.tallyWaiting;

    /* Point the iframe straight at the form. Tally renders in a plain iframe,
       so this works with or without their widget script and with prefilled
       answers in the query string. Their embed script is still pulled in for
       dynamic height; if it is blocked, nothing here depends on it. */
    var frame = $("js-tally-frame");
    var src = tallySrc();
    frame.dataset.tallySrc = src;
    frame.src = src;

    if (!window.Tally) {
      var script = document.createElement("script");
      script.src = "https://tally.so/widgets/embed.js";
      script.async = true;
      script.onload = function () {
        try {
          if (window.Tally && typeof window.Tally.resizeEmbed === "function") window.Tally.resizeEmbed();
        } catch (e) { /* height stays fixed; the form still works */ }
      };
      script.onerror = function () { /* no widget: iframe above is enough */ };
      document.head.appendChild(script);
    }

    clearTimeout(tallyTimer);
    tallyTimer = setTimeout(function () {
      if (tallyPhase === "loading") show($("js-tally-fallback"), true);
    }, C.behaviour.tallyLoadTimeout);
  }

  function onTallyMessage(ev) {
    var data = ev && ev.data;
    if (typeof data !== "string" || data.indexOf("Tally.") === -1) return;
    if (String(ev.origin || "").indexOf("tally.so") === -1) return;

    if (data.indexOf("Tally.FormLoaded") > -1) {
      tallyPhase = "ready";
      clearTimeout(tallyTimer);
      show($("js-tally-fallback"), false);
      $("js-tally-status").textContent = "";
      return;
    }

    if (data.indexOf("Tally.FormSubmitted") > -1) {
      tallyPhase = "submitted";
      state.tallyDone = true;
      save();
      render();
      toast(C.handoff.title);
    }
  }

  /* --------------------------------------------------- handoff + recap */
  function buildHandoff() {
    $("js-done-title").textContent = C.handoff.title;
    $("js-recap-line").textContent = C.handoff.recapLine;

    var list = $("js-timeline");
    clear(list);
    C.handoff.timeline.forEach(function (t) {
      var li = el("li");
      li.appendChild(el("b", null, t.label));
      li.appendChild(el("span", null, t.body));
      list.appendChild(li);
    });

    $("js-recap").textContent = recapText();
  }

  function recapText() {
    var lines = [];
    lines.push(C.brand.name + " \u2014 " + C.ui.recapTitle);
    lines.push("");
    lines.push("Their name, business and email are on the intake form below. The");
    lines.push("funnel asks for nothing before payment, so nothing is half-typed here.");

    if (state.leak.jobs != null) {
      lines.push("");
      lines.push("Asked: " + state.leak.jobs + " jobs/week, " +
        money(state.leak.ticket) + " average job");
      lines.push("Averages used: " + bench("missedRate") + "% of calls unanswered, " +
        bench("callsPerJob") + " calls per booked job");
      lines.push("Calls not reached: " + Math.round(missedCallsPerWeek() || 0) + "/week");
      lines.push("Unrealised now: " + money(leakMonthly()) + " / month");
    }
    if (state.loop.leads != null) {
      var data = series();
      lines.push("");
      lines.push("Compounding inputs: " + state.loop.leads + " leads/month, " +
        state.loop.close + "% close, " + money(state.loop.ticket) + " average job, " +
        state.loop.lift + "% monthly lift");
      lines.push("Month 1 " + money(data[0]) + " \u2192 Month " + data.length + " " +
        money(data[data.length - 1]));
    }

    lines.push("");
    lines.push(state.paid
      ? "Payment: confirmed" + (state.paidVia ? " (" + state.paidVia + ")" : "") +
        (state.session ? ", session " + state.session : "")
      : "Payment: not confirmed yet");
    lines.push(state.tallyDone ? "Intake form: submitted" : "Intake form: not submitted yet");
    return lines.join("\n");
  }

  function copyRecap() {
    copyText($("js-recap").textContent, C.ui.recapCopied);
  }

  function copyText(text, okMessage) {
    var done = function () { toast(okMessage); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done); });
    } else {
      legacyCopy(text, done);
    }
  }

  function legacyCopy(text, done) {
    var ta = el("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-2000px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); }
    catch (e) { toast(C.ui.copyFail); }
    document.body.removeChild(ta);
  }

  function restart() {
    try { localStorage.removeItem(C.behaviour.storageKey); } catch (e) {}
    state = blank();
    applyPrefs();               /* the kit carries over, the call does not */
    /* Stripe permits one embedded checkout per page, so the old form is
       destroyed and the failed-attempt flag cleared: a new call gets a fresh
       attempt rather than inheriting the last one's verdict. */
    if (window.COMPASS_STRIPE) window.COMPASS_STRIPE.unmount();
    embedFailed = false;
    tallyPhase = "idle";
    demoLoaded = false;
    $("js-demo-frame").src = "about:blank";
    buildLeak();
    buildLoop();
    buildChecklist();
    buildOverlays();
    state.step = 0;
    render();
    setHash("open");
    toast(C.ui.restart + ": done");
  }

  /* ---------------------------------------------------- lightbox / modal */
  function openLightbox(src, alt) {
    $("js-lightbox-img").src = src;
    $("js-lightbox-img").alt = alt || "";
    show($("js-lightbox"), true);
    $("js-lightbox-close").focus();
  }
  function closeLightbox() { show($("js-lightbox"), false); }

  var modalOk = null;
  function openModal(text, onOk) {
    $("js-modal-text").textContent = text;
    modalOk = onOk;
    show($("js-modal"), true);
    $("js-modal-ok").focus();
  }
  function closeModal() { show($("js-modal"), false); modalOk = null; }

  /* ------------------------------------------------------------ keyboard */
  function onKey(ev) {
    var t = ev.target || {};
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || "") || t.isContentEditable;

    if (ev.key === "Escape") {
      if (!$("js-modal").hidden) closeModal();
      else if (!$("js-lightbox").hidden) closeLightbox();
      return;
    }
    if (typing || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (!$("js-modal").hidden) return;

    var n = parseInt(ev.key, 10);
    if (!isNaN(n) && n >= 1 && n <= steps.length) { ev.preventDefault(); goTo(n - 1); return; }

    switch (ev.key) {
      case "ArrowRight": case "PageDown": ev.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp": ev.preventDefault(); back(); break;
      case "r": case "R":
        ev.preventDefault();
        openModal(C.ui.restartQuestion, restart);
        break;
      default: break;
    }
  }

  /* -------------------------------------------------------- wiring / boot */
  function readPaidFromUrl() {
    var params = new URLSearchParams(location.search);
    var flag = C.checkout.paidQueryFlag;
    var val = (params.get(flag) || "").toLowerCase();
    var byFlag = params.has(flag) && ["1", "true", "yes", ""].indexOf(val) > -1;
    /* Stripe's own redirect params unlock too, in case the dashboard redirect
       was set to the bare funnel URL without ?paid=1. */
    var byStripe = (params.get("redirect_status") || "").toLowerCase() === "succeeded";
    if (!byFlag && !byStripe) return false;

    var session = params.get("session_id") || params.get("checkout_session_id") ||
      params.get("stripe_session") || "";
    state.paid = true;
    state.awaiting = false;
    state.paidVia = byStripe ? "stripe-redirect" : "url-flag";
    if (session && session.indexOf("{") === -1) state.session = session;
    save();

    /* Clean the address bar so a reload is not mistaken for a fresh paid
       return, and so a literal {CHECKOUT_SESSION_ID} placeholder left in the
       Stripe config never shows up in the recap. */
    params.delete(flag);
    params.delete("session_id");
    params.delete("checkout_session_id");
    params.delete("stripe_session");
    params.delete("redirect_status");
    params.delete("payment_intent_client_secret");
    var qs = params.toString();
    history.replaceState({}, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    return true;
  }

  function wire() {
    $("js-next").addEventListener("click", next);
    /* The bar and the header sit outside the screens, so the data-bind pass
       never walks them: their words are put on them here, from the content file,
       rather than left in the markup where a seller would not think to look. */
    $("js-back").textContent = C.ui.back;
    $("js-back").addEventListener("click", back);

    $$(".seg-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        state.demo.device = b.dataset.device;
        $("js-device").dataset.device = b.dataset.device;
        $$(".seg-btn").forEach(function (x) { x.classList.toggle("on", x === b); });
        save();
        savePrefs();
      });
    });
    $("js-demo-open").href = C.links.demo;
    $("js-demo-open").textContent = C.ui.demoOpen;

    $$("[data-zoom]").forEach(function (fig) {
      var img = fig.querySelector("img");
      function open() { openLightbox(fig.dataset.zoom, img ? img.alt : ""); }
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(); }
      });
    });
    $("js-lightbox-close").textContent = C.ui.close;
    $("js-lightbox").addEventListener("click", function (ev) {
      if (ev.target === $("js-lightbox") || ev.target.id === "js-lightbox-close") closeLightbox();
    });

    $("js-modal-cancel").textContent = C.ui.cancel;
    $("js-modal-ok").textContent = C.ui.confirmRestart;
    $("js-modal-cancel").addEventListener("click", closeModal);
    $("js-modal-ok").addEventListener("click", function () {
      var ok = modalOk;
      closeModal();
      if (ok) ok();
    });

    $("js-recap-copy").textContent = C.ui.recapCopy;
    $("js-recap-copy").addEventListener("click", copyRecap);

    document.addEventListener("keydown", onKey);
    window.addEventListener("message", onTallyMessage);
    window.addEventListener("hashchange", function () {
      if (hashGuard) return;
      var i = indexOfHash();
      if (i > -1 && i !== state.step) goTo(i);
    });

    /* Coming back from the payment window. Focus is not evidence, so nothing is
       inferred from it: adoptPayment only acts on a payment another window of
       this page has genuinely recorded. */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      adoptPayment();
      if (!state.paid && state.awaiting && step().id === "checkout") renderCheckout();
    });

    /* The Stripe redirect lands in the payment window, which unlocks and saves.
       A storage event carries that back to this window, which is how the funnel
       unlocks itself the moment payment lands, with nothing to click. */
    window.addEventListener("storage", function (ev) {
      if (ev && ev.key && ev.key !== C.behaviour.storageKey) return;
      adoptPayment();
    });

    var rt = null;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (step().id === "loop") paintLoop(); }, 140);
    });
  }

  function boot() {
    $("js-logo").src = C.brand.logo;
    $("js-brand").textContent = C.brand.name;
    document.title = C.brand.name;

    applyPrefs();                      /* the viewport choice survives */

    var camePaid = readPaidFromUrl();

    buildRail();
    buildLeak();
    buildLoop();
    buildChecklist();
    buildIncluded();
    buildOverlays();
    if (!C.behaviour.lazyDemo) { $("js-demo-frame").src = C.links.demo; demoLoaded = true; }
    wire();

    var hashed = indexOfHash();
    if (hashed > -1) state.step = hashed;
    if (camePaid) {
      state.step = LAST;
      state.awaiting = false;
    }

    render();
    setHash(steps[state.step].id);
    if (camePaid) toast(C.ui.unlocked);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
