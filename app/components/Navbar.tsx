import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm backdrop-saturate-150 bg-white/70 dark:bg-black/60 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          AV
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="hidden sm:inline-block text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/blogs"
            className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="/misc"
            className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Misc
          </Link>
        </div>
      </div>
    </nav>
  );
}
