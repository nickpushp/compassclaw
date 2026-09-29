(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var business = config.business || {};
  var contact = config.contact || {};
  var seo = config.seo || {};
  var hero = config.hero || {};

  function each(selector, callback) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), callback);
  }

  function setText(selector, value, index) {
    if (value === undefined || value === null || value === "") {
      return;
    }
    var elements = document.querySelectorAll(selector);
    if (index === undefined) {
      each(selector, function (element) {
        element.textContent = value;
      });
    } else if (elements[index]) {
      elements[index].textContent = value;
    }
  }

  function setAttribute(selector, attribute, value) {
    if (!value) {
      return;
    }
    each(selector, function (element) {
      element.setAttribute(attribute, value);
    });
  }

  function setLink(selector, value) {
    setAttribute(selector, "href", value);
  }

  function setPhone(selector, label, href) {
    each(selector, function (element) {
      var labelElement = element.querySelector("span");
      if (labelElement) {
        labelElement.textContent = label;
      } else {
        element.textContent = label;
      }
      if (href) {
        element.setAttribute("href", "tel:" + href);
      }
    });
  }

  function setMeta(selector, value) {
    if (!value) {
      return;
    }
    var element = document.querySelector(selector);
    if (element) {
      element.setAttribute("content", value);
    }
  }

  function updateJsonLd() {
    var element = document.querySelector('script[type="application/ld+json"]');
    if (!element) {
      return;
    }
    try {
      var schema = JSON.parse(element.textContent);
      var graph = schema["@graph"] || [];
      graph.forEach(function (item) {
        if (item.name !== undefined) {
          item.name = business.name;
        }
        if (item.url !== undefined && seo.canonicalUrl) {
          item.url = seo.canonicalUrl;
        }
        if (item.description !== undefined && seo.description) {
          item.description = seo.description;
        }
        if (item.telephone && contact.phoneHref) {
          item.telephone = [contact.phoneHref];
        }
        if (item.email && contact.email) {
          item.email = contact.email;
        }
        if (item.address && contact.address) {
          item.address = [{
            "@type": "PostalAddress",
            streetAddress: contact.address,
            addressCountry: "US"
          }];
        }
      });
      element.textContent = JSON.stringify(schema);
    } catch (error) {
      console.warn("Could not update structured data.", error);
    }
  }

  function updateServices() {
    var services = config.services || [];
    each(".header__service > span:last-child", function (element, index) {
      if (services[index]) {
        element.textContent = services[index];
      }
    });
    each(".services__card-name, .services__card-title", function (element, index) {
      if (services[index]) {
        element.textContent = services[index];
      }
    });
  }

  function updateLocations() {
    var areas = (config.locations && config.locations.areas) || [];
    each(".header__area", function (area, areaIndex) {
      var data = areas[areaIndex];
      if (!data) {
        return;
      }
      setText(".header__area-title", data.name, 0);
      each(".header__cities", function (list, listIndex) {
        if (listIndex !== areaIndex) {
          return;
        }
        each(".header__city", function (city, cityIndex) {
          if (data.cities && data.cities[cityIndex]) {
            city.textContent = data.cities[cityIndex];
          }
        });
      });
    });
    each(".locations__region-name", function (element, index) {
      if (areas[index] && areas[index].name) {
        element.textContent = areas[index].name;
      }
    });
  }

  function updateTestimonials() {
    var testimonials = config.testimonials || [];
    each(".rcard__name", function (element, index) {
      if (testimonials[index] && testimonials[index].name) {
        element.textContent = testimonials[index].name;
      }

      function updateReviewSummary() {
        var summary = config.reviewSummary || {};
        if (summary.countLabel) {
          each(".rbadge__count", function (element) {
            element.textContent = summary.countLabel;
          });
        }
      }
    });
    each(".rcard__text", function (element, index) {
      if (testimonials[index] && testimonials[index].text) {
        element.textContent = testimonials[index].text;
      }
    });
  }

  function updateOffices() {
    var offices = (config.locations && config.locations.footerOffices) || [];
    each(".footer__office", function (office, index) {
      var data = offices[index];
      if (!data) {
        return;
      }
      var address = office.querySelector(".footer__row-text");
      if (address && data.address) {
        address.textContent = data.address;
      }
      var addressLink = office.querySelector(".footer__row--fill");
      if (addressLink && data.mapUrl) {
        addressLink.setAttribute("href", data.mapUrl);
      }
      var phone = office.querySelector('a[href^="tel:"]');
      if (phone && data.phone) {
        phone.setAttribute("href", "tel:" + data.phoneHref);
        var phoneText = phone.querySelector(".footer__row-text");
        if (phoneText) {
          phoneText.textContent = data.phone;
        }
      }
    });
  }

  function updateColors() {
    var variables = (config.colors && config.colors.cssVariables) || {};
    Object.keys(variables).forEach(function (name) {
      if (variables[name]) {
        document.documentElement.style.setProperty(name, variables[name]);
      }
    });
  }

  function applyConfig() {
    document.title = seo.title || document.title;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[property="og:site_name"]', business.name);
    setMeta('meta[property="og:url"]', seo.canonicalUrl);
    setMeta('meta[property="og:image"]', seo.ogImage);
    setLink('link[rel="canonical"]', seo.canonicalUrl);

    setAttribute(".header__logo-text, .header__logo-mobile, .footer__logo", "alt", business.name);
    setAttribute(".header__logo", "aria-label", business.name + " - home");
    setLink(".header__logo, .footer__logo-link", business.websiteUrl);

    setText(".header__strip-text", contact.hours, 0);
    setText(".header__phone span, .faq__phone-number, .locations__phone, .services__phone", contact.phone);
    setPhone(".header__phone, .faq__phone, .locations__phone, .services__phone", contact.phone, contact.phoneHref);
    setText(".footer__row-text--email", contact.email);
    each(".footer__row-text--email", function (element) {
      var emailLink = element.closest("a");
      if (emailLink) {
        emailLink.setAttribute("href", "mailto:" + contact.email);
      }
    });

    setText(".hero__title", hero.title || business.name);
    setText(".hero__eyebrow", hero.eyebrow || business.name);
    setText(".hero__form-title", hero.formTitle);
    setText(".hero__display-line", hero.displayLines && hero.displayLines[0], 0);
    setText(".hero__display-line", hero.displayLines && hero.displayLines[1], 1);
    setText(".hero__display-line", hero.displayLines && hero.displayLines[2], 2);
    setText(".header__cta span", hero.primaryCta);
    setText(".header__sheet-quote", hero.secondaryCta);
    setText(".hero__submit span", hero.primaryCta);
    setText(".locations__prompt-text--wide, .hero__meta-text", business.tagline);

    setAttribute(".hero__photo", "alt", business.name + " " + business.niche);
    if (config.assets && config.assets.heroImageUrl) {
      setAttribute(".hero__photo", "src", config.assets.heroImageUrl);
    }
    if (config.assets && config.assets.logoUrl) {
      setAttribute(".header__logo-text, .header__logo-mobile, .footer__logo", "src", config.assets.logoUrl);
    }

    updateServices();
    updateLocations();
    updateTestimonials();
    updateReviewSummary();
    updateOffices();
    updateJsonLd();
    updateColors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyConfig);
  } else {
    applyConfig();
  }
})();
