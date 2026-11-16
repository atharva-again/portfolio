type Swipe = {
	pointerId: number;
	x: number;
	y: number;
	target: HTMLElement;
};

export function setupLightboxGestures(
	stage: HTMLElement,
	actions: { move: (direction: -1 | 1) => void; close: () => void },
) {
	let swipe: Swipe | undefined;
	let suppressClick = false;

	const cancelSwipe = () => {
		const active = swipe;
		swipe = undefined;
		if (active?.target.hasPointerCapture(active.pointerId)) {
			active.target.releasePointerCapture(active.pointerId);
		}
	};

	stage.addEventListener("pointerdown", (event) => {
		suppressClick = false;
		if (!event.isPrimary || swipe) {
			cancelSwipe();
			return;
		}
		const target = event.target;
		if (event.button !== 0 || !(target instanceof HTMLElement) || target.closest("button")) {
			return;
		}

		swipe = {
			pointerId: event.pointerId,
			x: event.clientX,
			y: event.clientY,
			target,
		};
		// Capture on the original target so tapping an image is not retargeted to the backdrop.
		target.setPointerCapture(event.pointerId);
	});
	stage.addEventListener("pointerup", (event) => {
		const start = swipe;
		if (!start || event.pointerId !== start.pointerId) return;
		cancelSwipe();

		const dx = event.clientX - start.x;
		const dy = event.clientY - start.y;
		if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
			suppressClick = true;
			actions.move(dx < 0 ? 1 : -1);
		} else if (dy > 100 && dy > Math.abs(dx)) {
			suppressClick = true;
			actions.close();
		}
	});
	const onCancel = (event: PointerEvent) => {
		if (event.pointerId === swipe?.pointerId) cancelSwipe();
	};
	stage.addEventListener("pointercancel", onCancel);
	stage.addEventListener("lostpointercapture", onCancel);
	stage.addEventListener(
		"click",
		(event) => {
			// A completed swipe must not also activate the backdrop or a navigation button.
			if (!suppressClick || event.detail === 0) return;
			suppressClick = false;
			event.preventDefault();
			event.stopPropagation();
		},
		{ capture: true },
	);

	return cancelSwipe;
}
