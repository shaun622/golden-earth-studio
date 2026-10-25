// Shuffle the homepage works on each visit, and scroll the strip when the pointer rests near an edge.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const edge = 0.2;
const maxSpeed = 9;

document.querySelectorAll<HTMLElement>("[data-artwork-strip]").forEach((strip) => {
  const track = strip.querySelector<HTMLElement>("[data-artwork-track]");
  if (!track) return;
  const cards = [...track.children];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach((card) => track.appendChild(card));

  if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
  let speed = 0;
  let frame = 0;
  const step = () => {
    strip.scrollLeft += speed;
    frame = speed ? requestAnimationFrame(step) : 0;
  };
  strip.addEventListener("mousemove", (event) => {
    const box = strip.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    speed = x > 1 - edge ? ((x - (1 - edge)) / edge) * maxSpeed : x < edge ? -((edge - x) / edge) * maxSpeed : 0;
    if (speed && !frame) frame = requestAnimationFrame(step);
  });
  strip.addEventListener("mouseleave", () => { speed = 0; });
});

export {};
