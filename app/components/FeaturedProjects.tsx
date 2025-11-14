"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "../lib/projects";

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (projectId: string) => {
    setLoadedImages(prev => new Set(prev).add(projectId));
  };

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="space-y-8">
      {featuredProjects.map((project) => {
        const isLoaded = loadedImages.has(project.id);
        
        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {project.heroImage && (
                <div className="relative w-full md:w-24 aspect-[3/2] flex-shrink-0 rounded-lg overflow-hidden">
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
                  )}
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 6rem, 100vw"
                    className="object-cover"
                    quality={100}
                    onLoad={() => handleImageLoad(project.id)}
                  />
                </div>
              )}
              <div className="flex-1 mt-2 md:mt-0">
                <div className="text-lg font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  {project.title}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
