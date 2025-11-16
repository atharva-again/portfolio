import { getAllProjects, type Project } from "./projects";
import { getAllBlogs, type Blog } from "./blogs";

export const PROJECT_TAGS = [
  "Python",
  "GenAI",
  "ASR",
  "TTS",
  "NLP",
  "React",
  "Next.js",
  "JS/TS",
  "Go",
  "Bash",
  "Powershell",
  "Web Dev",
] as const;

export const FEATURED_PROJECT_TAGS = [
  "Web Dev",
  "NLP",
  "GenAI",
  "Python",
  "React",
  "Next.js",
  "JS/TS",
] as const;

export const BLOG_TAGS = [
  "Tech",
] as const;

export type ProjectTag = typeof PROJECT_TAGS[number];
export type BlogTag = typeof BLOG_TAGS[number];

type CountMap = Record<string, number>;

export type CombinedCounts = Record<
  string,
  {
    projects: number;
    blogs: number;
    total: number;
  }
>;

/** Normalize a tag string (trim). We keep original casing otherwise. */
function normalize(tag: string): string {
  return tag.trim();
}

/** Accumulate tag counts from an array of items that may have a `tags?: string[]` field. */
function accumulateCounts<T extends { tags?: string[] }>(items: T[], validTags: readonly string[]): CountMap {
  const counts: CountMap = {};
  const validTagsLower = validTags.map(t => t.toLowerCase());
  for (const it of items) {
    for (const rawTag of it.tags ?? []) {
      const t = normalize(rawTag);
      if (!t) continue;
      // Only count tags that are in the valid tags list (case-insensitive)
      if (validTagsLower.includes(t.toLowerCase())) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
  }
  return counts;
}

/** Return a sorted list of tags (alphabetical, case-insensitive via localeCompare). */
function keysSorted(counts: CountMap): string[] {
  return Object.keys(counts).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/** Projects */

/** Get a map of project tag => count. */
export function getProjectTagCounts(): CountMap {
  const projects = getAllProjects();
  return accumulateCounts<Project>(projects, PROJECT_TAGS);
}

/** Get sorted unique project tags. */
export function getAllProjectTags(): string[] {
  return keysSorted(getProjectTagCounts());
}

/** Posts */

/** Get a map of post tag => count. */
export function getBlogTagCounts(): CountMap {
  const posts = getAllBlogs();
  return accumulateCounts<Blog>(posts, BLOG_TAGS);
}

/** Get sorted unique post tags. */
export function getAllBlogTags(): string[] {
  return keysSorted(getBlogTagCounts());
}

/** Combined / Cross-collection helpers */

/** Get a combined map of tags with counts split by projects and posts. */
export function getCombinedTagCounts(): CombinedCounts {
  const pCounts = getProjectTagCounts();
  const blogCounts = getBlogTagCounts();

  const combined: CombinedCounts = {};

  const allTags = new Set<string>([
    ...PROJECT_TAGS,
    ...BLOG_TAGS,
    ...Object.keys(pCounts),
    ...Object.keys(blogCounts),
  ]);
  for (const t of allTags) {
    const p = pCounts[t] ?? 0;
    const b = blogCounts[t] ?? 0;
    combined[t] = { projects: p, blogs: b, total: p + b };
  }

  return combined;
}

/** Get a sorted list of all tags used across projects and posts. */
export function getAllTags(): string[] {
  return [...new Set([...PROJECT_TAGS, ...BLOG_TAGS])].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/** Utility: get tags present in projects but not in posts (and vice-versa) */
export function getProjectOnlyTags(): string[] {
  const allProject = new Set(getAllProjectTags());
  for (const t of getAllBlogTags()) allProject.delete(t);
  return Array.from(allProject).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

export function getBlogOnlyTags(): string[] {
  const allBlog = new Set(getAllBlogTags());
  for (const t of getAllProjectTags()) allBlog.delete(t);
  return Array.from(allBlog).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/** Convenience: flattened list of popular tags across both collections ordered by total usage desc. */
export function getPopularTags(
  limit?: number,
): { tag: string; projects: number; blogs: number; total: number }[] {
  const combined = getCombinedTagCounts();
  const arr = Object.entries(combined)
    .map(([tag, counts]) => ({
      tag,
      projects: counts.projects,
      blogs: counts.blogs,
      total: counts.total,
    }))
    .sort(
      (a, b) =>
        b.total - a.total ||
        a.tag.localeCompare(b.tag, undefined, { sensitivity: "base" }),
    );
  return typeof limit === "number" ? arr.slice(0, limit) : arr;
}
