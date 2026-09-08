type ContactState = "idle" | "validating" | "submitting" | "success" | "error";

function setState(form: HTMLFormElement, state: ContactState, message: string) {
  form.dataset.state = state;
  const button = form.querySelector<HTMLButtonElement>("[data-submit]");
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  if (button) {
    button.disabled = state === "validating" || state === "submitting";
    button.textContent = state === "submitting" ? "Sending…" : button.dataset.idleLabel || "Send";
  }
  if (status) status.textContent = message;
}

document.querySelectorAll<HTMLFormElement>("[data-contact-form]").forEach((form) => {
  form.addEventListener("input", () => {
    if (form.dataset.state === "success") setState(form, "idle", "");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setState(form, "validating", "Checking your message…");
    if (!form.reportValidity()) return setState(form, "error", "Please complete the highlighted fields.");
    setState(form, "submitting", "Sending your message…");
    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const submissionId = crypto.randomUUID();
      const response = await fetch(form.action, {
        method: "POST", headers: { "content-type": "application/json", "x-submission-id": submissionId },
        body: JSON.stringify({ ...payload, turnstileToken: String(formData.get("cf-turnstile-response") || ""), submissionId }),
      });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Email delivery is not available yet.");
      form.reset();
      setState(form, "success", "Thank you. Your message has been sent.");
    } catch (error) {
      (window as Window & { turnstile?: { reset: () => void } }).turnstile?.reset();
      setState(form, "error", error instanceof Error ? error.message : "Unable to send. Please use the email link.");
    }
  });
});
