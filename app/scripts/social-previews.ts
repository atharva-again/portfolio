document.addEventListener("click", async (event) => {
	const target = event.target;
	if (!(target instanceof Element)) return;
	const button = target.closest<HTMLButtonElement>("[data-social-copy]");
	if (!button) return;

	event.preventDefault();
	event.stopPropagation();
	if (!navigator.clipboard) return;

	const originalMarkup = button.innerHTML;
	try {
		await navigator.clipboard.writeText(button.dataset.socialCopy ?? "");
		button.innerHTML =
			'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
		button.setAttribute("aria-label", "Email copied");
		window.setTimeout(() => {
			button.innerHTML = originalMarkup;
			button.setAttribute("aria-label", `Copy email ${button.dataset.socialCopy ?? ""}`);
		}, 1400);
	} catch {
		// Clipboard permission can be denied; copying is optional and the email remains visible.
	}
});
