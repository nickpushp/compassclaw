(function () {
  "use strict";

  /*
   * Change the labels/options in this file when the towing intake questions are approved.
   * Keep step 1 focused on service/location, step 2 on contact, and step 3 on dispatch details.
   */
  var form;
  var step = 1;
  var total = 3;

  function input(label, name, type, required) {
    return '<label class="form__field"><input class="form__input" type="' + type + '" name="' + name + '"' +
      (required ? " required" : "") + ' placeholder=" "><span class="form__label">' + label + (required ? " *" : "") + "</span></label>";
  }

  function textarea(label, name) {
    return '<label class="form__field form__field--area"><textarea class="form__input form__area" name="' + name + '" placeholder=" "></textarea><span class="form__label">' + label + "</span></label>";
  }

  function render() {
    form = document.querySelector("form.form__body[data-lead-form='contact']");
    if (!form) {
      return;
    }
    form.innerHTML =
      '<div class="form__head"><h2 class="form__title"><span class="form__title-line">Get Towing Help Now</span></h2>' +
      '<div class="swayze-contact-progress" aria-label="Contact form progress">' +
        '<span class="is-active" data-contact-progress="1"></span><span data-contact-progress="2"></span><span data-contact-progress="3"></span><strong data-contact-progress-label>Step 1 of 3</strong>' +
      "</div></div>" +
      '<div class="form__layout">' +
        '<div class="form__fields" data-contact-step="1">' +
          '<p class="swayze-contact-step-note">What do you need and where are you located?</p>' +
          '<label class="form__field"><select class="form__input" name="service-needed" required><option value="" selected disabled hidden></option><option>Emergency Towing</option><option>Roadside Assistance</option><option>Flatbed Towing</option><option>Accident Recovery</option><option>Jump Start or Lockout</option><option>Flat Tire Assistance</option></select><span class="form__label">Service needed *</span></label>' +
          input("Pickup location", "pickup-location", "text", true) +
        "</div>" +
        '<div class="form__fields" data-contact-step="2" hidden>' +
          '<p class="swayze-contact-step-note">How should the towing team reach you?</p>' +
          input("First name", "first-name", "text", true) +
          input("Mobile number", "phone", "tel", true) +
          '<label class="swayze-contact-consent"><input type="checkbox" name="smsConsent" value="yes"> I agree to receive service-related texts. Reply STOP to opt out.</label>' +
        "</div>" +
        '<div class="form__fields" data-contact-step="3" hidden>' +
          '<p class="swayze-contact-step-note">Optional details help us send the right help.</p>' +
          input("Destination or drop-off location", "destination", "text", false) +
          textarea("Vehicle details or what happened", "message") +
        "</div>" +
        '<div class="form__actions" data-contact-actions><button class="form__submit" type="button" data-contact-next><span>Next</span></button></div>' +
      "</div>" +
      '<input type="hidden" name="lead-source" value="contact-towing"><p class="form__status" role="status" hidden></p>';

    form.addEventListener("click", function (event) {
      if (event.target.closest("[data-contact-next]")) {
        if (!valid()) {
          return;
        }
        if (step < total) {
          step += 1;
          update();
        } else {
          submit();
        }
      }
      if (event.target.closest("[data-contact-back]") && step > 1) {
        step -= 1;
        update();
      }
    });
    update();
  }

  function valid() {
    var current = form.querySelector('[data-contact-step="' + step + '"]');
    var validStep = true;
    current.querySelectorAll("[required]").forEach(function (field) {
      var wrapper = field.closest(".form__field");
      var filled = field.value.trim() !== "";
      wrapper.classList.toggle("is-error", !filled);
      if (!filled) {
        validStep = false;
      }
    });
    return validStep;
  }

  function update() {
    form.querySelectorAll("[data-contact-step]").forEach(function (panel) {
      panel.hidden = Number(panel.getAttribute("data-contact-step")) !== step;
    });
    form.querySelectorAll("[data-contact-progress]").forEach(function (bar) {
      var number = Number(bar.getAttribute("data-contact-progress"));
      bar.classList.toggle("is-active", number === step);
      bar.classList.toggle("is-complete", number < step);
    });
    form.querySelector("[data-contact-progress-label]").textContent = "Step " + step + " of " + total;
    var actions = form.querySelector("[data-contact-actions]");
    actions.innerHTML =
      (step > 1 ? '<button class="form__submit" type="button" data-contact-back><span>Back</span></button>' : "") +
      '<button class="form__submit" type="button" data-contact-next><span>' + (step === total ? "Send Request" : "Next") + "</span></button>";
  }

  function submit() {
    var status = form.querySelector(".form__status");
    var config = window.SITE_CONFIG || {};
    var integrations = config.integrations || {};
    var lead = Object.fromEntries(new FormData(form).entries());
    window.dispatchEvent(new CustomEvent("swayzeLeadSubmitted", { detail: lead }));
    if (integrations.leadEndpoint) {
      fetch(integrations.leadEndpoint, { method: "POST", body: new FormData(form) })
        .then(function () { status.textContent = "Thanks — your request was sent."; status.hidden = false; })
        .catch(function () { status.textContent = "We could not send this online. Please call the towing team."; status.hidden = false; });
    } else {
      status.textContent = "Thanks — your request is ready. The towing team will follow up once contact details are connected.";
      status.hidden = false;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
