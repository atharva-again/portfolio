import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeaturedProjects from "./components/FeaturedProjects";
import Socials from "./components/Socials";
import { getFeaturedBlogs } from "./lib/blogs";
import { CONTACT } from "./lib/contact";
import { getAllProjects } from "./lib/projects";
import { sendkit } from "./content/assets/images";

export const metadata: Metadata = {
	title: "Atharva Verma",
	description: "Software engineer and builder",
};

export default function Home() {
	const projects = getAllProjects();
	const featuredBlogs = getFeaturedBlogs();

	return (
		<main className="min-h-screen bg-white dark:bg-black">
			<div className="mx-auto max-w-4xl px-6 py-16">
				<section className="mb-32">
					<h1 className="text-5xl font-bold tracking-tight mb-6">
						Atharva Verma
					</h1>
					<p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
						I am a product-first developer. What that means is in order for me
						to commit to a project, it needs to have some kind of inherent
						coolness.
						{/* <br />
            <br />
            At the moment, I am working on{" "}
            <HoverPreviewLink
              href="https://github.com/atharva-again/samvaad"
              className="underline decoration-sky-500 decoration-2 underline-offset-4 transition-colors hover:text-sky-600 dark:hover:text-sky-300"
              preview={hyperlinkPreviews["https://github.com/atharva-again/samvaad"]}
              placement={["side-right", "below"]}
            >
              Samvaad
            </HoverPreviewLink>
            , a voice-first RAG platform.
            <br />
            <br /> */}
						<br />
						<br />
						Beyond the tech side of things, I love and advocate for good public
						transport. I think for any city, public transport and infra is
						crucial. My other interests are modern cinema, hip-hop and
						electronic music.
					</p>

					<div className="mt-6">
						<Socials links={CONTACT} className="mt-2" iconSize={18} />
					</div>
				</section>

				<section id="work" className="mb-16">
					<div className="flex items-baseline justify-between mb-4">
						<h2 className="text-2xl font-semibold">
							work work work work work work
						</h2>
					</div>

					<Link
						href="https://sendkit.ai"
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col md:flex-row gap-4 items-start group"
					>
						<div className="relative w-full md:w-24 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
							<Image
								src={sendkit}
								alt="SendKit"
								fill
								sizes="(min-width: 768px) 6rem, 100vw"
								className="object-cover"
								quality={100}
							/>
						</div>
						<div className="flex-1 mt-2 md:mt-0 w-full">
							<div className="flex items-baseline justify-between w-full">
								<span className="text-lg font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
									Product Eng Intern, <b>SendKit</b>
								</span>
								<span className="text-zinc-400 dark:text-zinc-500 text-sm flex-shrink-0 ml-4">
									Jun 2026 - Present
								</span>
							</div>
							<p className="text-zinc-600 dark:text-zinc-400 mt-1">
								Improving user experience across the stack
							</p>
						</div>
					</Link>
				</section>

				<section className="mb-24">
					<div className="flex items-baseline justify-between mb-8">
						<h2 className="text-2xl font-semibold">Selected Projects</h2>
						<Link
							href="/projects"
							className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
						>
							View all →
						</Link>
					</div>

					<FeaturedProjects projects={projects} />
				</section>

				<section>
					<div className="flex items-baseline justify-between mb-8">
						<h2 className="text-2xl font-semibold">Featured Writing</h2>
						<Link
							href="/blogs"
							className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
						>
							View all →
						</Link>
					</div>
					<div className="space-y-8">
						{featuredBlogs.map((blog) => (
							<div key={blog.slug}>
								<Link href={`/blogs/${blog.slug}`} className="block">
									<div className="flex flex-col md:flex-row gap-4 items-start">
										{blog.heroImage && (
											<div className="relative w-full md:w-24 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
												<Image
													src={blog.heroImage}
													alt={blog.title}
													fill
													sizes="(min-width: 768px) 6rem, 100vw"
													className="object-cover"
													quality={100}
												/>
											</div>
										)}
										<div className="flex-1 mt-2 md:mt-0">
											<div className="text-lg font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
												{blog.title}
											</div>
											<p className="text-zinc-600 dark:text-zinc-400 mt-1">
												{blog.description}
											</p>
										</div>
									</div>
								</Link>
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
