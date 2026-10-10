document.querySelectorAll<HTMLElement>("[data-gallery-tabs]").forEach((root) => {
  const tabs = [...root.querySelectorAll<HTMLAnchorElement>("[data-gallery-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-gallery-panel]")];
  if (!tabs.length || !panels.length) return;
  root.dataset.enhanced = "true";

  function select(id: string, { focus = false, updateHistory = true } = {}) {
    if (!tabs.some((tab) => tab.dataset.galleryTab === id)) id = "artists";
    tabs.forEach((tab) => {
      const selected = tab.dataset.galleryTab === id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => panel.hidden = panel.dataset.galleryPanel !== id);
    if (updateHistory) history.replaceState(history.state, "", `#${id}`);
  }
  tabs.forEach((tab, index) => {
    tab.id = `${tab.dataset.galleryTab}-tab`;
    tab.addEventListener("click", (event) => { event.preventDefault(); select(tab.dataset.galleryTab || "artists", { focus: true }); });
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next].dataset.galleryTab || "artists", { focus: true });
    });
  });
  select(location.hash === "#artwork" ? "artwork" : "artists", { updateHistory: false });
  window.addEventListener("hashchange", () => select(location.hash.slice(1), { updateHistory: false }));
});
