import type { StaticImageData } from 'next/image';
import { samvaadHero, alertshipHero, portfolioHero, qHero } from '../content/assets/images';

export type LinkItem = {
  url: string;
  type: "repo" | "demo" | "docs" | "medium";
};

export type Project = {
  id: string;
  title: string;
  description: string;
  year?: string;
  links?: LinkItem[];
  heroImage?: string | StaticImageData;
  tags?: string[];
  status?: "active" | "archived";
  problemStatement?: string;
  solution?: string;
  architecture?: string;
  problemsFaced?: string;
  learnings?: string;
  futureVision?: string;
  featured?: boolean;
  contentFile?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "samvaad",
    title: "Samvaad",
    description:
      "Voice-first learning/information-gathering platform. Allows users to upload their docs and have text or voice conversations with them.",
    year: "Sep 2025",
    links: [
      { url: "https://github.com/atharva-again/samvaad", type: "repo" },
      
    ],
    heroImage: samvaadHero,
    tags: ["NLP", "ASR", "TTS", "GenAI", "Python"],
    status: "active",
    featured: true,
    contentFile: "samvaad.mdx",
  },

  {
    id: "q",
    title: "q",
    description:
      "For people that like terminals over browsers. A minimalist, aesthetic,and cross-platform terminal tool to query LLMs.",
    year: "Nov 2025",
    links: [
      { url: "https://github.com/atharva-again/q", type: "repo" },
    ],
    heroImage: qHero,
    tags: ["Go", "Bash", "Powershell"],
    status: "active",
    featured: true,
    contentFile: "q.mdx",
  },

  {
    id: "alertship",
    title: "AlertShip",
    description:
      "A super app for neighborhoods to get notified about upcoming outages and emergencies.",
    year: "Jun 2025",
    links: [
      { url: "https://github.com/atharva-again/alertship", type: "repo" },
      { url: "https://alertship.vercel.app/", type: "demo" },
    ],
    heroImage: alertshipHero,
    tags: ["Web Dev", "React", "Next.js", "JS/TS"],
    status: "archived",
    featured: false,
    contentFile: "alertship.mdx",
  },

  {
    id: "portfolio",
    title: "Portfolio",
    year: "Nov 2025",
    description:
      "I have tried to keep the design minimalistic with keeping user experience in mind, however subtle.",
    links: [
      { url: "https://github.com/atharva-again/portfolio", type: "repo" },
      { url: "https://atharvaverma.dev/", type: "demo" },
    ],
    heroImage: portfolioHero,
    tags: ["Web Dev", "React", "Next.js", "JS/TS"],
    status: "active",
    featured: false,
    contentFile: "portfolio.mdx",
  }
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}
