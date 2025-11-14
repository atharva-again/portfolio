import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, PROJECTS } from "../../lib/projects";
import { contentMap } from "../../content/projects/content";
import ProjectInfoPanel from "../../components/ProjectInfoPanel";
import ProjectHeroImage from "../../components/ProjectHeroImage";

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

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export const dynamicParams = false;

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);

  if (!project) {
    notFound();
  }

  const contentKey = project.contentFile?.replace('.mdx', '') || id;
  const Content = contentMap[contentKey as keyof typeof contentMap];

  if (!Content) {
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
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            {project.heroImage && (
              <ProjectHeroImage
                src={project.heroImage}
                alt={project.title}
              />
            )}

            <ProjectInfoPanel project={project} variant="mobile" />

            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100">
              <Content />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1 mt-12 md:mt-0 hidden md:block">
            <ProjectInfoPanel project={project} className="sticky top-24" />
          </aside>
        </div>
      </div>
    </main>
  );
}
