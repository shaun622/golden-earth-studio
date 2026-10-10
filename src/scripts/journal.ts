document.querySelectorAll<HTMLElement>("[data-journal-system]").forEach((root) => {
  const foundDialog = root.querySelector<HTMLDialogElement>("dialog");
  const foundContent = root.querySelector<HTMLElement>("[data-journal-content]");
  const templates = new Map([...root.querySelectorAll<HTMLTemplateElement>("[data-journal-template]")].map((template) => [template.dataset.journalTemplate || "", template]));
  const popupMap = new Map([...templates.entries()].map(([slug, template]) => [template.dataset.popupId || "", slug]));
  let opener: HTMLElement | null = null;
  let currentSlug: string | null = null;
  if (!foundDialog || !foundContent) return;
  const dialog = foundDialog;
  const content = foundContent;

  function open(slug: string, push = true) {
    const template = templates.get(slug);
    if (!template) return;
    currentSlug = slug;
    content.replaceChildren(template.content.cloneNode(true));
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-is-open");
    if (push) history.pushState({ journalArticle: slug }, "", `#article=${encodeURIComponent(slug)}`);
    dialog.querySelector<HTMLElement>("[data-journal-close]")?.focus();
  }
  function close({ historyBack = true } = {}) {
    if (!dialog.open) return;
    dialog.close();
    document.body.classList.remove("dialog-is-open");
    content.replaceChildren();
    currentSlug = null;
    if (historyBack && location.hash.startsWith("#article=")) history.back();
    opener?.focus();
  }
  document.querySelectorAll<HTMLAnchorElement>("[data-journal-open]").forEach((link) => link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); opener = link; open(link.dataset.journalOpen || "");
  }));
  dialog.querySelector<HTMLElement>("[data-journal-close]")?.addEventListener("click", () => close());
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  window.addEventListener("popstate", () => {
    const match = location.hash.match(/^#article=([^&]+)$/);
    if (match) open(decodeURIComponent(match[1]), false);
    else if (currentSlug) close({ historyBack: false });
  });
  const articleMatch = location.hash.match(/^#article=([^&]+)$/);
  if (articleMatch) open(decodeURIComponent(articleMatch[1]), false);
  else if (location.hash.startsWith("#elementor-action")) {
    const decoded = decodeURIComponent(location.hash);
    if (decoded.startsWith("#elementor-action:action=popup:open&settings=")) {
      try {
        const encoded = decoded.slice(decoded.indexOf("settings=") + "settings=".length);
        const settings: unknown = JSON.parse(atob(encoded));
        const popupId = settings && typeof settings === "object" && "id" in settings && typeof settings.id === "string" ? settings.id : "";
        const slug = popupMap.get(popupId);
        if (slug) open(slug, false);
      } catch {
        // Unknown or malformed legacy fragments leave the usable index visible.
      }
    }
  }
});
