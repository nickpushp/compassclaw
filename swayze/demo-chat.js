(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var business = config.business || {};
  var contact = config.contact || {};
  var integrations = config.integrations || {};
  var root;
  var messages;

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

  function addMessage(text, type) {
    if (!messages) {
      return;
    }
    var message = document.createElement("div");
    message.className = "mg-demo-chat__message mg-demo-chat__message--" + type;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function openChat() {
    root.classList.add("is-open");
    root.classList.remove("is-visible");
    root.querySelector(".mg-demo-chat__input").focus();
  }

  function render() {
    root = document.createElement("div");
    root.className = "mg-demo-chat";
    root.setAttribute("aria-label", "Demo chat");
    root.innerHTML =
      '<button class="mg-demo-chat__bubble" type="button" aria-label="Open chat">' +
        '<span aria-hidden="true">💬</span>' +
        '<span class="mg-demo-chat__bubble-label">Have a question? Chat with us.</span>' +
      '</button>' +
      '<section class="mg-demo-chat__panel" aria-label="Chat with ' + escapeHtml(business.name || "our team") + '">' +
        '<header class="mg-demo-chat__header">' +
          '<div class="mg-demo-chat__brand">' +
            '<span class="mg-demo-chat__avatar" aria-hidden="true">S</span>' +
            '<div><div class="mg-demo-chat__name">' + escapeHtml(business.name || "Towing team") + '</div><div class="mg-demo-chat__status">' + (integrations.aiChatEndpoint ? "Online" : "Demo chat · Online") + '</div></div>' +
          '</div>' +
          '<a class="mg-demo-chat__call" href="tel:' + escapeHtml(contact.phoneHref || "") + '" aria-label="Call ' + escapeHtml(business.name || "the towing team") + '">' +
            '<span aria-hidden="true">☎</span><span>Call</span>' +
          '</a>' +
          '<button class="mg-demo-chat__close" type="button" aria-label="Close chat">×</button>' +
        '</header>' +
        '<div class="mg-demo-chat__messages" aria-live="polite"></div>' +
        '<div class="mg-demo-chat__welcome">Fast answers for towing, roadside assistance, and service scheduling.</div>' +
        '<div class="mg-demo-chat__actions">' +
        '<button class="mg-demo-chat__appointment" type="button">Schedule Service</button>' +
        '<a class="mg-demo-chat__call-action" href="tel:' + escapeHtml(contact.phoneHref || "") + '"><span aria-hidden="true">☎</span> Call Dispatch</a>' +
        '</div>' +
        '<form class="mg-demo-chat__form">' +
          '<input class="mg-demo-chat__input" type="text" autocomplete="off" placeholder="Type a message...">' +
          '<button class="mg-demo-chat__send" type="submit">Send</button>' +
        '</form>' +
      '</section>';

    document.body.appendChild(root);
    messages = root.querySelector(".mg-demo-chat__messages");
    addMessage("Hi! I can help with towing, roadside assistance, or scheduling service. What happened?", "agent");

    root.querySelector(".mg-demo-chat__bubble").addEventListener("click", openChat);
    root.querySelector(".mg-demo-chat__close").addEventListener("click", function () {
      root.classList.remove("is-open");
    });
    root.querySelector(".mg-demo-chat__form").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = root.querySelector(".mg-demo-chat__input");
      var value = input.value.trim();
      if (!value) {
        return;
      }
      addMessage(value, "user");
      input.value = "";
      if (integrations.aiChatEndpoint) {
        fetch(integrations.aiChatEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: value, source: "chat" }) })
          .then(function (response) { return response.json(); })
          .then(function (payload) { addMessage(payload.reply || "Thanks. A team member will follow up shortly.", "agent"); })
          .catch(function () { addMessage("We could not connect right now. Please call " + (contact.phone || "the towing team") + ".", "agent"); });
      } else {
        window.setTimeout(function () {
          addMessage("Thanks! This demo chat is ready to connect to the approved AI provider. A team member can follow up with you.", "agent");
        }, 450);
      }
    });
    root.querySelector(".mg-demo-chat__appointment").addEventListener("click", function () {
      addMessage("I would like to schedule service.", "user");
      window.setTimeout(function () {
        if (integrations.calendarUrl) {
          addMessage("Choose a service time here: " + integrations.calendarUrl, "agent");
          window.open(integrations.calendarUrl, "_blank", "noopener");
        } else {
          addMessage("Appointment booking will connect to the approved calendar here. For now, call " + (contact.phone || "our towing team") + ".", "agent");
        }
      }, 350);
      window.dispatchEvent(new CustomEvent("demoAppointmentRequest"));
    });

    window.setTimeout(function () {
      root.classList.add("is-visible");
    }, 4500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
