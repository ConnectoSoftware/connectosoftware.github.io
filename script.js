/* === YEAR === */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* === LOGO LOADING === */
document.querySelectorAll(".brand").forEach((brand) => {
  const logo = brand.querySelector(".brand-logo");
  if (!logo) return;
  const onLoad  = () => { brand.classList.remove("is-loading"); brand.classList.add("has-logo"); };
  const onError = () => { brand.classList.remove("is-loading"); brand.classList.add("logo-error"); };
  logo.addEventListener("load", onLoad);
  logo.addEventListener("error", onError);
  if (logo.complete) logo.naturalWidth > 0 ? onLoad() : onError();
});

/* === MOBILE MENU === */
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });
}

/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up")
  .forEach((el) => revealObserver.observe(el));

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const frames = Math.round(duration / 16);
  let frame = 0;
  const timer = setInterval(() => {
    frame++;
    const progress = frame / frames;
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.floor(eased * target);
    if (frame >= frames) { el.textContent = target; clearInterval(timer); }
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num[data-target]").forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
const heroStats = document.querySelector(".hero-stats");
if (heroStats) counterObserver.observe(heroStats);

/* === CHAT ANIMATION === */
const chatMessages = [
  { type: "user", text: "Hi! Do you have size M blue kurtis?" },
  { type: "bot",  text: "Hello! Yes, we have 8 in stock 🎉\nBlue Kurti (M) — ৳450 each\nHow many would you like?" },
  { type: "user", text: "I'll take 2 please" },
  { type: "bot",  text: "📦 Order created:\n2× Blue Kurti (M) = ৳900\n\nReply YES to confirm your order" },
  { type: "user", text: "YES" },
  { type: "bot",  text: "✅ Order #1042 confirmed!\nWe'll deliver in 2-3 days.\nThank you for shopping with us! 🛍️" },
];

function addBubble(container, type, text) {
  const el = document.createElement("div");
  el.className = `chat-bubble ${type}`;
  el.innerHTML = text.replace(/\n/g, "<br>");
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function showTyping(container) {
  const el = document.createElement("div");
  el.className = "typing-indicator";
  el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return el;
}

function runChat() {
  const container = document.getElementById("chatWindow");
  if (!container) return;
  container.innerHTML = "";

  let delay = 700;

  chatMessages.forEach((msg) => {
    if (msg.type === "user") {
      setTimeout(() => {
        addBubble(container, "user", msg.text);
      }, delay);
      delay += 900;
    } else {
      // Show typing indicator first
      setTimeout(() => {
        const indicator = showTyping(container);
        setTimeout(() => {
          indicator.remove();
          addBubble(container, "bot", msg.text);
        }, 1100);
      }, delay);
      delay += 2100;
    }
  });

  // Restart after full loop
  setTimeout(runChat, delay + 4000);
}

// Start chat when phone enters viewport
const chatObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      runChat();
      chatObserver.disconnect();
    }
  },
  { threshold: 0.3 }
);
const phoneFrame = document.querySelector(".phone-frame");
if (phoneFrame) chatObserver.observe(phoneFrame);

/* === HEADER SCROLL SHADOW === */
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 10
      ? "0 4px 30px rgba(0,0,0,0.4)"
      : "none";
  }, { passive: true });
}
