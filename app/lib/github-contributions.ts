import { githubContributionsSnapshot } from "./github-contributions-snapshot";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
	date: string;
	level: ContributionLevel;
	tooltip: string;
	week: number;
	weekday: number;
	index: number;
};

export type ContributionCalendar = {
	total: number;
	days: ContributionDay[];
	weeks: number;
	months: { label: string; week: number }[];
};

type RawContributionDay = Pick<ContributionDay, "date" | "level" | "tooltip">;

function contributionLevel(value: string, date: string): ContributionLevel {
	switch (value) {
		case "0":
			return 0;
		case "1":
			return 1;
		case "2":
			return 2;
		case "3":
			return 3;
		case "4":
			return 4;
		default:
			throw new Error(`Invalid GitHub contribution level "${value}" for ${date}`);
	}
}

function buildCalendar(total: number, rawDays: RawContributionDay[]): ContributionCalendar {
	if (rawDays.length === 0) throw new Error("GitHub returned no contribution calendar cells");

	const firstDate = new Date(`${rawDays[0].date}T00:00:00Z`);
	const firstSunday = firstDate.getTime() - firstDate.getUTCDay() * 86_400_000;
	const days = rawDays.map((day, index) => {
		const date = new Date(`${day.date}T00:00:00Z`);
		const weekday = date.getUTCDay();
		return {
			...day,
			weekday,
			week: Math.floor((date.getTime() - firstSunday) / (7 * 86_400_000)),
			index,
		};
	});
	const weeks = Math.max(...days.map((day) => day.week)) + 1;
	const months: ContributionCalendar["months"] = [];
	let previousMonth = "";
	for (const day of days) {
		const month = day.date.slice(0, 7);
		if (month === previousMonth) continue;
		previousMonth = month;
		months.push({
			label: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
				new Date(`${month}-01T00:00:00Z`),
			),
			week: day.week,
		});
	}

	return { total, days, weeks, months };
}

function snapshotDays(): RawContributionDay[] {
	const { firstDate, levels, counts } = githubContributionsSnapshot;
	if (!/^\d+(,\d+)*$/.test(counts)) {
		throw new Error("Saved GitHub contribution snapshot has invalid counts");
	}
	const contributions = counts.split(",").map(Number);
	if (levels.length !== contributions.length) {
		throw new Error("Saved GitHub contribution snapshot has mismatched days");
	}

	const start = new Date(`${firstDate}T00:00:00Z`);
	return Array.from(levels, (value, index) => {
		const date = new Date(start.getTime() + index * 86_400_000);
		const dateString = date.toISOString().slice(0, 10);
		const count = contributions[index];
		const day = date.getUTCDate();
		const ordinal =
			day % 100 >= 11 && day % 100 <= 13
				? "th"
				: ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th");
		const month = new Intl.DateTimeFormat("en-US", {
			month: "long",
			timeZone: "UTC",
		}).format(date);
		const dateLabel = `${month} ${day}${ordinal}`;
		const tooltip =
			count === 0
				? `No contributions on ${dateLabel}.`
				: `${count} contribution${count === 1 ? "" : "s"} on ${dateLabel}.`;

		return {
			date: dateString,
			level: contributionLevel(value, dateString),
			tooltip,
		};
	});
}

/** Render only the committed snapshot so static output is deterministic and offline-safe. */
export function getGitHubContributionCalendar(): ContributionCalendar {
	return buildCalendar(githubContributionsSnapshot.total, snapshotDays());
}
