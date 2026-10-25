// Homepage Exhibitions slideshow: the arrows step through the exhibitions and the caption follows it.
document.querySelectorAll<HTMLElement>("[data-exhibitions]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll<HTMLAnchorElement>("[data-exhibition-slide]")];
  const caption = carousel.querySelector<HTMLAnchorElement>("[data-exhibitions-caption]");
  const prev = carousel.querySelector<HTMLButtonElement>("[data-exhibitions-prev]");
  const next = carousel.querySelector<HTMLButtonElement>("[data-exhibitions-next]");
  if (!caption || !prev || !next || slides.length < 2) return;
  let current = 0;

  const show = (index: number) => {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      if (active) {
        slide.removeAttribute("aria-hidden");
        slide.removeAttribute("tabindex");
      } else {
        slide.setAttribute("aria-hidden", "true");
        slide.tabIndex = -1;
      }
    });
    caption.href = slides[index].href;
    caption.textContent = slides[index].dataset.title ?? "";
    current = index;
  };

  carousel.classList.add("is-ready");
  show(0);
  prev.addEventListener("click", () => show((current - 1 + slides.length) % slides.length));
  next.addEventListener("click", () => show((current + 1) % slides.length));
});

export {};
