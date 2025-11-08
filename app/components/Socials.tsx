import React from "react";
import { SiGithub, SiLinkedin, SiX, SiMedium, SiGmail } from "react-icons/si";
import HoverPreviewLink, { type HoverPreviewContent } from "./HoverPreviewLink";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  x?: string; 
  medium?: string;
  email?: string;
};

type Props = {
  links?: SocialLinks;
  className?: string;
  iconSize?: number;
  forceEmailPlacement?: boolean;
};


export default function Socials({
  links = {},
  className = "",
  iconSize = 18,
  forceEmailPlacement = false,
}: Props) {
  const commonButtonClasses =
    "inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";

  const socialPreviews: Record<string, HoverPreviewContent> = {
    "https://github.com/atharva-again": {
      title: "GitHub",
      description: "Explore my open-source projects and code contributions.",
      image: "/github-hero.png",
    },
    "https://www.linkedin.com/in/atharva-again": {
      title: "LinkedIn",
      description: "I don't really like LinkedIn but just putting it out there.",
      image: "/linkedin-hero.png",
    },
    "https://x.com/atharva_again": {
      title: "X", 
      description: "For my random thoughts and projects, tech or otherwise.",
      image: "/x-hero.png",
    },
    "https://medium.com/@atharva-again": {
      title: "Medium",
      description: "I try to write at least one article per project.",
      image: "/medium-hero.png",
    },
    "mailto:atharva.verma18@gmail.com": {
      title: "Email",
      description: "I keep my inboxes clean (not kidding).",
    },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.github ? (
          <HoverPreviewLink
            href={links.github}
            preview={socialPreviews[links.github]}
            className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
            external
            placement={["above", "below"]}
          >
            <SiGithub size={iconSize} aria-hidden="true" />
          </HoverPreviewLink>
      ) : null}

      {links.linkedin ? (
        <HoverPreviewLink
          href={links.linkedin}
          preview={socialPreviews[links.linkedin]}
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
          external
          placement={["above", "below"]}
        >
          <SiLinkedin size={iconSize} aria-hidden="true" />
        </HoverPreviewLink>
      ) : null}

      {links.x ? (
        <HoverPreviewLink
          href={links.x}
          preview={socialPreviews[links.x]}
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
          external
          placement={["above", "below"]}
        >
          <SiX size={iconSize} aria-hidden="true" />
        </HoverPreviewLink>
      ) : null}

      {links.medium ? (
        <HoverPreviewLink
          href={links.medium}
          preview={socialPreviews[links.medium]}
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
          external
          placement={["above", "below"]}
        >
          <SiMedium size={iconSize} aria-hidden="true" />
        </HoverPreviewLink>
      ) : null}
      {links.email ? (
        <HoverPreviewLink
          href={`mailto:${links.email}`}
          preview={socialPreviews[`mailto:${links.email}`]}
          className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
          external
          placement={["below"]}
          forcePlacement={forceEmailPlacement}
        >
          <SiGmail size={iconSize} aria-hidden="true" />
        </HoverPreviewLink>
      ) : null}

    </div>
  );
}
