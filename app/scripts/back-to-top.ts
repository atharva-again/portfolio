const container = document.querySelector<HTMLElement>("[data-back-to-top]");
const button = container?.querySelector<HTMLButtonElement>("[data-back-to-top-button]");
const progress = container?.querySelector<SVGCircleElement>("[data-back-to-top-progress]");

if (container && button && progress) {
	let panelOpen = false;
	const update = () => {
		const root = document.documentElement;
		const max = Math.max(1, root.scrollHeight - window.innerHeight);
		const y = window.scrollY || window.pageYOffset;
		progress.style.strokeDashoffset = `${152.37 * (1 - Math.max(0, Math.min(1, y / max)))}`;
		const visible = y > 200 && !panelOpen;
		container.classList.toggle("is-visible", visible);
		container.classList.toggle("is-hidden", !visible);
		container.setAttribute("aria-hidden", String(!visible));
	};
	button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
	window.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update, { passive: true });
	window.addEventListener("infopanel:open", () => {
		panelOpen = true;
		update();
	});
	window.addEventListener("infopanel:close", () => {
		panelOpen = false;
		update();
	});
	update();
}
