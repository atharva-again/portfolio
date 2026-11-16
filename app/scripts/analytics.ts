const visitorNode = document.querySelector<HTMLElement>("[data-visitor-count]");
const code = visitorNode?.dataset.code;

function isCounterResponse(value: unknown): value is { count: string } {
	if (typeof value !== "object" || value === null || !("count" in value)) return false;
	return typeof value.count === "string" && /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value.count);
}

if (visitorNode && code) {
	if (!document.getElementById("goatcounter-script")) {
		const script = document.createElement("script");
		script.id = "goatcounter-script";
		script.async = true;
		script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
		script.src = "https://gc.zgo.at/count.js";
		document.head.append(script);
	}

	void (async () => {
		try {
			const response = await fetch(
				`https://${code}.goatcounter.com/counter/TOTAL.json?no_branding=true`,
			);
			if (!response.ok) return;

			const payload: unknown = await response.json();
			if (!isCounterResponse(payload)) return;

			const count = Number(payload.count.replaceAll(",", ""));
			visitorNode.textContent = `${payload.count} ${count === 1 ? "visitor" : "visitors"}`;
		} catch {
			// The counter is optional; leave the footer unchanged if it is unavailable.
		}
	})();
}
