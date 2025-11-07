import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject } from "../../lib/projects";
import { Github, ExternalLink, FileText } from "lucide-react";

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
    <main className="min-h-screen bg-white dark:bg-black text-zinc-800 dark:text-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-12">
          <Link
            href="/projects"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            ← Back to projects
          </Link>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
            {project.description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            {project.heroImage && (
              <div className="mb-12">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="w-full h-auto rounded-lg object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100">
              {project.problemStatement && (
                <section className="mb-10">
                  <h2>Problem Statement</h2>
                  <p>{project.problemStatement}</p>
                </section>
              )}

              {project.solution && (
                <section className="mb-10">
                  <h2>Solution</h2>
                  <p>{project.solution}</p>
                </section>
              )}

              {project.architecture && (
                <section className="mb-10">
                  <h2>Architecture</h2>
                  <p>{project.architecture}</p>
                </section>
              )}

              {project.problemsFaced && (
                <section className="mb-10">
                  <h2>Problems Faced</h2>
                  <p>{project.problemsFaced}</p>
                </section>
              )}

              {project.learnings && (
                <section className="mb-10">
                  <h2>What I Learned</h2>
                  <p>{project.learnings}</p>
                </section>
              )}

              {project.futureVision && (
                <section className="mb-10">
                  <h2>Future Vision</h2>
                  <p>{project.futureVision}</p>
                </section>
              )}
            </div>

            {project.screenshots && project.screenshots.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Screenshots
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.screenshots.map((screenshot, index) => (
                    <Image
                      key={index}
                      src={screenshot}
                      alt={`${project.title} screenshot ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-lg"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1 mt-12 md:mt-0">
            <div className="sticky top-24 p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              {project.year && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Year
                  </h3>
                  <p className="text-base text-zinc-900 dark:text-zinc-100">
                    {project.year}
                  </p>
                </div>
              )}

              {project.tech && project.tech.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-block bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium text-zinc-800 dark:text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.links && project.links.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Links
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {project.links.map((link, index) => {
                      const icon =
                        link.type === "repo" ? (
                          <Github className="w-4 h-4" />
                        ) : link.type === "demo" ? (
                          <ExternalLink className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        );
                      const label =
                        link.type.charAt(0).toUpperCase() + link.type.slice(1);
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                          {icon}
                          <span className="text-sm font-medium">{label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
