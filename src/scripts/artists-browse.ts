// Show the portrait for whichever artist name is hovered or focused.
document.querySelectorAll<HTMLElement>("[data-artists-browse]").forEach((root) => {
  const links = [...root.querySelectorAll<HTMLAnchorElement>("a[data-artist-index]")];
  const portraits = [...root.querySelectorAll<HTMLImageElement>("img[data-artist-index]")];
  const show = (index: string | undefined) => {
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.artistIndex === index));
    portraits.forEach((img) => img.classList.toggle("is-active", img.dataset.artistIndex === index));
  };
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => show(link.dataset.artistIndex));
    link.addEventListener("focus", () => show(link.dataset.artistIndex));
  });
});

export {};
