const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-button]");
const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]");

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-is-open");
  if (restoreFocus) menuButton.focus();
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
    mobileMenu.hidden = !opening;
    document.body.classList.toggle("menu-is-open", opening);
    if (opening) mobileMenu.querySelector<HTMLAnchorElement>("a")?.focus();
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
  window.addEventListener("resize", () => { if (window.innerWidth > 767) closeMenu(); });
  document.addEventListener("keydown", (event) => {
    if (mobileMenu.hidden) return;
    if (event.key === "Escape") closeMenu({ restoreFocus: true });
    if (event.key !== "Tab") return;
    const lastLink = mobileMenu.querySelector<HTMLAnchorElement>("a:last-child");
    if (event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault();
      lastLink?.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuButton.focus();
    }
  });
}
