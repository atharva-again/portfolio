import type { Metadata } from "next";
import Link from "next/link";
import HoverPreviewLink, {
  type HoverPreviewContent,
} from "./components/HoverPreviewLink";
import { getAllProjects } from "./lib/projects";
import { FEATURED_PROJECT_TAGS } from "./lib/tags";
import Socials from "./components/Socials";
import { CONTACT } from "./lib/contact";
import { samvaadHero, mitsHero, qHero } from "./content/assets/images";
import FeaturedProjects from "./components/FeaturedProjects";

export const metadata: Metadata = {
  title: "Atharva Verma",
  description: "Software engineer and builder",
};

const hyperlinkPreviews: Record<string, HoverPreviewContent> = {
  "https://github.com/atharva-again/samvaad": {
    title: "Samvaad",
    description:
      "A voice-first learning platform that turns dense documents into conversational study sessions.",
    image: samvaadHero,
  },
  "https://web.mitsgwalior.in/": {
    title: "MITS Gwalior",
    description:
      "Madhav Institute of Technology & Science is a NAAC A++ deemed university in Gwalior, MP, India",
    image: mitsHero,
  },
};

export default function Home() {
  const projects = getAllProjects();

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
            <br />
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
            , a voice-first learning platform.
            <br />
            <br />
            Beyond the tech side of things, I love and advocate for good public
            transport. I think for any city, public transport and infra is
            crucial. My other interests are modern cinema, hip-hop and
            electronic music, and a new one I discovered recently: ricing my
            linux desktop.
          </p>

          <div className="mt-6">
            <Socials links={CONTACT} className="mt-2" iconSize={18} />
          </div>
        </section>

        <section id="experience" className="mb-16">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              Experience (or the tech i have worked with)
            </h2>
          </div>

          <div className="rounded-md -mx-6 bg-white dark:bg-black/60">
            <div className="px-6 py-6">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                I’ve worked across frontend and backend stacks, RAG systems, and
                developed some robotic systems. Below are technologies I use
                frequently:
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {FEATURED_PROJECT_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/projects?tags=${encodeURIComponent(tag)}`}
                    className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm italic text-zinc-500 dark:text-zinc-400">
            PS: Click any tag to view projects related to that technology.
          </p>
        </section>

        <section id="upto" className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              What I am Upto These Days
            </h2>
          </div>

          <div className="rounded-md -mx-6 bg-white dark:bg-black/60">
            <div className="px-6 py-6">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <b>Building</b>: Working on jumping Samvaad from v0.1 to v1.0 by
                developing the frontend, making it production ready and
                deploying it so anyone, anywhere can use it.
                <br />
                <br />
                <b>Learning</b>: Learning about conformers and how I can
                finetune and quantify large ASR and TTS models trained on Indic
                languages to be used in Samvaad. Apart from this, I am also a
                third-year student at{" "}
                <HoverPreviewLink
                  href="https://web.mitsgwalior.in/"
                  className="underline decoration-sky-500 decoration-2 underline-offset-4 transition-colors hover:text-sky-600 dark:hover:text-sky-300"
                  preview={hyperlinkPreviews["https://web.mitsgwalior.in/"]}
                  placement={["above", "below"]}
                >
                  MITS Gwalior
                </HoverPreviewLink>{" "}
                studying AI and Robotics.
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm italic text-zinc-500 dark:text-zinc-400">
            Updated: Nov 6, 2025
          </p>
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
            <h2 className="text-2xl font-semibold">Recent Writing</h2>
            <Link
              href="/blog"
              className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-8">
            <div>
              <Link
                href="/blog/welcome"
                className="text-lg font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Welcome
              </Link>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                A short welcome post and introduction to this blog.
              </p>
            </div>
            <div>
              <Link
                href="/blog/tech-notes"
                className="text-lg font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Tech Notes
              </Link>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Quick notes and learnings from building projects.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
