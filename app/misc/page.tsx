import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Misc - Atharva Verma",
  description: "Miscellaneous notes, links, and experiments",
};

type MiscItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

const MISC_ITEMS: MiscItem[] = [
  {
    id: "notes",
    title: "Notes",
    description: "Short notes and snippets that do not belong elsewhere.",
  },
  {
    id: "links",
    title: "Links",
    description: "Useful links and references I find interesting.",
    href: "https://example.com",
  },
  {
    id: "tools",
    title: "Tools",
    description: "Small utilities and tools I use or have built.",
  },
];

export default function MiscPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Misc</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A collection of things that do not fit elsewhere. Notes, links, and
            small experiments.
          </p>
        </header>

        <div className="space-y-12">
          {MISC_ITEMS.map((item) => (
            <article key={item.id} className="group">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h2 className="text-xl font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {item.title} ↗
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    {item.description}
                  </p>
                </a>
              ) : (
                <Link href={`/misc/${item.id}`}>
                  <h2 className="text-xl font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    {item.description}
                  </p>
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
