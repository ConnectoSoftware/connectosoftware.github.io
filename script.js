(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll-reveal: the only entrance animation on this page */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    Array.prototype.forEach.call(revealEls, function (el) {
      observer.observe(el);
    });
  }

  /* Thread marker: tracks reading position down the page, like a bookmark ribbon */
  var marker = document.querySelector(".thread-marker");
  if (marker) {
    var ticking = false;
    var updateMarker = function () {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var maxScroll = doc.scrollHeight - doc.clientHeight;
      var progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
      marker.style.top = (progress * 100) + "%";
      ticking = false;
    };
    var requestTick = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateMarker);
      }
    };
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    updateMarker();
  }
})();
