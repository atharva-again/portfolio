import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllProjects } from "./lib/projects";
import Socials from "./components/Socials";

export const metadata: Metadata = {
  title: "Atharva Verma",
  description: "Software engineer and builder",
};

export default function Home() {
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
            <a
              href="https://github.com/atharva-again/samvaad"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Samvaad
            </a>
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
            <Socials
              links={{
                github: "https://github.com/atharva-again",
                linkedin: "https://www.linkedin.com/in/atharva-again",
                x: "https://x.com/atharva_again",
                medium: "https://medium.com/@atharva-again",
              }}
              className="mt-2"
              iconSize={18}
            />
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
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  React
                </span>
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  Next.js
                </span>
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  TypeScript
                </span>
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  Python
                </span>
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  GenAI
                </span>
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  ASR
                </span>
                <span className="inline-block rounded px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  TTS
                </span>
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
                <a
                  href="https://web.mitsgwalior.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  MITS Gwalior
                </a>{" "}
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

          <div className="space-y-8">
            {getAllProjects().map((project) => (
              <div
                key={project.id}
                className="flex flex-col md:flex-row gap-4 items-start"
              >
                {project.heroImage && (
                  <div className="relative w-full md:w-24 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 6rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 mt-2 md:mt-0">
                  <Link href={`/projects/${project.id}`} className="block">
                    <div className="text-lg font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                      {project.title}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                      {project.description}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
