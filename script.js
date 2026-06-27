/* ============================================================
   Compass Claw — interactive behavior (vanilla JS, no deps)
   ============================================================ */
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var fmt = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };

  /* ============================================================
     ROI calculator + lead funnel
     ============================================================ */
  (function calculator() {
    var form = document.getElementById("calcForm");
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll(".calc-step"));
    var totalSteps = steps.length; // 4
    var current = 1;

    var dots = form.parentNode.querySelectorAll("[data-dot]");
    var segs = form.parentNode.querySelectorAll("[data-seg]");
    var errEl = document.getElementById("calcErr");
    var successEl = document.getElementById("calcSuccess");

    var state = { industry: null, jobValue: 650, calls: 250, missedPct: 30 };

    function showError(msg) { errEl.textContent = msg; errEl.hidden = false; }
    function clearError() { errEl.hidden = true; errEl.textContent = ""; }

    function render() {
      steps.forEach(function (s) { s.classList.toggle("active", Number(s.dataset.step) === current); });
      dots.forEach(function (d) {
        var n = Number(d.dataset.dot);
        d.classList.toggle("active", n <= current);
      });
      segs.forEach(function (s) {
        var n = Number(s.dataset.seg);
        s.classList.toggle("active", n < current);
      });
      clearError();
    }

    /* ----- Step 1: industry selection ----- */
    var industryGrid = document.getElementById("industryGrid");
    industryGrid.addEventListener("click", function (e) {
      var btn = e.target.closest(".opt");
      if (!btn) return;
      industryGrid.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("selected"); });
      btn.classList.add("selected");
      state.industry = btn.dataset.value;
      state.jobValue = Number(btn.dataset.job);
      // Sync the job-value slider to the industry default
      jobSlider.value = state.jobValue;
      updateSlider(jobSlider);
      syncJobLabel();
    });

    /* ----- Step 2: sliders ----- */
    var callsSlider = document.getElementById("monthlyCalls");
    var missedSlider = document.getElementById("missedPct");
    var jobSlider = document.getElementById("jobValue");
    var callsVal = document.getElementById("callsVal");
    var missedVal = document.getElementById("missedVal");
    var jobVal = document.getElementById("jobVal");

    function updateSlider(el) {
      var min = Number(el.min), max = Number(el.max), v = Number(el.value);
      el.style.setProperty("--val", ((v - min) / (max - min)) * 100 + "%");
    }
    function syncCallsLabel() { state.calls = Number(callsSlider.value); callsVal.textContent = state.calls.toLocaleString("en-US"); }
    function syncMissedLabel() { state.missedPct = Number(missedSlider.value); missedVal.textContent = state.missedPct + "%"; }
    function syncJobLabel() { state.jobValue = Number(jobSlider.value); jobVal.textContent = fmt(state.jobValue); }

    [callsSlider, missedSlider, jobSlider].forEach(function (el) {
      updateSlider(el);
      el.addEventListener("input", function () {
        updateSlider(el);
        if (el === callsSlider) syncCallsLabel();
        if (el === missedSlider) syncMissedLabel();
        if (el === jobSlider) syncJobLabel();
      });
    });

    /* ----- Step 3: results ----- */
    var CONVERSION = 0.25; // share of answered calls that become a job/customer
    var RECOVER = 0.70;    // share of missed calls Compass Claw recovers

    function animateValue(el, target, render) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) { el.textContent = render(target); return; }
      var start = null, dur = 900;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = render(target * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function computeAndShow() {
      var missedCalls = state.calls * (state.missedPct / 100);
      var lostJobs = missedCalls * CONVERSION;
      var lossMonth = lostJobs * state.jobValue;
      var recovered = lossMonth * RECOVER;

      animateValue(document.getElementById("missedCount"), missedCalls, function (n) { return Math.round(n).toLocaleString("en-US"); });
      animateValue(document.getElementById("lostJobs"), lostJobs, function (n) { return Math.round(n).toLocaleString("en-US"); });
      animateValue(document.getElementById("lossMonth"), lossMonth, fmt);
      animateValue(document.getElementById("recovered"), recovered, fmt);
      document.getElementById("lossYear").textContent = fmt(lossMonth * 12);
    }

    /* ----- Navigation ----- */
    function validateStep() {
      if (current === 1 && !state.industry) { showError("Pick the option closest to your business."); return false; }
      if (current === 4) {
        var name = form.querySelector('input[name="name"]');
        var email = form.querySelector('input[name="email"]');
        if (!name.value.trim()) { showError("What should we call you?"); name.focus(); return false; }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError("Add a valid email so we can send your plan."); email.focus(); return false; }
      }
      return true;
    }

    function go(dir) {
      if (dir > 0 && !validateStep()) return;
      var next = current + dir;
      if (next < 1 || next > totalSteps) return;
      current = next;
      render();
      if (current === 3) computeAndShow();
      // Scroll the calculator into comfortable view on step change
      document.getElementById("calculator").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    form.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) go(1);
      else if (e.target.closest("[data-back]")) go(-1);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep()) return;
      var data = Object.assign({}, state, {
        name: form.querySelector('input[name="name"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        zip: form.querySelector('input[name="zip"]').value.trim()
      });
      // TODO: wire to CRM / webhook / email service. For now, log it.
      console.log("Compass Claw lead:", data);

      form.querySelectorAll(".calc-step").forEach(function (s) { s.classList.remove("active"); });
      document.querySelector(".calc-nav") && (function () {})();
      var firstName = data.name.split(" ")[0] || "there";
      var nameSpan = document.getElementById("successName");
      if (nameSpan) nameSpan.textContent = firstName;
      successEl.hidden = false;
      dots.forEach(function (d) { d.classList.add("active"); });
      segs.forEach(function (s) { s.classList.add("active"); });
    });

    // init labels
    syncCallsLabel(); syncMissedLabel(); syncJobLabel();
    render();
  })();

  /* ============================================================
     Stat counters
     ============================================================ */
  (function stats() {
    var nums = Array.prototype.slice.call(document.querySelectorAll(".stat-num"));
    if (!nums.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate(el) {
      var target = parseFloat(el.dataset.target) || 0;
      var suffix = el.dataset.suffix || "";
      if (reduce || target === 0) { el.textContent = target + suffix; return; }
      var start = null, dur = 1200;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ============================================================
     Testimonial carousel
     ============================================================ */
  (function carousel() {
    var track = document.getElementById("carouselTrack");
    if (!track) return;
    var wrap = document.getElementById("carousel");
    var prev = wrap.querySelector("[data-prev]");
    var next = wrap.querySelector("[data-next-c]");
    var dotsWrap = document.getElementById("carouselDots");
    var slides = Array.prototype.slice.call(track.children);

    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      b.addEventListener("click", function () { scrollTo(i); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollTo(i) {
      var s = slides[i];
      if (s) track.scrollTo({ left: s.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    function activeIndex() {
      var center = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      slides.forEach(function (s, i) {
        var c = s.offsetLeft - track.offsetLeft + s.clientWidth / 2, d = Math.abs(c - center);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function updateDots() {
      var idx = activeIndex();
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(function () { updateDots(); ticking = false; }); ticking = true; }
    });
    if (prev) prev.addEventListener("click", function () { scrollTo(Math.max(0, activeIndex() - 1)); });
    if (next) next.addEventListener("click", function () { scrollTo(Math.min(slides.length - 1, activeIndex() + 1)); });
    updateDots();
  })();

  /* ============================================================
     FAQ accordion
     ============================================================ */
  (function faq() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
    items.forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          q.setAttribute("aria-expanded", "true");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  })();

})();
