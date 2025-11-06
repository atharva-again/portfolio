import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Atharva Verma",
  description: "Writing about code, ideas, and learning",
};

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

const POSTS: Post[] = [
  {
    slug: "welcome",
    title: "Welcome",
    description: "A short welcome post and introduction to this blog.",
    date: "Jan 2025",
  },
  {
    slug: "tech-notes",
    title: "Tech Notes",
    description: "Quick notes and learnings from building projects.",
    date: "Feb 2025",
  },
  {
    slug: "misc-thoughts",
    title: "Misc Thoughts",
    description: "Miscellaneous ideas and short-form writing.",
    date: "Mar 2025",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Writing</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Thoughts on software, technology, and things I am learning.
          </p>
        </header>

        <div className="space-y-12">
          {POSTS.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                      {post.description}
                    </p>
                  </div>
                  <time className="text-sm text-zinc-400 dark:text-zinc-500 ml-4 whitespace-nowrap">
                    {post.date}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
