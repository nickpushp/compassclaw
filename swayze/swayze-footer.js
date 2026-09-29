(function () {
  "use strict";
  window.__swayzeFooterLoaded = true;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  function render() {
    window.__swayzeFooterRenderAttempted = true;
    try {
    if (document.querySelector(".swayze-site-footer")) {
      return;
    }
    var config = window.SITE_CONFIG || {};
    var business = config.business || {};
    var contact = config.contact || {};
    var integrations = config.integrations || {};
    var social = config.social || {};
    var name = business.name || "Swayze Towing";
    var area = business.serviceArea || "[CLIENT SERVICE AREA REQUIRED]";
    var phone = contact.phone || "[CLIENT PHONE REQUIRED]";
    var phoneHref = contact.phoneHref || "";
    var address = contact.address || "[CLIENT ADDRESS REQUIRED]";
    var hours = contact.hours || "[CLIENT HOURS REQUIRED]";
    document.querySelectorAll("body > footer.footer").forEach(function (footer) {
      footer.remove();
    });
    var root = document.createElement("footer");
    root.className = "swayze-site-footer";
    root.innerHTML =
      '<div class="swayze-site-footer__inner">' +
        '<div class="swayze-site-footer__grid">' +
          '<div>' +
            '<div class="swayze-site-footer__brand">' +
              '<div class="swayze-site-footer__mark" aria-hidden="true">S</div>' +
              '<div><div class="swayze-site-footer__brand-name">Swayze <span>Towing</span></div>' +
                '<div class="swayze-site-footer__brand-meta"><span>TOWING</span><i class="swayze-site-footer__dot"></i><span>' + escapeHtml(area) + '</span></div>' +
              '</div>' +
            '</div>' +
            '<p class="swayze-site-footer__description">Reliable towing and roadside assistance with clear communication, careful vehicle handling, and help when you need it most.</p>' +
            '<div class="swayze-site-footer__badges"><span class="swayze-site-footer__badge">Licensed &amp; Insured</span><span class="swayze-site-footer__badge swayze-site-footer__badge--green">Roadside Ready</span></div>' +
          '</div>' +
          '<div>' +
            '<h4 class="swayze-site-footer__heading">Contact Information</h4>' +
            '<ul class="swayze-site-footer__list">' +
              '<li><span class="swayze-site-footer__label">Service Area / Address:</span><span class="swayze-site-footer__value">' + escapeHtml(address) + '</span></li>' +
              '<li><span class="swayze-site-footer__label">Phone:</span><a class="swayze-site-footer__phone" href="tel:' + escapeHtml(phoneHref) + '">' + escapeHtml(phone) + '</a></li>' +
              '<li><span class="swayze-site-footer__label">Hours of Operation:</span><span class="swayze-site-footer__hours">' + escapeHtml(hours) + '</span></li>' +
            '</ul>' +
          '</div>' +
          '<div><h4 class="swayze-site-footer__heading">Quick Links</h4><ul class="swayze-site-footer__list">' +
            '<li><a href="#services">Towing Services</a></li><li><a href="#contact">Get Help Now</a></li><li><a href="#faq">FAQ</a></li><li><a href="#reviews">Customer Reviews</a></li>' +
          '</ul></div>' +
          '<div><h4 class="swayze-site-footer__heading">' + escapeHtml(area) + '</h4><ul class="swayze-site-footer__list"><li>Emergency towing</li><li>Roadside assistance</li><li>Accident recovery</li><li>Flatbed transport</li><li>Jump starts and lockouts</li></ul></div>' +
        '</div>' +
        '<div class="swayze-site-footer__bottom"><p>© 2026 ' + escapeHtml(name) + '. All rights reserved.</p><div class="swayze-site-footer__legal"><a href="pages/contact.html">Contact</a><span>•</span><a href="' + escapeHtml(integrations.googleReviewUrl || "#") + '">Reviews</a><span>•</span><span>Licensed &amp; Insured</span></div></div>' +
        '<div class="swayze-site-footer__social" aria-label="Social media links">' +
          socialLink("Facebook", social.facebook) + socialLink("Instagram", social.instagram) + socialLink("YouTube", social.youtube) + socialLink("TikTok", social.tiktok) +
        "</div>" +
      '</div>';
      document.body.appendChild(root);
    } catch (error) {
      window.__swayzeFooterError = String(error && error.message || error);
    }

    function socialLink(label, href) {
      var icons = {
        Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v8h4v-8h3.3l.7-4H13V9c0-.7.3-1 1-1Z"/></svg>',
        Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" class="swayze-icon-fill"/></svg>',
        YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8Z"/><path class="swayze-icon-cutout" d="m10 15.5 5-3.5-5-3.5v7Z"/></svg>',
        TikTok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h3.1c.2 1.5 1.1 2.8 2.4 3.6v3.1a8.2 8.2 0 0 1-2.4-.7v6.2a5.8 5.8 0 1 1-5.8-5.8c.4 0 .8 0 1.2.1v3.2a2.7 2.7 0 1 0 1.5 2.5V3Z"/></svg>'
      };
      return '<a class="swayze-site-footer__social-link" href="' + escapeHtml(href || "#") + '"' + (href ? ' target="_blank" rel="noopener"' : "") + ' aria-label="' + label + '">' + icons[label] + "</a>";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.setInterval(function () {
        if (!document.querySelector(".swayze-site-footer")) {
          render();
        }
      }, 500);
    });
  } else {
    render();
    window.setInterval(function () {
      if (!document.querySelector(".swayze-site-footer")) {
        render();
      }
    }, 500);
  }
})();
