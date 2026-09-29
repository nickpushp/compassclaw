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
    var integrations = config.integrations || {};
    var section = document.createElement("section");
    section.className = "swayze-review-capture";
    section.innerHTML =
      '<div class="swayze-review-capture__inner">' +
        '<h2>How did we do?</h2>' +
        '<p>Your feedback helps ' + escapeHtml(business.name || "our team") + ' improve every customer experience.</p>' +
        '<div class="swayze-review-capture__stars" role="group" aria-label="Rate your experience">' +
          [1, 2, 3, 4, 5].map(function (rating) {
            return '<button class="swayze-review-capture__star" type="button" data-review-rating="' + rating + '" aria-label="' + rating + ' star' + (rating === 1 ? "" : "s") + '">' + rating + ' ★</button>';
          }).join("") +
        '</div>' +
        '<div class="swayze-review-capture__response" aria-live="polite"></div>' +
      '</div>';
    document.body.appendChild(section);

    section.addEventListener("click", function (event) {
      var button = event.target.closest("[data-review-rating]");
      if (!button) {
        return;
      }
      var rating = Number(button.getAttribute("data-review-rating"));
      var response = section.querySelector(".swayze-review-capture__response");
      if (rating >= 4) {
        if (integrations.googleReviewUrl) {
          response.innerHTML = "<p>Thanks for the great feedback. Please share it publicly on Google.</p><a class=\"swayze-review-capture__submit\" href=\"" + escapeHtml(integrations.googleReviewUrl) + "\" target=\"_blank\" rel=\"noopener\">Leave a Google review</a>";
        } else {
          response.innerHTML = "<p>Thanks for the great feedback. The Google review link will be added once the client supplies it.</p>";
        }
        return;
      }
      response.innerHTML =
        '<form class="swayze-review-capture__feedback">' +
          '<label>What could we improve?<textarea name="feedback" required></textarea></label>' +
          '<input type="hidden" name="rating" value="' + rating + '">' +
          '<button class="swayze-review-capture__submit" type="submit">Send private feedback</button>' +
          '<span class="swayze-review-capture__status" hidden></span>' +
        "</form>";
      response.querySelector("textarea").focus();
    });

    section.addEventListener("submit", function (event) {
      if (!event.target.matches(".swayze-review-capture__feedback")) {
        return;
      }
      event.preventDefault();
      var form = event.target;
      var status = form.querySelector(".swayze-review-capture__status");
      if (integrations.privateFeedbackEndpoint) {
        fetch(integrations.privateFeedbackEndpoint, { method: "POST", body: new FormData(form) })
          .then(function () {
            status.textContent = "Thanks. Your feedback was sent privately to the team.";
            status.hidden = false;
          })
          .catch(function () {
            status.textContent = "We could not send this online. Please call the team directly.";
            status.hidden = false;
          });
      } else {
        status.textContent = "Thanks. This demo captured your private feedback locally.";
        status.hidden = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
