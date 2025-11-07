"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Blog } from "../lib/blogs";
import { BLOG_TAGS } from "../lib/tags";
import SearchableList from "../components/SearchableList";

interface BlogContentProps {
  blogs: Blog[];
}

export default function BlogContent({ blogs }: BlogContentProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there are search parameters (tags or query)
    const hasTags = searchParams.get("tags");
    const hasQuery = searchParams.get("q");

    if (hasTags || hasQuery) {
      // Small delay to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        const blogSection = document.getElementById("blog-section");
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <>
      <header className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Writing</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Thoughts on software, technology, and things I am learning.
        </p>
      </header>

      <section id="blog-section" className="mb-12">
        <SearchableList
          items={blogs}
          accessors={{
            getId: (p) => p.slug,
            getTitle: (p) => p.title,
            getDescription: (p) => p.description,
            getHref: (p) => `/blog/${p.slug}`,
            getDate: (p) => p.date,
            getTags: (p) => (p.tags ?? []).filter(tag => BLOG_TAGS.some(t => t.toLowerCase() === tag.toLowerCase())),
          }}
          placeholder="Search posts or tags..."
          syncWithQuery
        />
      </section>
    </>
  );
}