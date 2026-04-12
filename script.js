const yearElement = document.getElementById("year");
const brandElement = document.querySelector(".brand");
const logoElement = document.querySelector(".brand-logo");

const logoCandidates = [
	"assets/logo.pnp",
	"assets/logo.png",
	"assets/connecto-logo.png",
	"assets/logo.jpg",
	"assets/logo.jpeg",
	"assets/logo.webp",
];

if (yearElement) {
	yearElement.textContent = String(new Date().getFullYear());
}

if (brandElement && logoElement) {
	let logoIndex = 0;

	const setNextLogoSource = () => {
		if (logoIndex < logoCandidates.length) {
			logoElement.src = logoCandidates[logoIndex];
			logoIndex += 1;
		}
	};

	logoElement.addEventListener("error", setNextLogoSource);

	logoElement.addEventListener("load", () => {
		brandElement.classList.add("has-logo");
	});

	if (logoElement.complete && logoElement.naturalWidth > 0) {
		brandElement.classList.add("has-logo");
	} else {
		setNextLogoSource();
	}
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
