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

  /* Hero tagline: typed in, after the name and underline have animated */
  var typeTarget = document.getElementById("heroTagType");
  if (typeTarget && !reduceMotion) {
    var fullText = typeTarget.textContent;
    typeTarget.textContent = "";
    setTimeout(function () {
      var i = 0;
      var typer = setInterval(function () {
        i++;
        typeTarget.textContent = fullText.slice(0, i);
        if (i >= fullText.length) clearInterval(typer);
      }, 32);
    }, 1300);
  }

  /* Carousel: an auto-advancing deck of what we've built, like slides in a deck */
  var carousel = document.querySelector(".carousel");
  var track = document.getElementById("carouselTrack");
  if (carousel && track) {
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById("carouselDots");
    var prevBtn = document.querySelector(".carousel-arrow.prev");
    var nextBtn = document.querySelector(".carousel-arrow.next");
    var activeIndex = 0;

    var scrollToSlide = function (index) {
      slides[index].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "start", block: "nearest" });
    };

    var dots = slides.map(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show: " + (slide.querySelector(".slide-title") || {}).textContent);
      dot.addEventListener("click", function () {
        scrollToSlide(i);
        pauseThenResume();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    var setActive = function (index) {
      if (index === activeIndex) return;
      activeIndex = index;
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", String(active));
      });
    };

    if ("IntersectionObserver" in window) {
      var slideObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActive(slides.indexOf(entry.target));
            }
          });
        },
        { root: track, threshold: 0.6 }
      );
      slides.forEach(function (slide) { slideObserver.observe(slide); });
    }

    setActive(0);

    var goTo = function (delta) {
      var next = Math.max(0, Math.min(slides.length - 1, activeIndex + delta));
      scrollToSlide(next);
    };
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(-1); pauseThenResume(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(1); pauseThenResume(); });

    /* Auto-advance, looping back to the start; pauses while a visitor is
       looking at or touching the deck, or has the tab in the background. */
    var AUTO_MS = 4500;
    var RESUME_AFTER_MS = 6000;
    var autoTimer = null;
    var resumeTimer = null;

    var stopAuto = function () {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    };
    var startAuto = function () {
      if (reduceMotion || autoTimer || document.hidden) return;
      autoTimer = setInterval(function () {
        var next = (activeIndex + 1) % slides.length;
        scrollToSlide(next);
      }, AUTO_MS);
    };
    var pauseThenResume = function () {
      stopAuto();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAuto, RESUME_AFTER_MS);
    };

    if (!reduceMotion) {
      carousel.addEventListener("mouseenter", stopAuto);
      carousel.addEventListener("mouseleave", startAuto);
      carousel.addEventListener("touchstart", stopAuto, { passive: true });
      carousel.addEventListener("touchend", pauseThenResume);
      carousel.addEventListener("focusin", stopAuto);
      carousel.addEventListener("focusout", startAuto);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopAuto();
        else startAuto();
      });
      startAuto();
    }
  }
})();
