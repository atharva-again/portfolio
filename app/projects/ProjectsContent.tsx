"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Project } from "../lib/projects";
import { PROJECT_TAGS } from "../lib/tags";
import SearchableList from "../components/SearchableList";

interface ProjectsContentProps {
  projects: Project[];
}

export default function ProjectsContent({ projects }: ProjectsContentProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there are search parameters (tags or query)
    const hasTags = searchParams.get("tags");
    const hasQuery = searchParams.get("q");

    if (hasTags || hasQuery) {
      // Small delay to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        const projectsSection = document.getElementById("projects-section");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <>
      <header className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          A collection of things I have built.
        </p>
      </header>

      <section id="projects-section" className="mb-12">
        <SearchableList
          items={projects}
          accessors={{
            getId: (p) => p.id,
            getTitle: (p) => p.title,
            getDescription: (p) => p.description,
            getHref: (p) => `/projects/${p.id}`,
            getDate: (p) => p.year ?? "",
            getTags: (p) => (p.tags ?? []).filter(tag => PROJECT_TAGS.some(t => t.toLowerCase() === tag.toLowerCase())),
            getImage: (p) => p.heroImage,
          }}
          placeholder="Search projects..."
          syncWithQuery
        />
      </section>
    </>
  );
}