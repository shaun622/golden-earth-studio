document.querySelectorAll<HTMLElement>("[data-masonry]").forEach((grid) => {
  const items = [...grid.querySelectorAll<HTMLAnchorElement>(":scope > a")];
  function arrange() {
    const style = getComputedStyle(grid);
    const columns = style.gridTemplateColumns.split(" ").length;
    const gap = parseFloat(style.columnGap) || 0;
    const width = (grid.clientWidth - gap * (columns - 1)) / columns;
    if (width <= 0) return;
    const heights = Array<number>(columns).fill(0);
    items.forEach((item) => {
      const img = item.querySelector("img")!;
      const ratio = Number(img.getAttribute("height")) / Number(img.getAttribute("width"));
      const column = heights.indexOf(Math.min(...heights));
      const height = Math.ceil(width * ratio);
      item.style.gridColumn = String(column + 1);
      item.style.gridRow = `${heights[column] + 1} / span ${height}`;
      heights[column] += height + gap;
    });
    grid.dataset.masonryReady = "true";
  }
  if ("ResizeObserver" in window) new ResizeObserver(arrange).observe(grid);
  arrange();
});
