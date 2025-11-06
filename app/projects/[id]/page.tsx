import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject } from "../../lib/projects";
import { Github, ExternalLink } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) {
    return {
      title: "Project",
      description: "Project not found",
    };
  }

  return {
    title: `${project.title} — Projects • Atharva Verma`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="mb-8">
          <Link
            href="/projects"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to projects
          </Link>

          {project.heroImage && (
            <div className="mt-6 max-w-xl mx-auto">
              <Image
                src={project.heroImage}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg mx-auto"
              />
            </div>
          )}

          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            {project.title}
          </h1>
          {project.year ? (
            <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {project.year}
            </div>
          ) : null}

          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>

          <div className="mt-6 flex gap-2">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-zinc-100 p-2 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="View repository"
              >
                <Github className="w-4 h-4" />
              </a>
            ) : null}
            {project.deploy ? (
              <a
                href={project.deploy}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-zinc-100 p-2 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="View deployment"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : null}
          </div>
        </header>

        <section className="prose max-w-none dark:prose-invert">
          <h2>Overview</h2>
          <p>
            This is a placeholder project page for{" "}
            <strong>{project.title}</strong>. Add a detailed writeup,
            screenshots, links, or embedded demos here when you're ready.
          </p>

          <h3>What to add next</h3>
          <ul>
            <li>Short summary / problem statement</li>
            <li>Role (if this was a team project)</li>
            <li>Tech stack and architecture diagrams</li>
            <li>Links to live demos or hosted instances</li>
            <li>Screenshots or short GIFs</li>
            <li>Link to the repository (already provided above)</li>
          </ul>

          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            Tip: If you want, I can scaffold a README importer that renders the
            project's README automatically on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
