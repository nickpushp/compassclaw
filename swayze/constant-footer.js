(function () {
  "use strict";

  function renderConstantFooter() {
    var config = window.SITE_CONFIG || {};
    var business = config.business || {};
    var contact = config.contact || {};
    var existing = document.querySelector(".mg-constant-footer");

    if (existing) {
      existing.remove();
    }

    var footer = document.createElement("aside");
    footer.className = "mg-constant-footer";
    footer.setAttribute("aria-label", "Quick actions");
    footer.innerHTML =
      '<div class="mg-constant-footer__inner">' +
        '<div class="mg-constant-footer__identity">' +
          '<span>' + escapeHtml(business.name || "Swayze Towing") + '</span>' +
          '<span class="mg-constant-footer__address">· ' + escapeHtml(contact.address || "") + '</span>' +
        '</div>' +
        '<div class="mg-constant-footer__actions">' +
          '<button class="mg-constant-footer__button" type="button" data-mg-footer-quote>Request Service</button>' +
          '<a class="mg-constant-footer__phone" href="tel:' + escapeHtml(contact.phoneHref || "") + '">' +
            '<span aria-hidden="true">☎</span>' +
            '<span>Call ' + escapeHtml(contact.phone || "") + '</span>' +
          '</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(footer);
    footer.querySelector("[data-mg-footer-quote]").addEventListener("click", function () {
      var target = document.querySelector(".hero__form, form, .contact, #contact");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.location.href = "tel:" + (contact.phoneHref || "");
      }
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character];
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderConstantFooter);
  } else {
    renderConstantFooter();
  }
})();
