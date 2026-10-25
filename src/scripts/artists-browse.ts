// Hovering or focusing an artist's name shows their portrait in the space beside the list;
// leaving the list clears it again.
document.querySelectorAll<HTMLElement>("[data-artists-names]").forEach((list) => {
  const section = list.closest("section");
  const links = [...list.querySelectorAll<HTMLAnchorElement>("a[data-artist-index]")];
  const portraits = [...(section?.querySelectorAll<HTMLImageElement>("[data-artists-portraits] img") ?? [])];
  const show = (index?: string) => {
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.artistIndex === index));
    portraits.forEach((img) => img.classList.toggle("is-active", img.dataset.artistIndex === index));
  };
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => show(link.dataset.artistIndex));
    link.addEventListener("focus", () => show(link.dataset.artistIndex));
  });
  list.addEventListener("mouseleave", () => show());
  list.addEventListener("focusout", (event) => {
    if (!list.contains(event.relatedTarget as Node | null)) show();
  });
});

export {};
