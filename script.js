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

  /* Carousel: a paged, swipeable list of what we've built */
  var track = document.getElementById("carouselTrack");
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById("carouselDots");
    var prevBtn = document.querySelector(".carousel-arrow.prev");
    var nextBtn = document.querySelector(".carousel-arrow.next");
    var activeIndex = 0;

    var dots = slides.map(function (slide) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show: " + (slide.querySelector(".slide-title") || {}).textContent);
      dot.addEventListener("click", function () {
        slide.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
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
      slides[next].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
    };
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(1); });
  }
})();
