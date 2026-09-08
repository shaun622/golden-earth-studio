const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let observer: IntersectionObserver | null = null;

function showAll() {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

function initializeMotion() {
  observer?.disconnect();
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return showAll();
  observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
    });
  }, { rootMargin: document.querySelector(".reference-interior") ? "0px" : "0px 0px -8%", threshold: 0.08 });
  document.querySelectorAll("[data-reveal]").forEach((element) => observer?.observe(element));
}

initializeMotion();
reducedMotion.addEventListener("change", initializeMotion);

const parallax = document.querySelector<HTMLElement>("[data-parallax]");
let ticking = false;
function updateParallax() {
  ticking = false;
  if (!parallax || reducedMotion.matches) return;
  const rect = parallax.getBoundingClientRect();
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  parallax.style.setProperty("--parallax-y", `${40 + Math.max(0, Math.min(1, progress)) * 20}%`);
}
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateParallax);
}, { passive: true });
updateParallax();
