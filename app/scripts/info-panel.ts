function setupInfoPanels() {
	for (const panel of document.querySelectorAll<HTMLElement>("[data-info-panel-anchor]")) {
		const wrapper = panel.closest<HTMLElement>(".info-panel-mobile");
		const floating = wrapper?.querySelector<HTMLElement>("[data-info-panel-floating]");
		const toggle = wrapper?.querySelector<HTMLButtonElement>("[data-info-panel-toggle]");
		if (!wrapper || !floating || !toggle) continue;

		const mobile = window.matchMedia("(max-width: 767px)");
		let state: "inline" | "collapsed" | "expanded" = "inline";
		const updateVisibility = () => {
			const shouldFloat =
				mobile.matches && panel.getBoundingClientRect().bottom < window.innerHeight * 0.3;
			if (!shouldFloat) state = "inline";
			else if (state === "inline") state = "collapsed";

			const expanded = state === "expanded";
			const floatingNow = state !== "inline";
			floating.classList.toggle("is-open", expanded);
			floating.setAttribute("aria-hidden", String(!expanded));
			floating.inert = !expanded;
			toggle.classList.toggle("is-visible", floatingNow);
			toggle.classList.toggle("is-open", expanded);
			toggle.inert = !floatingNow;
			toggle.setAttribute("aria-expanded", String(expanded));
			toggle.setAttribute("aria-label", expanded ? "Hide info" : "Show info");
			document.querySelector("[data-site-nav]")?.classList.toggle("is-obscured", expanded);
			window.dispatchEvent(
				new CustomEvent(expanded ? "infopanel:open" : "infopanel:close"),
			);
		};
		const onScroll = () => requestAnimationFrame(updateVisibility);
		toggle.addEventListener("click", () => {
			state = state === "expanded" ? "collapsed" : "expanded";
			updateVisibility();
		});
		document.addEventListener("click", (event) => {
			const target = event.target;
			if (
				state === "expanded" &&
				target instanceof Node &&
				!floating.contains(target) &&
				!toggle.contains(target)
			) {
				state = "collapsed";
				updateVisibility();
			}
		});
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll, { passive: true });
		updateVisibility();
	}
}

function setupTableOfContents() {
	const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")];
	const headings = [
		...new Set(
			links
				.map((link) => document.getElementById(link.dataset.tocLink ?? ""))
				.filter((heading): heading is HTMLElement => heading instanceof HTMLElement),
		),
	];
	if (!("IntersectionObserver" in window) || headings.length === 0) return;

	const intersecting = new Set<Element>();
	const markers = [...document.querySelectorAll<HTMLElement>("[data-toc-active-marker]")];
	const updateActiveHeading = () => {
		const activeId = [...intersecting]
			.sort(
				(left, right) =>
					left.getBoundingClientRect().top - right.getBoundingClientRect().top,
			)[0]?.id;

		for (const link of links) {
			link.classList.toggle("is-active", link.dataset.tocLink === activeId);
		}
		for (const marker of markers) {
			marker.classList.toggle("is-active", marker.dataset.tocActiveMarker === activeId);
		}
	};
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) intersecting.add(entry.target);
				else intersecting.delete(entry.target);
			}
			updateActiveHeading();
		},
		{ rootMargin: "-10% 0% -10% 0%" },
	);
	for (const heading of headings) observer.observe(heading);
}

setupInfoPanels();
setupTableOfContents();
