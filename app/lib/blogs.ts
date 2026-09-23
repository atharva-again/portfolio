import type { StaticImageData } from "next/image";
import {
	codingWithNothingHero,
	cpcbHero,
	lessIsMoreHero,
	playwrightE2eHero,
	ossSoftwareHero,
	wtfAreHarnessesHero,
} from "../content/assets/images";
import { BLOG_TAGS } from "./tags";
import type { ImageAspect } from "./image";

export type Blog = {
	slug: string;
	title: string;
	description: string;
	date: string;
	publishedAt?: string;
	heroImageAspect?: ImageAspect;
	tags?: string[];
	heroImage?: string | StaticImageData;
	links?: { type: string; url: string }[];
	featured?: boolean;
};

export const BLOGS: Blog[] = [
	{
		slug: "a-beginners-guide-to-e2e-testing-using-playwright",
		title: "A Beginner's Guide to E2E Testing (Using Playwright)",
		description:
			"A practical introduction to end-to-end testing with Playwright, including browser coverage, CI speed, isolation, parallelism, and flaky tests.",
		heroImage: playwrightE2eHero,
		date: "Jun 2026",
		tags: ["Tech", "Workflow"],
		links: [
			{
				type: "medium",
				url: "https://medium.com/@atharva-again/a-beginners-guide-to-e2e-testing-using-playwright-a32ab3cc3bd6",
			},
		],
		featured: false,
	},
	{
		slug: "less-is-really-more-more-so-in-the-ai-age",
		title: "less is really more, more so in the ai age",
		description:
			"Why AI-assisted development makes product judgment, restraint, and taste more important than ever.",
		heroImage: lessIsMoreHero,
		date: "Mar 2026",
		tags: ["Tech", "Workflow"],
		links: [
			{
				type: "medium",
				url: "https://medium.com/@atharva-again/less-is-really-more-more-so-in-the-ai-age-42aa68e36155",
			},
		],
		featured: true,
	},
	{
		slug: "a-list-of-oss-software-i-use",
		title: "a list of (oss) software i use",
		description:
			"A personal tour of the open-source and developer tools I use across my laptop, terminal, coding workflow, and Android devices.",
		heroImage: ossSoftwareHero,
		date: "Sep 2026",
		tags: ["Tech", "Workflow"],
		featured: true,
	},
	{
		slug: "cpcb-aqi-api",
		title: "CPCB's AQI API: Everything You Need To Know",
		description:
			"Central Pollution Control Board (CPCB) provides a free API to access real-time AQI data from various stations across India. This guide explains how to use it.",
		heroImage: cpcbHero,
		date: "Sep 2025",
		tags: ["Tech"],
		links: [
			{
				type: "medium",
				url: "https://medium.com/@atharva-again/cpcbs-aqi-api-everything-you-need-to-know-41f5eff85c5a",
			},
		],
		featured: false,
	},
	{
		slug: "coding-with-nothing",
		title:
			"how i code as a broke ass college student with i5 10gen and 8gb ram in 2026",
		description:
			"8 gigs of ram might sound fine, but when you have vs code and a next js server and a browser running, it feels slower than anything. Here's how I push out polished software with limited resources.",
		heroImage: codingWithNothingHero,
		date: "Mar 2026",
		tags: ["Tech", "Workflow"],
		links: [
			{
				type: "medium",
				url: "https://medium.com/@atharva-again/how-i-code-as-a-broke-ass-college-student-with-i5-10gen-and-8gb-ram-in-2026-2e4f2a6eaa0b",
			},
		],
		featured: true,
	},
	{
		slug: "wtf-are-harnesses-part-1",
		title: "wtf are harnesses: part 1 of building my own",
		description:
			"A practical introduction to AI harnesses: tools, model loops, gateways, user surfaces, memory, skills, and proactive agents.",
		heroImage: wtfAreHarnessesHero,
		heroImageAspect: "16/9",
		date: "Sep 2026",
		publishedAt: "2026-09-23",
		tags: ["Tech", "Workflow"],
		featured: true,
	},
];

const MONTHS = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
];

function blogDateValue(blog: Blog): number {
	const [monthName, yearText] = blog.date.trim().toLowerCase().split(/\s+/);
	const year = Number(yearText);
	const month = MONTHS.indexOf(monthName?.slice(0, 3) ?? "");
	const exactDate = blog.publishedAt ? new Date(`${blog.publishedAt}T00:00:00Z`) : null;
	const day = exactDate && !Number.isNaN(exactDate.getTime()) ? exactDate.getUTCDate() : 0;

	return Number.isFinite(year) && month >= 0 ? (year * 12 + month) * 32 + day : 0;
}

/** Basic accessors */
export function getAllBlogs(): Blog[] {
	return [...BLOGS].sort((a, b) => blogDateValue(b) - blogDateValue(a));
}

export function getBlog(slug: string): Blog | undefined {
	return BLOGS.find((p) => p.slug === slug);
}

export function getFeaturedBlogs(): Blog[] {
	return getAllBlogs().filter((b) => b.featured);
}

