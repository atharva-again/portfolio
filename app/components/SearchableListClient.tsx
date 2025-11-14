"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Fuse from "fuse.js";
import type { PlainItem } from "./SearchableList";

/**
 * Client-side interactive list with:
 * - search across title/description/tags/date
 * - tag filtering
 * - query highlighting
 * - optional URL sync (q & tag)
 *
 * Receives only serializable `items` (no functions) so it is safe to use as a
 * Client Component after the server wrapper normalizes data.
 */

type Props = {
  items: PlainItem[];
  placeholder?: string;
  syncWithQuery?: boolean;
  className?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightParts(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark
        key={i}
        className="bg-yellow-50 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SearchableListClient({
  items,
  placeholder = "Search...",
  syncWithQuery = false,
  className = "",
}: Props) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<Map<string, boolean>>(new Map());
  const mounted = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // initialize from URL when component mounts (only once)
  useEffect(() => {
    if (!syncWithQuery || mounted.current) return;
    const q = searchParams.get("q") ?? "";
    const tagsParam = searchParams.get("tags") ?? "";
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    setQuery(q);
    setDebouncedQuery(q);
    setActiveTags(tags);
    // mark mounted so we don't re-initialize
    mounted.current = true;
  }, [syncWithQuery]); // Only depend on syncWithQuery, not searchParams

  // debounce the query for filtering
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  // update URL when debouncedQuery or activeTags changes (if syncWithQuery)
  useEffect(() => {
    if (!syncWithQuery || !mounted.current) return;

    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (activeTags.length > 0) params.set("tags", activeTags.join(","));
    const str = params.toString();
    const newUrl = str ? `${pathname}?${str}` : pathname;

    // Only update URL if it actually changed
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [debouncedQuery, activeTags, syncWithQuery]);

  // compute tag counts and ordered tag list
  const { tagCounts, uniqueTags } = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      for (const t of it.tags ?? []) {
        map.set(t, (map.get(t) ?? 0) + 1);
      }
    }
    const uniq = Array.from(map.keys()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    return { tagCounts: map, uniqueTags: uniq };
  }, [items]);

  // filter items based on activeTags + debouncedQuery
  const filtered = useMemo(() => {
    let candidates = items;
    if (activeTags.length > 0) {
      candidates = items.filter((it) => 
        activeTags.some(tag => (it.tags ?? []).includes(tag))
      );
    }
    if (!debouncedQuery) return candidates;

    const fuse = new Fuse(candidates, {
      keys: ['title', 'description', 'tags', 'date'],
      threshold: 0.4, // Adjust for fuzziness: 0.0 = exact match, 1.0 = very fuzzy
      includeScore: true,
    });
    const results = fuse.search(debouncedQuery);
    return results.map((result) => result.item);
  }, [items, debouncedQuery, activeTags]);

  const reset = () => {
    setQuery("");
    setDebouncedQuery("");
    setActiveTags([]);
    if (syncWithQuery) {
      const newUrl = pathname;
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== newUrl) {
        router.replace(newUrl, { scroll: false });
      }
    }
  };

  const onTagClick = (t: string) => {
    setActiveTags((prev) => 
      prev.includes(t) 
        ? prev.filter(tag => tag !== t) 
        : [...prev, t]
    );
  };

  return (
    <section className={className}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="search" className="sr-only">
          Search
        </label>

        <div className="flex items-center w-full sm:w-auto grow relative">
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pr-10 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer rounded"
              aria-label="Clear search"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {uniqueTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTags([])}
            className={`text-sm px-2 py-1 rounded-md border cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
              activeTags.length === 0
                ? "bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                : "bg-white border-zinc-200 dark:bg-black dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
            aria-pressed={activeTags.length === 0}
            data-tag-all
          >
            All
          </button>

          {uniqueTags.map((t) => {
            const cnt = tagCounts.get(t) ?? 0;
            const active = activeTags.includes(t);
            return (
              <button
                key={t}
                onClick={() => onTagClick(t)}
                className={`flex items-center gap-2 text-sm px-2 py-1 rounded-md border transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                  active
                    ? "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100"
                    : "bg-white border-zinc-200 dark:bg-black dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
                aria-pressed={active}
                title={`Filter by ${t} (${cnt})`}
              >
                <span>{t}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-500">({cnt})</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-8">
        {filtered.length === 0 ? (
          <div className="text-zinc-600 dark:text-zinc-400">No results.</div>
        ) : (
          filtered.map((it) => {
            const isLoaded = loadedImages.get(it.id) ?? false;
            return (
            <article key={it.id} className="group">
              {it.href ? (
                <Link href={it.href} className="block">
                  <div className="flex flex-col md:flex-row gap-4">
                    {it.image && (
                      <div className="relative w-full md:w-40 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={it.image}
                          alt={it.title ?? ""}
                          fill
                          sizes="(min-width: 768px) 10rem, 100vw"
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 md:mt-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            {debouncedQuery ? (
                              // highlight matched parts in title
                              <>{highlightParts(it.title ?? "", debouncedQuery)}</>
                            ) : (
                              it.title
                            )}
                          </h3>
                          {(it.description ?? "") !== "" && (
                            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                              {debouncedQuery ? (
                                <>{highlightParts(it.description ?? "", debouncedQuery)}</>
                              ) : (
                                it.description
                              )}
                            </p>
                          )}
                        </div>

                        {it.date && (
                          <time className="text-sm text-zinc-400 dark:text-zinc-500 ml-4 whitespace-nowrap">
                            {it.date}
                          </time>
                        )}
                      </div>

                      {it.tags && it.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {it.tags.map((t) => (
                            <button
                              key={t}
                              onClick={(e) => {
                                e.preventDefault();
                                onTagClick(t);
                              }}
                              className="text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors"
                              title={`Filter by ${t}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {it.image && (
                      <div className="relative w-full md:w-40 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={it.image}
                          alt={it.title ?? ""}
                          fill
                          sizes="(min-width: 768px) 10rem, 100vw"
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 md:mt-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{it.title}</h3>
                          {(it.description ?? "") !== "" && (
                            <p className="text-zinc-600 dark:text-zinc-400 mt-2">{it.description}</p>
                          )}
                        </div>
                        {it.date && (
                          <time className="text-sm text-zinc-400 dark:text-zinc-500 ml-4 whitespace-nowrap">
                            {it.date}
                          </time>
                        )}
                      </div>
                      {it.tags && it.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {it.tags.map((t) => (
                            <button
                              key={t}
                              onClick={() => onTagClick(t)}
                              className="text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors"
                              title={`Filter by ${t}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })
      )
    }
    </div>
    </section>
  );
}
