"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const open = () => setHidden(true);
		const close = () => setHidden(false);
		window.addEventListener("infopanel:open", open);
		window.addEventListener("infopanel:close", close);
		return () => {
			window.removeEventListener("infopanel:open", open);
			window.removeEventListener("infopanel:close", close);
		};
	}, []);

	return (
		<nav
			className={`sticky top-0 z-50 backdrop-blur-sm backdrop-saturate-150 bg-white/70 dark:bg-black/60 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-opacity duration-200 ${
				hidden ? "opacity-0 pointer-events-none" : "opacity-100"
			}`}
		>
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
				</div>
			</div>
		</nav>
	);
}
