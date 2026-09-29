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
    var area = business.serviceArea || "the local area";
    var phoneHref = contact.phoneHref || "";
    var phone = contact.phone || "";
    var section = document.createElement("section");
    section.id = "about";
    section.className = "swayze-about";
    section.innerHTML =
      '<div class="swayze-about__inner">' +
        '<div class="swayze-about__media">' +
          '<div class="swayze-about__image-frame">' +
            '<img src="assets/8c687a14-process-crew-truck.webp" alt="Process Crew Truck" />' +
            '<div class="swayze-about__media-card"><strong>' + escapeHtml(business.name || "Swayze Towing") + '</strong><span>Licensed &amp; Insured</span></div>' +
          '</div>' +
          '<div class="swayze-about__badge"><span class="swayze-about__badge-icon">★</span><span><strong>24/7</strong><small>Roadside response</small></span></div>' +
        '</div>' +
        '<div class="swayze-about__copy">' +
          '<div class="swayze-about__kicker"><span class="swayze-about__kicker-icon">●</span> Who You Are Calling</div>' +
          '<h2>Local help when <span>you need it most.</span></h2>' +
          '<p>When you call <strong>' + escapeHtml(business.name || "Swayze Towing") + '</strong>, you are connecting with a local towing team ready to help across <strong>' + escapeHtml(area) + '</strong>.</p>' +
          '<p>From a dead battery to a disabled vehicle, we focus on clear communication, careful handling, and a safe next step without adding stress to an already difficult moment.</p>' +
          '<div class="swayze-about__checks">' +
            '<div>✓ Fast local dispatch</div><div>✓ Clear arrival updates</div><div>✓ Careful vehicle handling</div><div>✓ Straightforward pricing</div><div>✓ Towing and roadside support</div><div>✓ Help available 24/7</div>' +
          '</div>' +
          '<div class="swayze-about__contact">' +
            '<div><span>⌖</span><strong>' + escapeHtml(contact.address || area) + '</strong><small>Serving ' + escapeHtml(area) + '</small></div>' +
            '<div><span>☎</span><strong>' + escapeHtml(phone) + '</strong><small>Direct dispatch line</small></div>' +
            '<a href="tel:' + escapeHtml(phoneHref) + '">Call for help</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    var services = document.querySelector(".services");
    if (services && services.parentNode) {
      services.parentNode.insertBefore(section, services);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
