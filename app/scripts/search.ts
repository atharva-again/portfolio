import Fuse from "fuse.js";

type SearchRecord = {
	title: string;
	description: string;
	tags: string[];
	date: string;
	element: HTMLElement;
};

function setHighlightedText(element: HTMLElement, value: string, query: string) {
	if (!query.trim()) {
		element.textContent = value;
		return;
	}

	const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const pieces = value.split(new RegExp(`(${escaped})`, "ig"));
	element.replaceChildren(
		...pieces.map((piece) => {
			if (piece.toLowerCase() === query.trim().toLowerCase()) {
				const mark = document.createElement("mark");
				mark.className = "search-highlight";
				mark.textContent = piece;
				return mark;
			}
			return document.createTextNode(piece);
		}),
	);
}

for (const root of document.querySelectorAll<HTMLElement>("[data-searchable-list]")) {
	const input = root.querySelector<HTMLInputElement>("[data-search-input]");
	const clearButton = root.querySelector<HTMLButtonElement>("[data-clear-search]");
	const items = [...root.querySelectorAll<HTMLElement>("[data-search-item]")];
	const tagButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-filter-tag]")];
	const results = root.querySelector<HTMLElement>("[data-search-results]");
	const empty = root.querySelector<HTMLElement>("[data-empty-results]");
	if (!input || !clearButton || !results) continue;

	const records: SearchRecord[] = items.map((element) => ({
		title: element.dataset.title ?? "",
		description: element.dataset.description ?? "",
		tags: (element.dataset.tags ?? "").split("|").filter(Boolean),
		date: element.dataset.date ?? "",
		element,
	}));
	const params = new URLSearchParams(location.search);
	const selectedTags = new Set(
		params
			.getAll("tags")
			.flatMap((value) => value.split(","))
			.map((value) => value.trim())
			.filter(Boolean),
	);
	input.value = params.get("q") ?? "";
	const hasInitialFilter = Boolean(params.get("q") || params.get("tags"));

	const syncUrl = () => {
		const next = new URLSearchParams(location.search);
		const query = input.value.trim();
		if (query) next.set("q", query);
		else next.delete("q");
		next.delete("tags");
		for (const tag of selectedTags) next.append("tags", tag);
		const suffix = next.toString();
		history.replaceState(
			history.state,
			"",
			`${location.pathname}${suffix ? `?${suffix}` : ""}${location.hash}`,
		);
	};

	const render = () => {
		const query = input.value.trim();
		const candidates = records.filter(
			(item) =>
				selectedTags.size === 0 || [...selectedTags].some((tag) => item.tags.includes(tag)),
		);
		const matches = query
			? new Fuse(candidates, {
					keys: ["title", "description", "tags", "date"],
					threshold: 0.4,
				})
					.search(query)
					.map(({ item }) => item)
			: candidates;
		const visibleElements = new Set(matches.map(({ element }) => element));

		for (const record of records) {
			record.element.hidden = !visibleElements.has(record.element);
			const title = record.element.querySelector<HTMLElement>("[data-search-title]");
			const description = record.element.querySelector<HTMLElement>("[data-search-description]");
			if (title) setHighlightedText(title, record.title, query);
			if (description) setHighlightedText(description, record.description, query);
		}
		results.append(...matches.map(({ element }) => element));
		if (empty) results.append(empty);

		for (const button of tagButtons) {
			const tag = button.dataset.filterTag ?? "";
			const active = tag === "all" ? selectedTags.size === 0 : selectedTags.has(tag);
			button.setAttribute("aria-pressed", String(active));
		}
		clearButton.style.display = query ? "inline-flex" : "none";
		if (empty) empty.style.display = matches.length ? "none" : "block";
	};

	let debounce: ReturnType<typeof setTimeout> | undefined;
	input.addEventListener("input", () => {
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			render();
			syncUrl();
		}, 200);
	});

	const toggleTag = (tag: string) => {
		if (tag === "all") selectedTags.clear();
		else if (selectedTags.has(tag)) selectedTags.delete(tag);
		else selectedTags.add(tag);
		render();
		syncUrl();
	};

	for (const button of tagButtons) {
		button.addEventListener("click", () => toggleTag(button.dataset.filterTag ?? "all"));
	}
	for (const button of root.querySelectorAll<HTMLButtonElement>("[data-tag-shortcut]")) {
		button.addEventListener("click", (event) => {
			event.preventDefault();
			toggleTag(button.dataset.tagShortcut ?? "");
		});
	}
	clearButton.addEventListener("click", () => {
		clearTimeout(debounce);
		input.value = "";
		render();
		syncUrl();
		input.focus();
	});
	window.addEventListener("popstate", () => {
		const current = new URLSearchParams(location.search);
		input.value = current.get("q") ?? "";
		selectedTags.clear();
		for (const tag of current.getAll("tags").flatMap((value) => value.split(","))) {
			if (tag.trim()) selectedTags.add(tag.trim());
		}
		render();
	});
	render();
	if (hasInitialFilter) {
		window.setTimeout(() => {
			root.closest<HTMLElement>("#projects-section, #blog-section")?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 100);
	}
}
