// Email links still open the visitor's email app, and also copy the address with a short confirmation,
// so visitors without an email app set up can paste it into their own.
const announcer = document.createElement("p");
announcer.className = "email-copied";
announcer.setAttribute("role", "status");
announcer.setAttribute("aria-live", "polite");
document.body.appendChild(announcer);
let hideTimer: number | undefined;

document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="mailto:"]');
  if (!link || !navigator.clipboard) return;
  const address = decodeURIComponent(link.href.replace(/^mailto:/, "").split("?")[0]);
  navigator.clipboard.writeText(address).then(() => {
    const box = link.getBoundingClientRect();
    announcer.textContent = "Email address copied";
    announcer.style.left = `${Math.min(window.innerWidth - 16, Math.max(16, box.left + box.width / 2))}px`;
    announcer.style.top = `${box.top + window.scrollY - 8}px`;
    announcer.dataset.visible = "true";
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => { announcer.dataset.visible = "false"; }, 2500);
  }).catch(() => {});
});

export {};
