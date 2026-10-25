// Hovering or focusing an artist's name shows their portrait in the space beside the list;
// leaving the list returns to the studio display photograph.
document.querySelectorAll<HTMLElement>("[data-artists-names]").forEach((list) => {
  const section = list.closest("section");
  const links = [...list.querySelectorAll<HTMLAnchorElement>("a[data-artist-index]")];
  const portraits = [...(section?.querySelectorAll<HTMLImageElement>("[data-artists-portraits] img[data-artist-index]") ?? [])];
  const fallback = section?.querySelector<HTMLImageElement>(".artists-portrait-default");
  const show = (index?: string) => {
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.artistIndex === index));
    portraits.forEach((img) => img.classList.toggle("is-active", img.dataset.artistIndex === index));
    fallback?.classList.toggle("is-active", index === undefined);
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
