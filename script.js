const yearElement = document.getElementById("year");
const brandElement = document.querySelector(".brand");
const logoElement = document.querySelector(".brand-logo");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (brandElement && logoElement) {
  if (logoElement.complete && logoElement.naturalWidth > 0) {
    brandElement.classList.add("has-logo");
  }

  logoElement.addEventListener("load", () => {
    brandElement.classList.add("has-logo");
  });
}

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -30px 0px",
  }
);

revealElements.forEach((element) => observer.observe(element));
