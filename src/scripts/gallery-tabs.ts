document.querySelectorAll<HTMLElement>("[data-gallery-tabs]").forEach((root) => {
  const tabs = [...root.querySelectorAll<HTMLAnchorElement>("[data-gallery-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-gallery-panel]")];
  if (!tabs.length || !panels.length) return;
  root.dataset.enhanced = "true";

  // Artwork cards appear in a fresh random order on each visit and each time the Artwork tab is chosen.
  // Without JavaScript they keep their authored order.
  const shuffled = [...root.querySelectorAll<HTMLElement>("[data-gallery-shuffle]")];
  function shuffle() {
    shuffled.forEach((list) => {
      const cards = [...list.children];
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      cards.forEach((card) => list.appendChild(card));
    });
  }
  shuffle();

  function select(id: string, { focus = false, updateHistory = true, reshuffle = false } = {}) {
    if (!tabs.some((tab) => tab.dataset.galleryTab === id)) id = "artists";
    if (reshuffle && id === "artwork") shuffle();
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
    tab.addEventListener("click", (event) => { event.preventDefault(); select(tab.dataset.galleryTab || "artists", { focus: true, reshuffle: true }); });
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next].dataset.galleryTab || "artists", { focus: true, reshuffle: true });
    });
  });
  select(location.hash === "#artwork" ? "artwork" : "artists", { updateHistory: false });
  window.addEventListener("hashchange", () => select(location.hash.slice(1), { updateHistory: false }));
});
