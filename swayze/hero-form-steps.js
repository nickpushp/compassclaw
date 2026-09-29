(function () {
  "use strict";

  /*
   * NICHE EDITING GUIDE:
   * Step 1 should ask what service is needed and where the customer is located.
   * Step 2 should collect the minimum callback details.
   * Step 3 can use date/time, symptoms, project details, or any optional qualifier.
   * Change the option labels and field labels below for HVAC, plumbing, electrical, etc.
   */
  var form;
  var currentStep = 1;
  var totalSteps = 3;

  function field(label, name, type, options) {
    options = options || {};
    var input;
    if (type === "select") {
      input = '<select class="hero__field-input hero__field-select" name="' + name + '"' +
        (options.required ? " required" : "") + '><option value="" selected disabled hidden></option>' +
        options.options.map(function (option) {
          return '<option value="' + option.value + '">' + option.label + "</option>";
        }).join("") + "</select>";
    } else if (type === "textarea") {
      input = '<textarea class="hero__field-input hero__field-textarea" name="' + name + '"' +
        (options.required ? " required" : "") + ' placeholder=" " maxlength="500"></textarea>';
    } else {
      input = '<input class="hero__field-input" type="' + type + '" name="' + name + '"' +
        (options.autocomplete ? ' autocomplete="' + options.autocomplete + '"' : "") +
        (options.required ? " required" : "") + ' placeholder=" ">';
    }
    return '<label class="hero__field' + (options.wide ? " hero__field--wide" : "") + '">' +
      input + '<span class="hero__field-label">' + label + "</span></label>";
  }

  function stepMarkup() {
    return (
      '<div class="hero__progress" aria-label="Form progress">' +
        '<span class="hero__progress-step is-active" data-progress-step="1"></span>' +
        '<span class="hero__progress-step" data-progress-step="2"></span>' +
        '<span class="hero__progress-step" data-progress-step="3"></span>' +
        '<span class="hero__progress-label" data-progress-label>Step 1 of 3</span>' +
      "</div>" +
      '<div class="hero__step" data-hero-step="1">' +
        '<div class="hero__form-head"><p class="hero__form-title">Get Towing Help Now</p>' +
          '<p class="hero__step-note">Tell us what happened and where your vehicle is located.</p>' +
          '<div class="hero__fields">' +
            field("Service needed*", "service-needed", "select", { required: true, options: [
              { value: "emergency-towing", label: "Emergency Towing" },
              { value: "roadside-assistance", label: "Roadside Assistance" },
              { value: "flatbed-towing", label: "Flatbed Towing" },
              { value: "accident-recovery", label: "Accident Recovery" },
              { value: "jump-start", label: "Jump Start or Lockout" },
              { value: "flat-tire", label: "Flat Tire Assistance" }
            ] }) +
            field("ZIP code or address*", "location", "text", { required: true, autocomplete: "postal-code", wide: true }) +
          "</div>" +
        "</div>" +
        actions("Next") +
      "</div>" +
      '<div class="hero__step" data-hero-step="2" hidden>' +
        '<div class="hero__form-head"><p class="hero__form-title">Where should we reach you?</p>' +
          '<p class="hero__step-note">We will use these details only to respond to your service request.</p>' +
          '<div class="hero__fields">' +
            field("First name*", "first-name", "text", { required: true, autocomplete: "given-name" }) +
            field("Last name", "last-name", "text", { autocomplete: "family-name" }) +
            field("Mobile number*", "phone", "tel", { required: true, autocomplete: "tel" }) +
          '</div><label class="hero__consent"><input type="checkbox" name="smsConsent" value="yes"> I agree to receive service-related texts. Message frequency varies. Reply STOP to opt out.</label>' +
        "</div>" +
        actions("Next", true) +
      "</div>" +
      '<div class="hero__step" data-hero-step="3" hidden>' +
        '<div class="hero__form-head"><p class="hero__form-title">Help us dispatch you faster</p>' +
          '<p class="hero__step-note">Optional details help us send the right help to the right place.</p>' +
          '<div class="hero__fields">' +
            field("Destination or drop-off location", "destination", "text", { autocomplete: "street-address" }) +
            field("Vehicle details", "vehicle-details", "text", { autocomplete: "off" }) +
            field("How urgent is this?", "urgency", "select", { options: [
              { value: "now", label: "I need help now" },
              { value: "today", label: "Today" },
              { value: "planning", label: "Planning ahead" }
            ] }) +
            field("Tell us briefly what happened", "description", "textarea", { wide: true }) +
          "</div>" +
        "</div>" +
        actions("Get Towing Help", true, true) +
      "</div>" +
      '<div class="hero__trap" aria-hidden="true"><label>Company website<input type="text" name="company-website" tabindex="-1" autocomplete="off"></label></div>' +
      '<input type="hidden" name="lead-source" value="hero-towing">' +
      '<p class="hero__form-status" role="status" hidden></p>'
    );
  }

  function actions(label, includeBack, submit) {
    return '<div class="hero__actions' + (includeBack ? " hero__actions--split" : "") + '">' +
      (includeBack ? '<button class="hero__prev" type="button" data-hero-prev><img class="hero__prev-arrow" width="16" height="11" alt="" aria-hidden="true" src="assets/1f653c3d-hero-arrow-1.svg"><span>Back</span></button>' : "") +
      '<button class="hero__submit" type="' + (submit ? "submit" : "button") + '"' + (submit ? "" : ' data-hero-next') + '><span>' + label + '</span><img class="hero__submit-arrow" width="16" height="11" alt="" aria-hidden="true" src="assets/1f653c3d-hero-arrow-1.svg"></button>' +
      "</div>";
  }

  function updateStep() {
    form.querySelectorAll("[data-hero-step]").forEach(function (step) {
      step.hidden = Number(step.getAttribute("data-hero-step")) !== currentStep;
    });
    form.querySelectorAll("[data-progress-step]").forEach(function (progress) {
      var number = Number(progress.getAttribute("data-progress-step"));
      progress.classList.toggle("is-active", number === currentStep);
      progress.classList.toggle("is-complete", number < currentStep);
    });
    form.querySelector("[data-progress-label]").textContent = "Step " + currentStep + " of " + totalSteps;
  }

  function validateCurrentStep() {
    var step = form.querySelector('[data-hero-step="' + currentStep + '"]');
    var valid = true;
    step.querySelectorAll("[required]").forEach(function (input) {
      var wrapper = input.closest(".hero__field");
      var filled = input.value.trim() !== "";
      if (input.type === "tel") {
        filled = input.value.replace(/\D/g, "").length >= 7;
      }
      wrapper.classList.toggle("is-error", !filled);
      if (!filled) {
        valid = false;
      }
    });
    if (!valid) {
      var firstError = step.querySelector(".is-error .hero__field-input");
      if (firstError) {
        firstError.focus();
      }
    }
    return valid;
  }

  function submitDemo(event) {
    event.preventDefault();
    if (!validateCurrentStep()) {
      return;
    }
    var status = form.querySelector(".hero__form-status");
    var siteConfig = window.SITE_CONFIG || {};
    var integrations = siteConfig.integrations || {};
    var endpoint = integrations.leadEndpoint;
    var payload = Object.fromEntries(new FormData(form).entries());
    window.dispatchEvent(new CustomEvent("swayzeLeadSubmitted", { detail: payload }));
    if (integrations.instantLeadSmsWebhook) {
      fetch(integrations.instantLeadSmsWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "hero", lead: payload, consent: Boolean(payload.smsConsent) })
      }).catch(function () {});
    }
    if (endpoint) {
      fetch(endpoint, { method: "POST", body: new FormData(form) })
        .then(function () {
          status.textContent = "Thanks — we received your request and will be in touch shortly.";
          status.hidden = false;
        })
        .catch(function () {
          status.textContent = "We could not send the request online. Please call us directly.";
          status.hidden = false;
        });
    } else {
      status.textContent = "Thanks — your service request is ready. Please call us to confirm your appointment.";
      status.hidden = false;
    }
  }

  function initialize() {
    form = document.querySelector("form.hero__form[data-lead-form='hero']");
    if (!form) {
      return;
    }
    form.innerHTML = stepMarkup();
    form.addEventListener("click", function (event) {
      if (event.target.closest("[data-hero-next]")) {
        if (validateCurrentStep() && currentStep < totalSteps) {
          currentStep += 1;
          updateStep();
        }
      }
      if (event.target.closest("[data-hero-prev]") && currentStep > 1) {
        currentStep -= 1;
        updateStep();
      }
    });
    form.addEventListener("submit", submitDemo);
    updateStep();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
