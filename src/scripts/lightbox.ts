document.querySelectorAll<HTMLElement>("[data-lightbox]").forEach((root) => {
  const foundDialog = root.querySelector<HTMLDialogElement>("dialog");
  const foundImage = foundDialog?.querySelector<HTMLImageElement>("[data-lightbox-image]");
  const foundCaption = foundDialog?.querySelector<HTMLElement>("[data-lightbox-caption]");
  const links = [...root.querySelectorAll<HTMLAnchorElement>("[data-lightbox-open]")];
  let index = 0;
  let opener: HTMLElement | null = null;
  if (!foundDialog || !foundImage || !foundCaption) return;
  const dialog = foundDialog;
  const image = foundImage;
  const caption = foundCaption;

  function show(nextIndex: number) {
    index = (nextIndex + links.length) % links.length;
    const link = links[index];
    image.src = link.href;
    image.alt = link.dataset.alt || "";
    caption.textContent = link.dataset.caption || image.alt;
    dialog.querySelectorAll<HTMLButtonElement>("[data-lightbox-step]").forEach((button) => button.hidden = links.length < 2);
  }
  links.forEach((link, linkIndex) => link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    show(linkIndex);
    dialog.showModal();
    document.body.classList.add("dialog-is-open");
  }));
  dialog.addEventListener("close", () => { document.body.classList.remove("dialog-is-open"); opener?.focus(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.querySelector<HTMLElement>("[data-lightbox-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelectorAll<HTMLButtonElement>("[data-lightbox-step]").forEach((button) => button.addEventListener("click", () => show(index + Number(button.dataset.lightboxStep))));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
});
