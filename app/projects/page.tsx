import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllProjects } from "../lib/projects";
import { PROJECT_TAGS } from "../lib/tags";
import SearchableList from "../components/SearchableList";
import ProjectsContent from "./ProjectsContent";

export const metadata: Metadata = {
  title: "Projects - Atharva Verma",
  description: "A collection of projects and work",
};

const PROJECTS = getAllProjects();

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <ProjectsContent projects={PROJECTS} />
      </div>
    </main>
  );
}
