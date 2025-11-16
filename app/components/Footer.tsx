import Link from "next/link";
import Socials from "./Socials";
import { CONTACT } from "../lib/contact";
import { ATHARVA_ASCII_ART } from "../lib/ascii";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-4xl px-6 py-12 grid grid-cols-1 sm:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="font-semibold text-lg">
            AV
          </Link>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            I'm Atharva. I love building, learning, investing, 
            designing, writing, reading, thirfting, traveling,
            rails, food, fashion, music, and probably a lot more.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                  href="/blogs"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Blog
                </Link>
            </li>
            <li>
              <Link
                href="/misc"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Misc
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources column removed temporarily */}

        <div>
          <h4 className="text-sm font-medium mb-3">Connect</h4>
          <Socials links={CONTACT} className="" iconSize={18} forceEmailPlacement={true} />

          <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            © {year} Atharva Verma
          </div>
        </div>
      </div>
      {/* Huge decorative name at the bottom of the footer */}
      <div className="mt-8 flex justify-center overflow-hidden px-6">
        <pre
          aria-hidden="true"
          className="pointer-events-none select-none whitespace-pre font-mono text-[0.4rem] leading-none text-zinc-900 dark:text-white opacity-40 sm:text-[0.6rem] md:text-sm lg:text-base"
        >
          {ATHARVA_ASCII_ART}
        </pre>
      </div>
    </footer>
  );
}
