import React from "react";
import { Github, Linkedin } from "lucide-react";
import { SiX, SiMedium } from "react-icons/si";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  x?: string; // formerly Twitter
  medium?: string;
};

type Props = {
  links?: SocialLinks;
  className?: string;
  iconSize?: number;
};

/**
 * Renders a row of social icon links.
 *
 * Notes:
 * - Only renders an icon if the corresponding link is provided.
 * - Uses inline SVG icons (minimal, dependency free).
 */
export default function Socials({
  links = {},
  className = "",
  iconSize = 18,
}: Props) {
  const commonButtonClasses =
    "inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.github ? (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
        >
          <Github size={iconSize} aria-hidden="true" />
        </a>
      ) : null}

      {links.linkedin ? (
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
        >
          <Linkedin size={iconSize} aria-hidden="true" />
        </a>
      ) : null}

      {links.x ? (
        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
        >
          <SiX size={iconSize} aria-hidden="true" />
        </a>
      ) : null}

      {links.medium ? (
        <a
          href={links.medium}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Medium"
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
        >
          <SiMedium size={iconSize} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}
