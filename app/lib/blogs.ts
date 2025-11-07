import { BLOG_TAGS } from "./tags";

/**
 * portfolio/app/lib/blogs.ts
 *
 * Canonical blog data and helpers, including a small built-in fuzzy search
 * implementation (no external dependencies). The fuzzy search is intentionally
 * lightweight but effective for small collections of posts.
 *
 * - Exported items:
 *   - type Blog
 *   - BLOGS (array)
 *   - getAllBlogs()
 *   - getBlog(slug)
 *   - getAllBlogTags()
 *   - getBlogTagCounts()
 *   - fuzzySearchBlogs(query, options) -> Blog[]
 *   - fuzzySearchBlogsWithScores(query, options) -> { blog, score }[]
 *
 * Notes:
 * - The fuzzy search works across title, description and tags with weights.
 * - It uses a subsequence-match scoring algorithm with bonuses for consecutive
 *   matches and prefix matches. Results are returned sorted by score desc.
 */

export type Blog = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
};

export const BLOGS: Blog[] = [
  {
    slug: "welcome",
    title: "Welcome",
    description: "A short welcome post and introduction to this blog.",
    date: "Jan 2025",
    tags: ["intro", "about"],
  },
  {
    slug: "tech-notes",
    title: "Tech Notes",
    description: "Quick notes and learnings from building projects.",
    date: "Feb 2025",
    tags: ["tech", "notes", "dev"],
  },
  {
    slug: "misc-thoughts",
    title: "Misc Thoughts",
    description: "Miscellaneous ideas and short-form writing.",
    date: "Mar 2025",
    tags: ["misc", "ideas"],
  },
];

/** Basic accessors */
export function getAllBlogs(): Blog[] {
  return BLOGS;
}

export function getBlog(slug: string): Blog | undefined {
  return BLOGS.find((p) => p.slug === slug);
}

/** Tag helpers */
export function getAllBlogTags(): string[] {
  const set = new Set<string>();
  for (const p of BLOGS) {
    for (const t of p.tags ?? []) {
      // Only include tags that are in BLOG_TAGS (case-insensitive)
      if (BLOG_TAGS.some(at => at.toLowerCase() === t.toLowerCase())) {
        set.add(t);
      }
    }
  }
  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function getBlogTagCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of BLOGS) {
    for (const t of p.tags ?? []) {
      if (BLOG_TAGS.some(at => at.toLowerCase() === t.toLowerCase())) {
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
  const consecutiveBonus = maxConsecutive > 1 ? (maxConsecutive / pattern.length) * 0.5 : 0;

  // Prefix bonus if the first match is at the beginning of the text
  const prefixBonus = firstMatchIndex === 0 ? 0.25 : 0;

  // Density: how tight the matches are (less spread between first and last is better)
  const spread = lastMatchIndex - firstMatchIndex + 1;
  const densityBonus = spread > 0 ? (matches / spread) * 0.25 : 0;

  // Small length penalty for very long texts to prefer shorter/closer matches
  const lengthPenalty = Math.min(0.2, t.length / 1000);

  let score = matchRatio + consecutiveBonus + prefixBonus + densityBonus - lengthPenalty;

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
  const combined = titleWeight * titleScore + descWeight * descScore + tagsWeight * tagsScore;
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
  options: FuzzyOptions = {}
): { blog: Blog; score: number }[] {
  const { threshold = 0.08, limit } = options;
  const q = query.trim();
  if (!q) return [];

  const scored = BLOGS.map((b) => ({ blog: b, score: scoreBlogAgainstQuery(b, q) })).filter((r) => r.score > 0);
  const filtered = scored.filter((r) => r.score >= threshold);
  filtered.sort((a, b) => b.score - a.score || a.blog.title.localeCompare(b.blog.title, undefined, { sensitivity: "base" }));
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

/** Convenience: return blogs (sorted by relevance). */
export function fuzzySearchBlogs(query: string, options: FuzzyOptions = {}): Blog[] {
  return fuzzySearchBlogsWithScores(query, options).map((r) => r.blog);
}
