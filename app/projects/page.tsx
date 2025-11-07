import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects } from "../lib/projects";
import ProjectsContent from "./ProjectsContent";
import ProjectsContentLoading from "./ProjectsContentLoading";

export const metadata: Metadata = {
  title: "Projects - Atharva Verma",
  description: "A collection of projects and work",
};

const PROJECTS = getAllProjects();

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <Suspense fallback={<ProjectsContentLoading />}>
          <ProjectsContent projects={PROJECTS} />
        </Suspense>
      </div>
    </main>
  );
}
