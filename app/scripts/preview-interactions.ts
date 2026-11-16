import { setupImageSkeletons } from "./image-skeletons";

function positionPreview(
	wrapper: HTMLElement,
	preview: HTMLElement,
	placementOrder: string,
	forcePlacement: boolean,
) {
	const rect = wrapper.getBoundingClientRect();
	const anchorX = rect.left + rect.width / 2;
	const anchorY = rect.top + rect.height / 2;
	const width = 240;
	const height = 160;
	const margin = 16;
	const placements = placementOrder.split(",");
	const calculate = (placement: string) =>
		placement === "below"
			? { x: anchorX - width / 2, y: anchorY + 30 }
			: { x: anchorX - width / 2, y: anchorY - height - 100 };
	const fits = (point: { x: number; y: number }) =>
		point.x >= margin &&
		point.y >= margin &&
		point.x + width <= window.innerWidth - margin &&
		point.y + height <= window.innerHeight - margin;
	let point = calculate(placements[0] ?? "above");

	if (!forcePlacement) {
		point = placements.map(calculate).find(fits) ?? point;
		point = {
			x: Math.max(margin, Math.min(point.x, window.innerWidth - width - margin)),
			y: Math.max(margin, Math.min(point.y, window.innerHeight - height - margin)),
		};
	}

	preview.style.left = `${point.x}px`;
	preview.style.top = `${point.y}px`;
}

function setupPreviewInteractions(
	wrapper: HTMLElement,
	preview: HTMLElement,
	placementOrder: string,
	forcePlacement = false,
) {
	const hoverQuery = window.matchMedia("(hover: hover)");
	let deactivateTimeout: number | undefined;
	const clearDeactivation = () => {
		if (deactivateTimeout === undefined) return;
		window.clearTimeout(deactivateTimeout);
		deactivateTimeout = undefined;
	};
	const hide = () => {
		preview.hidden = true;
		preview.setAttribute("aria-hidden", "true");
		wrapper.classList.remove("is-active");
	};
	const open = () => {
		if (!hoverQuery.matches) return;
		clearDeactivation();
		positionPreview(wrapper, preview, placementOrder, forcePlacement);
		preview.hidden = false;
		preview.setAttribute("aria-hidden", "false");
		wrapper.classList.add("is-active");
	};
	const close = () => {
		if (!hoverQuery.matches) return;
		clearDeactivation();
		deactivateTimeout = window.setTimeout(() => {
			hide();
			deactivateTimeout = undefined;
		}, 100);
	};

	wrapper.addEventListener("pointerenter", open);
	wrapper.addEventListener("pointerleave", close);
	preview.addEventListener("pointerenter", open);
	preview.addEventListener("pointerleave", close);
	hoverQuery.addEventListener("change", () => {
		if (!hoverQuery.matches) {
			clearDeactivation();
			hide();
		}
	});
}

for (const wrapper of document.querySelectorAll<HTMLElement>("[data-preview-wrapper]")) {
	const template = wrapper.querySelector<HTMLTemplateElement>("[data-preview-template]");
	const preview = template?.content.querySelector<HTMLElement>("[data-preview-panel]");
	if (!template || !preview) continue;
	document.body.append(preview);
	setupImageSkeletons(preview);
	template.remove();
	setupPreviewInteractions(
		wrapper,
		preview,
		wrapper.dataset.previewPlacement ?? "above,below",
		wrapper.dataset.previewForcePlacement === "true",
	);
}
