import { setupLightboxGestures } from "./lightbox-gestures";

function setupImageTooltips() {
	if (!window.matchMedia("(hover: hover)").matches) return;
	for (const trigger of document.querySelectorAll<HTMLElement>("[data-lightbox-trigger]")) {
		const tooltip = trigger.querySelector<HTMLElement>("[data-image-tooltip]");
		if (!tooltip) continue;
		trigger.addEventListener("pointerenter", () => tooltip.classList.add("is-visible"));
		trigger.addEventListener("pointerleave", () => tooltip.classList.remove("is-visible"));
		trigger.addEventListener("pointermove", (event) => {
			const rect = trigger.getBoundingClientRect();
			tooltip.style.left = `${event.clientX - rect.left}px`;
			tooltip.style.top = `${event.clientY - rect.top}px`;
		});
	}
}

function setupLightbox() {
	const dialog = document.querySelector<HTMLDialogElement>("[data-image-lightbox]");
	const stage = dialog?.querySelector<HTMLElement>("[data-lightbox-stage]");
	const image = dialog?.querySelector<HTMLImageElement>("[data-lightbox-image]");
	const counter = dialog?.querySelector<HTMLElement>("[data-lightbox-counter]");
	const previousButton = dialog?.querySelector<HTMLButtonElement>("[data-lightbox-prev]");
	const nextButton = dialog?.querySelector<HTMLButtonElement>("[data-lightbox-next]");
	const triggers = [...document.querySelectorAll<HTMLElement>("[data-lightbox-trigger]")];
	if (!dialog || !stage || !image || !counter || !previousButton || !nextButton || !triggers.length)
		return;

	let gallery: HTMLElement[] = [];
	let currentIndex = 0;
	let previousBodyOverflow = "";
	let lastWheelDirection = 0;
	let lastWheelTime = 0;
	const isLightboxState = () =>
		typeof history.state === "object" &&
		history.state !== null &&
		"portfolioLightbox" in history.state;

	const render = () => {
		const trigger = gallery[currentIndex];
		if (!trigger) return;
		const thumbnail = trigger.querySelector<HTMLImageElement>("img");
		if (!thumbnail) throw new Error("Lightbox trigger must contain an image");
		image.src = thumbnail.src;
		image.srcset = thumbnail.srcset;
		image.alt = thumbnail.alt;
		counter.textContent = gallery.length > 1 ? `${currentIndex + 1} / ${gallery.length}` : "";
		dialog.toggleAttribute("data-has-multiple", gallery.length > 1);
		previousButton.disabled = gallery.length < 2;
		nextButton.disabled = gallery.length < 2;
	};
	const open = (trigger: HTMLElement) => {
		gallery = triggers;
		currentIndex = Math.max(0, gallery.indexOf(trigger));
		render();
		if (!dialog.open) {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			dialog.showModal();
		}
		if (!isLightboxState()) {
			history.pushState({ ...history.state, portfolioLightbox: true }, "", location.href);
		}
	};
	const close = () => {
		if (isLightboxState()) history.back();
		else if (dialog.open) dialog.close();
	};
	const move = (amount: number) => {
		if (gallery.length < 2) return;
		currentIndex = (currentIndex + amount + gallery.length) % gallery.length;
		render();
	};
	const cancelSwipe = setupLightboxGestures(stage, { move, close });

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const trigger = target.closest<HTMLElement>("[data-lightbox-trigger]");
		if (trigger) {
			event.preventDefault();
			open(trigger);
		}
	});
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog || event.target === stage) close();
	});
	dialog.addEventListener("close", () => {
		cancelSwipe();
		document.body.style.overflow = previousBodyOverflow;
	});
	dialog.querySelector("[data-lightbox-close]")?.addEventListener("click", close);
	previousButton.addEventListener("click", () => move(-1));
	nextButton.addEventListener("click", () => move(1));
	dialog.addEventListener("cancel", (event) => {
		event.preventDefault();
		close();
	});
	window.addEventListener("popstate", () => {
		if (dialog.open && !isLightboxState()) dialog.close();
	});
	dialog.addEventListener("keydown", (event) => {
		if (event.key === "ArrowLeft") move(-1);
		if (event.key === "ArrowRight") move(1);
	});
	dialog.addEventListener(
		"wheel",
		(event) => {
			if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.5 || Math.abs(event.deltaX) < 20)
				return;
			const direction = event.deltaX > 0 ? 1 : -1;
			const now = Date.now();
			if (direction === lastWheelDirection && now - lastWheelTime < 250) return;
			lastWheelDirection = direction;
			lastWheelTime = now;
			event.preventDefault();
			move(direction);
		},
		{ passive: false },
	);
}

setupImageTooltips();
setupLightbox();
