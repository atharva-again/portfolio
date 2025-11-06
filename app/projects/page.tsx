import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllProjects } from "../lib/projects";

export const metadata: Metadata = {
  title: "Projects - Atharva Verma",
  description: "A collection of projects and work",
};

const PROJECTS = getAllProjects();

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A collection of things I have built.
          </p>
        </header>

        <section className="space-y-12">
          {PROJECTS.map((project) => (
            <article key={project.id} className="group">
              <Link href={`/projects/${project.id}`}>
                <div className="flex flex-col md:flex-row gap-6">
                  {project.heroImage && (
                    <div className="relative w-full md:w-48 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={project.heroImage}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 12rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                          {project.description}
                        </p>
                      </div>
                      {project.year && (
                        <span className="text-sm text-zinc-400 dark:text-zinc-500 ml-4 shrink-0">
                          {project.year}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