/** Tag helpers */
export function getAllBlogTags(): string[] {
	const set = new Set<string>();
	for (const p of BLOGS) {
		for (const t of p.tags ?? []) {
			// Only include tags that are in BLOG_TAGS (case-insensitive)
			if (BLOG_TAGS.some((at) => at.toLowerCase() === t.toLowerCase())) {
				set.add(t);
			}
		}
	}
	return Array.from(set).sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: "base" }),
	);
}

export function getBlogTagCounts(): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const p of BLOGS) {
		for (const t of p.tags ?? []) {
			if (BLOG_TAGS.some((at) => at.toLowerCase() === t.toLowerCase())) {
				counts[t] = (counts[t] || 0) + 1;
			}
		}
	}
	return counts;
}

/* ----------------------------
   Lightweight fuzzy search
   ----------------------------
   - No external deps.
   - Matches subsequences (characters of query in order).
   - Scores:
     * normalized matches / pattern length
     * prefix match bonus
     * consecutive match bonuses
     * shorter gap bonus (matches closer together)
   - We search title, description, tags with weights and combine scores.
   - Exposes two helpers:
     - fuzzySearchBlogsWithScores(...) -> list of { blog, score } sorted
     - fuzzySearchBlogs(...) -> Blog[] (top matches)
*/

/** Score a pattern against text. 0 = no match, higher = better match. */
function fuzzyScore(pattern: string, text: string): number {
	if (!pattern) return 0;
	const s = pattern.toLowerCase();
	const t = text.toLowerCase();

	let si = 0;
	let ti = 0;
	let matches = 0;
	let consecutive = 0;
	let maxConsecutive = 0;
	let firstMatchIndex = -1;
	let lastMatchIndex = -1;

	while (si < s.length && ti < t.length) {
		if (s[si] === t[ti]) {
			if (firstMatchIndex === -1) firstMatchIndex = ti;
			matches++;
			if (lastMatchIndex === ti - 1) {
				consecutive++;
			} else {
				consecutive = 1;
			}
			if (consecutive > maxConsecutive) maxConsecutive = consecutive;
			lastMatchIndex = ti;
			si++;
			ti++;
		} else {
			ti++;
		}
	}

	// If not all pattern characters matched, fail
	if (matches === 0 || si < s.length) return 0;

	// Base score is proportion of matched characters (should be 1 for subsequence),
	// but we keep it as fraction of pattern length to allow partial patterns
	const matchRatio = matches / Math.max(pattern.length, 1);

	// Consecutive bonus (longer runs -> higher score)
	// Normalize by pattern length
	const consecutiveBonus =
		maxConsecutive > 1 ? (maxConsecutive / pattern.length) * 0.5 : 0;

	// Prefix bonus if the first match is at the beginning of the text
	const prefixBonus = firstMatchIndex === 0 ? 0.25 : 0;

	// Density: how tight the matches are (less spread between first and last is better)
	const spread = lastMatchIndex - firstMatchIndex + 1;
	const densityBonus = spread > 0 ? (matches / spread) * 0.25 : 0;

	// Small length penalty for very long texts to prefer shorter/closer matches
	const lengthPenalty = Math.min(0.2, t.length / 1000);

	let score =
		matchRatio + consecutiveBonus + prefixBonus + densityBonus - lengthPenalty;

	// clamp to a small positive number if >0, else 0
	if (score < 0) score = 0;
	return score;
}

/** Combine scores for a blog across title/description/tags using weights. */
function scoreBlogAgainstQuery(blog: Blog, query: string) {
	const q = query.trim();
	if (!q) return 0;

	// weights chosen to prioritize title, then description, then tags
	const titleWeight = 0.6;
	const descWeight = 0.3;
	const tagsWeight = 0.1;

	const titleScore = fuzzyScore(q, blog.title || "");
	const descScore = fuzzyScore(q, blog.description || "");
	// For tags, take best score among tags (if any)
	let tagsScore = 0;
	for (const tag of blog.tags ?? []) {
		const s = fuzzyScore(q, tag);
		if (s > tagsScore) tagsScore = s;
	}

	// Weighted sum
	const combined =
		titleWeight * titleScore + descWeight * descScore + tagsWeight * tagsScore;
	return combined;
}

export type FuzzyOptions = {
	/** Minimum score threshold to include result (0..1). Defaults to 0.08 (low) */
	threshold?: number;
	/** Maximum number of results to return (top N). Omit for all matches. */
	limit?: number;
};

/** Return matches with scores (sorted desc). */
export function fuzzySearchBlogsWithScores(
	query: string,
	options: FuzzyOptions = {},
): { blog: Blog; score: number }[] {
	const { threshold = 0.08, limit } = options;
	const q = query.trim();
	if (!q) return [];

	const scored = BLOGS.map((b) => ({
		blog: b,
		score: scoreBlogAgainstQuery(b, q),
	})).filter((r) => r.score > 0);
	const filtered = scored.filter((r) => r.score >= threshold);
	filtered.sort(
		(a, b) =>
			b.score - a.score ||
			a.blog.title.localeCompare(b.blog.title, undefined, {
				sensitivity: "base",
			}),
	);
	return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

/** Convenience: return blogs (sorted by relevance). */
export function fuzzySearchBlogs(
	query: string,
	options: FuzzyOptions = {},
): Blog[] {
	return fuzzySearchBlogsWithScores(query, options).map((r) => r.blog);
}
