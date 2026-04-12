const yearElement = document.getElementById("year");
const brandElement = document.querySelector(".brand");
const logoElement = document.querySelector(".brand-logo");

if (yearElement) {
	yearElement.textContent = String(new Date().getFullYear());
}

if (brandElement && logoElement) {
	const setLogoLoaded = () => {
		brandElement.classList.remove("is-loading");
		brandElement.classList.add("has-logo");
	};

	const setLogoError = () => {
		brandElement.classList.remove("is-loading");
		brandElement.classList.add("logo-error");
	};

	logoElement.addEventListener("load", setLogoLoaded);
	logoElement.addEventListener("error", setLogoError);

	if (logoElement.complete) {
		if (logoElement.naturalWidth > 0) {
			setLogoLoaded();
		} else {
			setLogoError();
		}
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
