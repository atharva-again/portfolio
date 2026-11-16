import type { GitHubContributionSnapshot } from "./github-contributions-snapshot";

type ParsedDay = {
	date: string;
	level: string;
	count: number;
};

function attributes(tag: string): Map<string, string> {
	const result = new Map<string, string>();
	for (const [, name, value] of tag.matchAll(/([^\s=]+)="([^"]*)"/g)) {
		result.set(name, value);
	}
	return result;
}

function plainText(html: string): string {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;|&#160;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/\s+/g, " ")
		.trim();
}

function contributionCount(tooltip: string, date: string): number {
	if (/^no contributions on /i.test(tooltip)) return 0;

	const match = tooltip.match(/^([\d,]+) contributions? on /i);
	if (!match) throw new Error(`Could not read GitHub contribution count for ${date}`);

	const count = Number(match[1].replaceAll(",", ""));
	if (!Number.isSafeInteger(count)) {
		throw new Error(`GitHub returned an invalid contribution count for ${date}`);
	}
	return count;
}

function parseContributionPage(html: string): GitHubContributionSnapshot {
	const heading = html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1];
	const totalText = heading && plainText(heading);
	const totalMatch = totalText?.match(/([\d,]+)\s+contributions?\s+in the last year/i);
	if (!totalMatch) throw new Error("Could not read the GitHub contribution total");

	const total = Number(totalMatch[1].replaceAll(",", ""));
	if (!Number.isSafeInteger(total)) throw new Error("GitHub returned an invalid contribution total");

	const tooltips = new Map<string, string>();
	for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/gi)) {
		const id = attributes(match[1]).get("for");
		if (id) tooltips.set(id, plainText(match[2]));
	}

	const days: ParsedDay[] = [...html.matchAll(/<td\b[^>]*>/gi)]
		.map((match) => attributes(match[0]))
		.filter((attrs) => attrs.has("data-date"))
		.map((attrs) => {
			const date = attrs.get("data-date");
			const id = attrs.get("id");
			const level = attrs.get("data-level");
			if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !id || !level || !/^[0-4]$/.test(level)) {
				throw new Error("GitHub returned an invalid contribution calendar cell");
			}
			const tooltip = tooltips.get(id);
			if (!tooltip) throw new Error(`GitHub omitted the contribution tooltip for ${date}`);
			return { date, level, count: contributionCount(tooltip, date) };
		})
		.sort((left, right) => left.date.localeCompare(right.date));

	if (days.length === 0) throw new Error("GitHub returned no contribution calendar cells");

	for (let index = 1; index < days.length; index++) {
		const previous = Date.parse(`${days[index - 1].date}T00:00:00Z`);
		const current = Date.parse(`${days[index].date}T00:00:00Z`);
		if (current - previous !== 86_400_000) {
			throw new Error("GitHub returned a calendar with duplicate or missing dates");
		}
	}

	return {
		total,
		firstDate: days[0].date,
		levels: days.map((day) => day.level).join(""),
		counts: days.map((day) => day.count).join(","),
	};
}

export async function fetchGitHubContributionSnapshot(): Promise<GitHubContributionSnapshot> {
	const response = await fetch("https://github.com/users/atharva-again/contributions", {
		headers: { "User-Agent": "Atharva-Verma-portfolio" },
		signal: AbortSignal.timeout(15_000),
	});
	if (!response.ok) {
		throw new Error(`GitHub contributions request failed with HTTP ${response.status}`);
	}

	return parseContributionPage(await response.text());
}
