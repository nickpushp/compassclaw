/* ============================================================
   Compass Claw — interactive behavior
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Multi-step survey funnel
     ============================================================ */
  (function survey() {
    var form = document.getElementById("surveyForm");
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll(".survey-step"));
    var total = steps.length;
    var current = 1;

    var progressBar = document.getElementById("progressBar");
    var stepCurrent = document.getElementById("stepCurrent");
    var btnBack = document.getElementById("btnBack");
    var btnNext = document.getElementById("btnNext");
    var btnSubmit = document.getElementById("btnSubmit");
    var errorEl = document.getElementById("surveyError");
    var navEl = document.getElementById("surveyNav");
    var successEl = document.getElementById("surveySuccess");

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }
    function clearError() {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }

    function render() {
      steps.forEach(function (s) {
        s.classList.toggle("is-active", Number(s.dataset.step) === current);
      });
      progressBar.style.width = (current / total) * 100 + "%";
      stepCurrent.textContent = current;
      btnBack.disabled = current === 1;

      var isLast = current === total;
      btnNext.hidden = isLast;
      btnSubmit.hidden = !isLast;
      clearError();

      // Focus first input of the step for keyboard users
      var active = steps[current - 1];
      var firstInput = active.querySelector("input");
      if (firstInput && current > 1) {
        // don't steal focus on initial load
        firstInput.focus({ preventScroll: true });
      }
    }

    // Validate the currently visible step
    function validateStep() {
      var step = steps[current - 1];
      var radios = step.querySelectorAll('input[type="radio"]');
      var texts = step.querySelectorAll('input[type="text"], input[type="email"]');

      if (radios.length) {
        var picked = step.querySelector('input[type="radio"]:checked');
        if (!picked) {
          showError("Please pick an option to continue.");
          return false;
        }
      }

      for (var i = 0; i < texts.length; i++) {
        var t = texts[i];
        if (t.hasAttribute("required") && !t.value.trim()) {
          showError("Please fill this in so we can build your plan.");
          t.focus();
          return false;
        }
        if (t.type === "email" && t.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.value)) {
          showError("That email doesn't look right—mind double-checking?");
          t.focus();
          return false;
        }
      }
      return true;
    }

    function next() {
      if (!validateStep()) return;
      if (current < total) {
        current++;
        render();
      }
    }
    function back() {
      if (current > 1) {
        current--;
        render();
      }
    }

    btnNext.addEventListener("click", next);
    btnBack.addEventListener("click", back);

    // Auto-advance when a radio option is chosen (snappy funnel feel)
    form.addEventListener("change", function (e) {
      if (e.target && e.target.type === "radio") {
        clearError();
        if (current < total) {
          setTimeout(next, 220);
        }
      }
    });

    // Enter key advances on text steps
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && current < total) {
        e.preventDefault();
        next();
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep()) return;

      // Collect data (ready to wire up to a backend / CRM / email service)
      var data = Object.fromEntries(new FormData(form).entries());
      // For now we just log it; replace with a fetch() to your endpoint.
      console.log("Compass Claw lead submitted:", data);

      // Show success state
      navEl.hidden = true;
      steps.forEach(function (s) { s.classList.remove("is-active"); });
      progressBar.style.width = "100%";
      var nameSpan = document.getElementById("successName");
      if (nameSpan && data.name) nameSpan.textContent = data.name.split(" ")[0];
      successEl.hidden = false;
    });

    render();
  })();

  /* ============================================================
     Testimonial carousel
     ============================================================ */
  (function carousel() {
    var track = document.getElementById("carouselTrack");
    if (!track) return;

    var prev = document.querySelector(".carousel-prev");
    var next = document.querySelector(".carousel-next");
    var dotsWrap = document.getElementById("carouselDots");
    var slides = Array.prototype.slice.call(track.children);

    // Build dots
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      b.addEventListener("click", function () { scrollToSlide(i); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollToSlide(i) {
      var slide = slides[i];
      if (slide) {
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
      }
    }

    function activeIndex() {
      var center = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      slides.forEach(function (s, i) {
        var sc = s.offsetLeft - track.offsetLeft + s.clientWidth / 2;
        var d = Math.abs(sc - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    function updateDots() {
      var idx = activeIndex();
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { updateDots(); ticking = false; });
        ticking = true;
      }
    });

    if (prev) prev.addEventListener("click", function () { scrollToSlide(Math.max(0, activeIndex() - 1)); });
    if (next) next.addEventListener("click", function () { scrollToSlide(Math.min(slides.length - 1, activeIndex() + 1)); });

    // Video thumbs: placeholder behavior — wire up to real video later
    track.querySelectorAll(".video-thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        alert("Video testimonial coming soon — drop your real clips in here!");
      });
    });

    updateDots();
  })();

  /* ============================================================
     Animated stat counters (on scroll into view)
     ============================================================ */
  (function stats() {
    var nums = Array.prototype.slice.call(document.querySelectorAll(".stat-number"));
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
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  })();

})();
