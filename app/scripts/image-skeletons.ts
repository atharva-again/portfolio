export function setupImageSkeletons(root: ParentNode = document) {
	for (const image of root.querySelectorAll<HTMLImageElement>("[data-image-skeleton-image]")) {
		if (image.dataset.imageSkeletonInitialized) continue;
		const skeleton = image.previousElementSibling;
		if (
			!(skeleton instanceof HTMLElement) ||
			!skeleton.hasAttribute("data-image-loading-skeleton")
		) {
			continue;
		}

		image.dataset.imageSkeletonInitialized = "true";
		const hide = () => {
			skeleton.hidden = true;
		};
		if (image.complete) {
			hide();
		} else {
			image.addEventListener("load", hide, { once: true });
			image.addEventListener("error", hide, { once: true });
		}
	}
}

setupImageSkeletons();
