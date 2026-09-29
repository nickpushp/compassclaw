(function () {
  "use strict";
  function guard() {
    document.documentElement.classList.add("swayze-content-guard");
    if (document.body) {
      document.body.classList.add("swayze-content-guard");
    }
  }
  guard();
  document.addEventListener("DOMContentLoaded", guard);
})();
