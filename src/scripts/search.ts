interface SearchItem { type: string; title: string; subtitle: string; href: string; image: string | null; keywords: string; }

const button = document.querySelector<HTMLButtonElement>("[data-search-button]");
const panel = document.querySelector<HTMLElement>("[data-search-panel]");
const form = document.querySelector<HTMLFormElement>("[data-search-form]");
const input = document.querySelector<HTMLInputElement>("[data-search-input]");
const closeButton = document.querySelector<HTMLButtonElement>("[data-search-close]");
const searchStatus = document.querySelector<HTMLElement>("[data-search-status]");
const results = document.querySelector<HTMLUListElement>("[data-search-results]");
const maxResults = 8;
let index: Promise<SearchItem[]> | undefined;

// Lower-case and strip accents so searches ignore capitals and diacritics.
const normalise = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function loadIndex() {
  index ??= fetch("/search-index.json").then((response) => response.json() as Promise<SearchItem[]>).catch(() => []);
  return index;
}

function search(items: SearchItem[], query: string) {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return items
    .map((item) => {
      const title = normalise(item.title), subtitle = normalise(item.subtitle), keywords = normalise(item.keywords);
      const titleWords = title.split(/[^a-z0-9]+/);
      let score = 0;
      for (const term of terms) {
        // A number only matches a whole number, so "2" finds "#2" rather than "2026".
        if (/^\d+$/.test(term)) {
          if (titleWords.includes(term)) score += 3;
          else return { item, score: 0 };
        } else if (title.startsWith(term) || title.includes(` ${term}`)) score += 3;
        else if (title.includes(term)) score += 2;
        else if (subtitle.includes(term)) score += 2;
        else if (keywords.includes(term)) score += 1;
        else return { item, score: 0 };
      }
      return { item, score: score + (item.type === "Artist" ? 0.5 : 0) };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((entry) => entry.item);
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text = "") {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function render(items: SearchItem[], query: string) {
  if (!results || !searchStatus) return;
  results.replaceChildren(...items.map((item) => {
    const link = element("a", "site-search-result");
    link.href = item.href;
    if (item.image) {
      const img = element("img", "");
      img.src = item.image;
      img.alt = "";
      img.loading = "lazy";
      link.appendChild(img);
    } else {
      link.appendChild(element("span", "site-search-thumb"));
    }
    const text = element("span", "site-search-text");
    text.appendChild(element("span", "site-search-title", item.title));
    text.appendChild(element("span", "site-search-meta", `${item.type} · ${item.subtitle}`));
    link.appendChild(text);
    const li = document.createElement("li");
    li.appendChild(link);
    return li;
  }));
  searchStatus.textContent = query.trim() && !items.length ? `No artists or artworks match “${query.trim()}”.` : "";
}

async function update() {
  if (!input) return;
  const query = input.value;
  const items = query.trim() ? search(await loadIndex(), query) : [];
  if (input.value === query) render(items, query);
}

function setOpen(open: boolean, { restoreFocus = false } = {}) {
  if (!button || !panel || !input) return;
  button.setAttribute("aria-expanded", String(open));
  panel.hidden = !open;
  document.body.classList.toggle("search-is-open", open);
  if (open) {
    document.querySelector<HTMLButtonElement>('[data-menu-button][aria-expanded="true"]')?.click();
    loadIndex();
    input.focus();
  } else if (restoreFocus) {
    button.focus();
  }
}

if (button && panel && form && input) {
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  closeButton?.addEventListener("click", () => setOpen(false, { restoreFocus: true }));
  input.addEventListener("input", update);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    results?.querySelector<HTMLAnchorElement>("a")?.click();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") setOpen(false, { restoreFocus: true });
  });
  document.addEventListener("click", (event) => {
    const target = event.target as Node;
    if (button.getAttribute("aria-expanded") === "true" && !panel.contains(target) && !button.contains(target)) setOpen(false);
  });
}

export {};
