(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  function render() {
    var config = window.SITE_CONFIG || {};
    var business = config.business || {};
    var contact = config.contact || {};
    var faqs = config.faqs || [];
    var integrations = config.integrations || {};
    var old = document.querySelector("#faq");
    if (old) {
      old.remove();
    }

    var section = document.createElement("section");
    section.id = "faq";
    section.className = "swayze-faq";
    section.innerHTML =
      '<div class="swayze-faq__inner">' +
        '<div class="swayze-faq__header">' +
          '<span class="swayze-faq__kicker">? &nbsp; Good to know</span>' +
          '<h2>Questions, <span>answered.</span></h2>' +
          '<p>Everything you need to know before you request towing or roadside assistance from ' + escapeHtml(business.name || "Swayze Towing") + '.</p>' +
        '</div>' +
        '<label class="swayze-faq__search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search towing questions..." aria-label="Search frequently asked questions"></label>' +
        '<div class="swayze-faq__list"></div>' +
        '<div class="swayze-faq__cta"><div><strong>Need help choosing the right service?</strong><span>Our dispatch team can answer questions and coordinate your next step.</span></div><div class="swayze-faq__cta-actions"><a href="' + escapeHtml(integrations.calendarUrl || "#contact") + '" target="_blank" rel="noopener">Schedule Service</a><a class="swayze-faq__phone" href="tel:' + escapeHtml(contact.phoneHref || "") + '">Call ' + escapeHtml(contact.phone || "now") + '</a></div></div>' +
      '</div>';

    var anchor = document.querySelector(".swayze-site-footer") || document.body.lastElementChild;
    document.body.insertBefore(section, anchor);
    var list = section.querySelector(".swayze-faq__list");
    var input = section.querySelector("input");

    function draw(query) {
      var normalized = String(query || "").toLowerCase().trim();
      var matches = faqs.filter(function (faq) {
        return !normalized || (faq.q + " " + faq.a).toLowerCase().indexOf(normalized) !== -1;
      });
      list.innerHTML = matches.length ? matches.map(function (faq, index) {
        return '<details class="swayze-faq__item"' + (index === 0 && !normalized ? " open" : "") + '><summary><span class="swayze-faq__question-icon">✦</span><span>' + escapeHtml(faq.q) + '</span><span class="swayze-faq__chevron">⌄</span></summary><p>' + escapeHtml(faq.a) + '</p></details>';
      }).join("") : '<p class="swayze-faq__empty">No matching questions found. Call ' + escapeHtml(contact.phone || "our dispatch team") + ' for a quick answer.</p>';
    }

    input.addEventListener("input", function () { draw(input.value); });
    draw("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
