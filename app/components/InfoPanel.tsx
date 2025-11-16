"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiGithub, SiMedium } from "react-icons/si";
import { ExternalLink, FileText, Info, X } from "lucide-react";
import type { Project } from "../lib/projects";
import type { Blog } from "../lib/blogs";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type InfoSection = {
  title?: string;
  content: React.ReactNode;
};

type InfoPanelProps = {
  sections: InfoSection[];
  variant?: "desktop" | "mobile";
  className?: string;
};

const InfoSections = ({ sections }: { sections: InfoSection[] }) => (
  <>
    {sections.map((section, index) => {
      return (
        <div key={String(index)} className={index === sections.length - 1 ? "mb-0" : "mb-6"}>
          {section.title ? (
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
          ) : null}
          {section.content}
        </div>
      );
    })}
  </>
);

const MobilePanel = ({ sections }: { sections: InfoSection[] }) => {
  const [isFloating, setIsFloating] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const hasCollapsedRef = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const sidebarBottom = sidebarRect.bottom;
      const viewportHeight = window.innerHeight;

      // Show button when sidebar bottom is near the top of viewport (with some buffer)
      const shouldFloat = sidebarBottom < viewportHeight * 0.3; // When 70% of sidebar is out of view

      setIsFloating(shouldFloat);
      if (shouldFloat && !hasCollapsedRef.current) {
        setIsOpen(false);
        hasCollapsedRef.current = true;
      }
      if (!shouldFloat) {
        setIsOpen(true);
        hasCollapsedRef.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen || !floatingRef.current) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!floatingRef.current!.contains(event.target as Node) && !buttonRef.current!.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="md:hidden">
      <div
        ref={sidebarRef}
        className="mt-8 mb-15 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6"
      >
        <InfoSections sections={sections} />
      </div>

      <div
        ref={floatingRef}
        className={cx(
          "fixed bottom-50 left-8 right-8 z-40 shadow-2xl rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md p-4 transition-all duration-300 ease-in-out",
          isFloating ? (isOpen ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-0 pointer-events-none"
        )}
        style={
          isFloating && isOpen
            ? {
                transform: "translateY(0)",
              }
            : {
                // animate from the top instead of from bottom; final position unchanged
                transform: "translateY(-120%) scale(0.95)",
                opacity: 0,
                pointerEvents: "none",
              }
        }
      >
        <InfoSections sections={sections} />
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={togglePanel}
        aria-label={isOpen ? "Hide info" : "Show info"}
        aria-expanded={isOpen}
        className={cx(
          "fixed top-1/3 -translate-y-1/2 right-4 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-lg outline-none ring-2 ring-zinc-700 transition-all duration-300",
          isFloating ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {isOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Info className="w-4 h-4" aria-hidden="true" />}
      </button>
    </div>
  );
};

const DesktopPanel = ({ sections, className }: { sections: InfoSection[]; className?: string }) => (
  <div
    className={cx(
      "rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6",
      className
    )}
  >
    <InfoSections sections={sections} />
  </div>
);

export default function InfoPanel({ sections, variant = "desktop", className }: InfoPanelProps) {
  if (variant === "mobile") {
    return <MobilePanel sections={sections} />;
  }
  return <DesktopPanel sections={sections} className={className} />;
}

// BlogInfoPanel - formats Blog data into sections for the generic InfoPanel
export function BlogInfoPanel({ blog, variant = "desktop", className }: { blog: Blog; variant?: "desktop" | "mobile"; className?: string }) {
  const sections: InfoSection[] = [];

  sections.push({
    title: "Year",
    content: <p className="text-base text-zinc-900 dark:text-zinc-100">{blog.date}</p>,
  });

  if (blog.tags && blog.tags.length > 0) {
    sections.push({
      title: "Tags",
      content: (
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blogs?tags=${encodeURIComponent(tag)}`}
              className="inline-block bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-150 cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
      ),
    });
  }

  if (blog.links && blog.links.length > 0) {
    sections.push({
      title: "Links",
      content: (
        <div className="flex flex-row flex-wrap gap-4">
          {blog.links.map((link, index) => {
            const icon =
              link.type === "repo" ? (
                <SiGithub className="w-6 h-6" />
              ) : link.type === "demo" ? (
                <ExternalLink className="w-6 h-6" />
              ) : link.type === "medium" ? (
                <SiMedium className="w-6 h-6" />
              ) : (
                <FileText className="w-6 h-6" />
              );
            return (
              <a
                key={`${link.url}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
                aria-label={link.type}
              >
                {icon}
              </a>
            );
          })}
        </div>
      ),
    });
  }

  return <InfoPanel sections={sections} variant={variant} className={className} />;
}

// Legacy ProjectInfoPanel - now uses the generic InfoPanel
export function ProjectInfoPanel({ project, variant = "desktop", className }: { project: Project; variant?: "desktop" | "mobile"; className?: string }) {
  const sections: InfoSection[] = [];

  if (project.year || project.status) {
    sections.push({
      content: (
        <div className="flex gap-8">
          {project.year && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Year</h4>
              <p className="text-base text-zinc-900 dark:text-zinc-100">{project.year}</p>
            </div>
          )}
          {project.status && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Status</h4>
              <p className="text-base text-zinc-900 dark:text-zinc-100 capitalize">{project.status}</p>
            </div>
          )}
        </div>
      ),
    });
  }

  if (project.tags && project.tags.length > 0) {
    sections.push({
      title: "Tech Stack",
      content: (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Link
              key={tag}
              href={`/projects?tags=${encodeURIComponent(tag)}`}
              className="inline-block bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
      ),
    });
  }

  if (project.links && project.links.length > 0) {
    sections.push({
      title: "Links",
      content: (
        <div className="flex flex-row flex-wrap gap-4">
          {project.links.map((link, index) => {
            const icon =
              link.type === "repo" ? (
                <SiGithub className="w-6 h-6" />
              ) : link.type === "demo" ? (
                <ExternalLink className="w-6 h-6" />
              ) : link.type === "medium" ? (
                <SiMedium className="w-6 h-6" />
              ) : (
                <FileText className="w-6 h-6" />
              );
            return (
              <a
                key={`${link.url}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
                aria-label={link.type}
              >
                {icon}
              </a>
            );
          })}
        </div>
      ),
    });
  }

  return <InfoPanel sections={sections} variant={variant} className={className} />;
}
