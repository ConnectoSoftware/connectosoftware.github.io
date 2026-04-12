const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
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
