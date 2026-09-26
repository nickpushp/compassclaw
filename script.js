/* ============================================================
   Compass Claw — interactive behavior (vanilla JS, no deps)
   ============================================================ */
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var fmt = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };

  /* ============================================================
     LEAD DELIVERY — emails you every calculator submission.

     The Web3Forms access key is PUBLIC BY DESIGN (it ships to the
     browser), so it is not a secret. What actually protects the
     endpoint is a domain restriction:
       1. Log in at web3forms.com
       2. Restrict this key to compassclaw.com only
     Also keep the honeypot field in the form — it silently drops
     bot submissions.
     (To route into GoHighLevel instead, swap the fetch URL in the
     submit handler for your GHL inbound webhook URL.)
     ============================================================ */
  var WEB3FORMS_KEY = "a9f96f4d-fc74-46ba-8968-99665b5fe623";

  /* Bump this whenever the SMS consent wording changes, so every
     captured consent record points at an exact disclosure version. */
  var SMS_DISCLOSURE_VERSION = "2026-09-27";

  /* ============================================================
     MOBILE NAV
     The old build hid .header-nav below 900px and shipped no
     toggle at all, so phones had literally no navigation.
     ============================================================ */
  (function mobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      menu.classList.toggle("open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after tapping any link inside the menu
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    // Reset when we cross into the desktop layout
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  })();

  /* ============================================================
     AUDIO DEMO PLAYER
     Wires the "hear a real call" section to recordings in /audio/.
     If a recording is missing or fails to load, we fall back to an
     honest "call us and hear it live" state rather than rendering a
     dead player.

     TO ENABLE: drop short MP3s into /audio/ and set data-src on each
     .audio-tab. Keep them small (~100-300 KB, 15-30s each).
     ============================================================ */
  (function audioDemo() {
    var root = document.getElementById("audioPlayer");
    if (!root) return;

    var audio = document.getElementById("audioEl");
    var playBtn = document.getElementById("audioPlay");
    var seek = document.getElementById("audioSeek");
    var timeEl = document.getElementById("audioTime");
    var labelEl = document.getElementById("audioLabel");
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".audio-tab"));
    var wave = Array.prototype.slice.call(root.querySelectorAll(".audio-wave span"));
    var lines = Array.prototype.slice.call(root.querySelectorAll(".audio-transcript p"));
    if (!audio || !playBtn || !seek) return;

    var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

    function mmss(s) {
      if (!isFinite(s) || s < 0) s = 0;
      var m = Math.floor(s / 60), r = Math.floor(s % 60);
      return m + ":" + (r < 10 ? "0" : "") + r;
    }

    function paint() {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      seek.value = pct;
      seek.style.setProperty("--p", pct + "%");
      if (timeEl) timeEl.textContent = mmss(audio.currentTime) + " / " + mmss(audio.duration);

      // Highlight whichever transcript line the playhead is nearest
      if (audio.duration && lines.length) {
        var idx = Math.min(lines.length - 1, Math.floor((audio.currentTime / audio.duration) * lines.length));
        lines.forEach(function (l, i) { l.classList.toggle("is-current", i === idx); });
      }

      // Nudge the waveform bars while playing
      wave.forEach(function (b, i) {
        if (!audio.paused) {
          b.style.height = (22 + Math.abs(Math.sin(audio.currentTime * 3 + i)) * 72) + "%";
        } else {
          b.style.height = "30%";
        }
      });
    }

    function setPlayingUI(playing) {
      root.classList.toggle("is-playing", playing);
      playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      playBtn.setAttribute("aria-label", playing ? "Pause the sample call" : "Play the sample call");
    }

    playBtn.addEventListener("click", function () {
      if (audio.paused) { audio.play().catch(function () {}); } else { audio.pause(); }
    });

    audio.addEventListener("play", function () { setPlayingUI(true); });
    audio.addEventListener("pause", function () { setPlayingUI(false); });
    audio.addEventListener("timeupdate", paint);
    audio.addEventListener("loadedmetadata", paint);
    audio.addEventListener("ended", function () { setPlayingUI(false); audio.currentTime = 0; paint(); });

    seek.addEventListener("input", function () {
      if (audio.duration) { audio.currentTime = (seek.value / 100) * audio.duration; }
    });

    // Graceful degradation: if the recording isn't there yet, don't show a
    // play button that does nothing. We probe the file up front with a
    // cheap HEAD request, and also react if playback errors later.
    function noAudio() {
      root.classList.add("no-audio");
      playBtn.disabled = true;
      var fb = root.querySelector("[data-audio-fallback]");
      if (fb) fb.hidden = false;
    }

    audio.addEventListener("error", noAudio);

    (function probe() {
      var src = audio.getAttribute("src");
      if (!src) { noAudio(); return; }
      fetch(src, { method: "HEAD" })
        .then(function (r) { if (!r.ok) noAudio(); })
        .catch(noAudio);
    })();

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        audio.pause();
        audio.currentTime = 0;
        root.classList.remove("no-audio");
        playBtn.disabled = false;
        var fb = root.querySelector("[data-audio-fallback]");
        if (fb) fb.hidden = true;
        if (labelEl && tab.dataset.label) labelEl.innerHTML = tab.dataset.label;
        if (tab.dataset.src) { audio.src = tab.dataset.src; audio.load(); }
        paint();
      });
    });

    setPlayingUI(false);
  })();

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
    function markInvalid(el, bad) {
      if (el) el.classList.toggle("invalid", !!bad);
    }

    function validateStep() {
      if (current === 1 && !state.industry) { showError("Pick the option closest to your business."); return false; }
      if (current === 4) {
        var name = form.querySelector('input[name="name"]');
        var email = form.querySelector('input[name="email"]');
        var phone = form.querySelector('input[name="phone"]');

        if (!name.value.trim()) {
          showError("What should we call you?"); markInvalid(name, true); name.focus(); return false;
        }
        markInvalid(name, false);

        // Phone is now required — it's how the AI receptionist dials back,
        // and it's the identifier carriers expect for SMS consent.
        var digits = phone ? phone.value.replace(/\D/g, "") : "";
        if (digits.length < 10) {
          showError("Add a phone number so we can call you back.");
          markInvalid(phone, true); if (phone) phone.focus(); return false;
        }
        markInvalid(phone, false);

        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          showError("Add a valid email so we can send your plan.");
          markInvalid(email, true); email.focus(); return false;
        }
        markInvalid(email, false);
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

      var name = form.querySelector('input[name="name"]').value.trim();
      var email = form.querySelector('input[name="email"]').value.trim();
      var rawPhone = form.querySelector('input[name="phone"]').value.trim();
      var phone = rawPhone.replace(/[^\d+]/g, "");
      var zipEl = form.querySelector('input[name="zip"]');
      var zip = zipEl ? zipEl.value.trim() : "";
      var consentEl = form.querySelector('input[name="sms_consent"]');
      var smsConsent = !!(consentEl && consentEl.checked);
      var honeypot = form.querySelector('input[name="botcheck"]');

      // Bot submissions: pretend everything worked, send nothing.
      if (honeypot && honeypot.value) {
        showSuccess(name);
        return;
      }

      // Recompute the headline numbers so they're included in the email.
      var missedCalls = state.calls * (state.missedPct / 100);
      var lossMonth = missedCalls * CONVERSION * state.jobValue;

      var lead = {
        name: name,
        email: email,
        phone: phone,
        zip_or_area: zip,
        industry: state.industry,
        monthly_calls: state.calls,
        percent_missed: state.missedPct + "%",
        avg_job_value: fmt(state.jobValue),
        estimated_monthly_loss: fmt(lossMonth),
        estimated_yearly_loss: fmt(lossMonth * 12),
        source_page: window.location.pathname,
        /* --- A2P / 10DLC consent audit trail ---
           Captured so you can prove WHEN consent was given and
           against WHICH wording, if a carrier or regulator asks. */
        sms_consent: smsConsent ? "YES" : "NO",
        sms_consent_timestamp: new Date().toISOString(),
        sms_disclosure_version: SMS_DISCLOSURE_VERSION,
        page_url: window.location.href
      };

      // Show the confirmation immediately — the UI must never hang
      // waiting on the network (the old build threw before this ran).
      showSuccess(name);

      // Email the lead (no backend needed) via Web3Forms.
      if (WEB3FORMS_KEY && WEB3FORMS_KEY.indexOf("REPLACE_WITH") === -1) {
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(Object.assign({
            access_key: WEB3FORMS_KEY,
            subject: "New Compass Claw lead: " + name + " (" + (state.industry || "lead") + ")",
            from_name: "Compass Claw Website"
          }, lead))
        }).catch(function (err) { console.warn("Lead send failed:", err); });
      }
    });

    function showSuccess(name) {
      form.querySelectorAll(".calc-step").forEach(function (s) { s.classList.remove("active"); });
      var firstName = (name || "").split(" ")[0] || "there";
      var nameSpan = document.getElementById("successName");
      if (nameSpan) nameSpan.textContent = firstName;
      if (successEl) successEl.hidden = false;
      var prog = form.parentNode.querySelector(".calc-progress");
      if (prog) prog.style.display = "none";
      dots.forEach(function (d) { d.classList.add("active"); });
      segs.forEach(function (s) { s.classList.add("active"); });
    }

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
