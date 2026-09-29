(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var services = config.serviceDetails || [
    {
      category: "towing",
      badge: "24/7 Response",
      title: "Emergency Towing",
      description: "Fast local towing when your vehicle is disabled, unsafe to drive, or needs immediate transport.",
      image: "assets/mg-services/lucid-origin_Close-up_hands_of_technician_using_digital_ESR_meter_and_capacitance_tester_on_c-0.jpg",
      features: ["Local and emergency dispatch", "Clear arrival updates", "Careful vehicle handling"]
    },
    {
      category: "roadside",
      badge: "Roadside Help",
      title: "Roadside Assistance",
      description: "Practical roadside support to help you get safely unstuck and back on the road.",
      image: "assets/mg-services/lucid-origin_A_close-up_high-detail_photograph_of_a_heavy_industrial_AC_electric_motor_disass-0.jpg",
      features: ["Dispatch to your location", "Safety-first service", "Straightforward communication"]
    },
    {
      category: "roadside",
      badge: "Quick Response",
      title: "Jump Starts & Lockouts",
      description: "Get help with a dead battery or locked vehicle when you need a fast, reliable response.",
      image: "assets/mg-services/lucid-origin_Residential_furnace_blower_motor_replacement_in_progress_ECM_variable_speed_moto-0.jpg",
      features: ["Battery jump starts", "Vehicle lockout assistance", "Help assessing next steps"]
    },
    {
      category: "towing",
      badge: "Vehicle Transport",
      title: "Flatbed Towing",
      description: "Secure vehicle transport for cars, SUVs, specialty vehicles, and situations requiring extra care.",
      image: "assets/mg-services/gpt-image-2_Electric_motor_repair_shop_Koch_s_Electric_inventory_showroom_rows_of_NEMA_and_I-0.jpg",
      features: ["Stable flatbed transport", "Careful loading", "Pickup and destination coordination"]
    },
    {
      category: "recovery",
      badge: "Accident Support",
      title: "Accident Recovery",
      description: "Coordinated towing after a collision with clear communication and careful vehicle recovery.",
      image: "assets/mg-services/lucid-origin_Jet_pump_motor_and_submersible_pump_motor_on_test_bench_pressure_gauge_reading_w-0.jpg",
      features: ["Scene-safe recovery", "Impound or shop delivery", "Insurance-ready information"]
    },
    {
      category: "roadside",
      badge: "Convenient Service",
      title: "Fuel & Flat Tire Assistance",
      description: "Get practical help when you run out of fuel or need assistance with a flat tire.",
      image: "assets/mg-services/lucid-origin_Predictive_maintenance_scene_vibration_analyzer_sensor_mounted_on_large_industri-0.jpg",
      features: ["Fuel delivery", "Tire-change assistance", "Safe roadside response"]
    }
  ];

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

  function render() {
    var section = document.querySelector(".services");
    var body = section && section.querySelector(".services__body");
    if (!section || !body) {
      return;
    }

    section.classList.add("services--template-1");
    var business = config.business || {};
    var contact = config.contact || {};
    var serviceType = business.niche || "towing";
    var businessName = business.name || "Our shop";
    var cards = services.length ? services : [];

    body.innerHTML =
      '<div class="template-1-services-inner">' +
        '<div class="template-1-services-intro">' +
          '<span class="template-1-kicker">What We Do</span>' +
          '<h2 class="template-1-services-title">Whatever your ' +
            escapeHtml(serviceType.toLowerCase()) +
            ' needs, <span class="template-1-gradient-text">we handle it.</span></h2>' +
          '<p class="template-1-services-description">From emergency dispatch to planned vehicle transport, ' +
            escapeHtml(businessName) +
            ' delivers dependable workmanship with clear answers and practical next steps.</p>' +
        '</div>' +
        '<div class="template-1-services-grid">' +
          cards.map(function (service) {
            return '<article class="template-1-service-card" data-service-category="' + escapeHtml(service.category) + '">' +
              '<div class="template-1-service-image">' +
                '<img src="' + escapeHtml(service.image) + '" alt="' + escapeHtml(service.title) + '">' +
                '<span class="template-1-service-badge">' + escapeHtml(service.badge) + '</span>' +
                '<button type="button" class="template-1-quote" data-service-quote="' + escapeHtml(service.title) + '">Get Quote</button>' +
              '</div>' +
              '<div class="template-1-service-content">' +
                '<h3 class="template-1-service-title">' + escapeHtml(service.title) + '</h3>' +
                '<p class="template-1-service-description">' + escapeHtml(service.description) + '</p>' +
                '<details class="template-1-service-details"><summary>What this includes</summary><ul class="template-1-service-features">' +
                  service.features.map(function (feature) {
                    return '<li>' + escapeHtml(feature) + '</li>';
                  }).join("") +
                '</ul></details>' +
              '</div>' +
            '</article>';
          }).join("") +
        '</div>' +
      '</div>';

    body.addEventListener("click", function (event) {
      var quote = event.target.closest("[data-service-quote]");
      if (quote) {
        var title = quote.getAttribute("data-service-quote");
        var phone = contact.phoneHref || "";
        if (phone) {
          window.location.href = "tel:" + phone;
        } else {
          window.location.hash = "contact";
        }
        window.dispatchEvent(new CustomEvent("templateServiceQuote", { detail: { service: title } }));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
