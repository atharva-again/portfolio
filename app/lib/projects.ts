import type { StaticImageData } from "next/image";
import {
  samvaadHero,
  alertshipHero,
  portfolioHero,
  qHero,
  tmbHero,
  indicAsrQuantHero,
  audioragHero,
  urlDetoxHero,
  coodleHero,
  fsemendHero,
  markdawnHero,
} from "../content/assets/images";

export type LinkItem = {
  url: string;
  type: "repo" | "demo" | "docs" | "medium" | "huggingface" | "pypi";
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
      { url: "https://www.samvaad.live", type: "demo" },
    ],
    heroImage: samvaadHero,
    tags: [
      "ASR",
      "TTS",
      "RAG",
      "Python",
      "Next.js",
      "TypeScript",
    ],
    status: "active",
    featured: true,
    contentFile: "samvaad.mdx",
  },

  {
    id: "trackmebaby",
    title: "trackmebaby",
    description:
      "A background desktop app that watches your projects folder and keeps track of what you're working on. Ask AI questions about your work history.",
    year: "Mar 2026",
    links: [
      { url: "https://github.com/Feynmunh/trackmebaby", type: "repo" },
    ],
    heroImage: tmbHero,
    tags: ["Electrobun", "Bun", "Vite", "TypeScript"],
    status: "active",
    featured: true,
    contentFile: "trackmebaby.mdx",
  },

  {
    id: "indic-asr",
    title: "Indic ASR Quantized",
    description:
      "Quantized Indic ASR for multiple Indic languages. INT8 quantization for efficient CPU inference.",
    year: "Dec 2025",
    links: [
      { url: "https://github.com/atharva-again/indic-asr-onnx", type: "repo" },
      { url: "https://huggingface.co/atharva-again/indic-conformer-600m-quantized", type: "huggingface" },
      { url: "https://pypi.org/project/indic-asr-onnx/", type: "pypi" },
    ],
    heroImage: indicAsrQuantHero,
    tags: ["Python", "ONNX", "ASR"],
    status: "archived",
    featured: false,
    contentFile: "indic-asr.mdx",
  },

  {
    id: "audiorag",
    title: "AudioRAG",
    description:
      "Provider-agnostic RAG pipeline for audio content. Transcribe, chunk, embed, and search audio from local files.",
    year: "Feb 2026",
    links: [{ url: "https://github.com/atharva-again/AudioRAG", type: "repo" }],
    heroImage: audioragHero,
    tags: ["Python", "ASR", "RAG"],
    status: "active",
    featured: true,
    contentFile: "audiorag.mdx",
  },

  {
    id: "markdawn",
    title: "Markdawn",
    description:
      "A collaborative note-taking application with real-time editing capabilities.",
    year: "Feb 2026",
    links: [{ url: "https://github.com/atharva-again/Markdawn", type: "repo" }],
    heroImage: markdawnHero,
    tags: ["React.js", "Hono", "Yjs", "TypeScript"],
    status: "active",
    featured: true,
    contentFile: "markdawn.mdx",
  },

  {
    id: "url-detox",
    title: "URL Detox",
    description:
      "Browser extension that cleans URLs by removing tracking parameters and unshortens link shorteners.",
    year: "Nov 2025",
    links: [
      { url: "https://github.com/atharva-again/url-detox", type: "repo" },
    ],
    heroImage: urlDetoxHero,
    tags: ["TypeScript", "Vite", "HTML", "CSS"],
    status: "archived",
    featured: false,
    contentFile: "url-detox.mdx",
  },

  {
    id: "coodle",
    title: "Coodle",
    description:
      "Moodle deadline notification bot that checks for upcoming assignments and sends notifications via Telegram.",
    year: "Jan 2026",
    links: [{ url: "https://github.com/atharva-again/coodle", type: "repo" }],
    heroImage: coodleHero,
    tags: ["Python", "FastAPI", "HTML", "JavaScript"],
    status: "active",
    featured: false,
    contentFile: "coodle.mdx",
  },

  {
    id: "q",
    title: "q",
    description:
      "For people that like terminals over browsers. A minimalist, aesthetic,and cross-platform terminal tool to query LLMs.",
    year: "Nov 2025",
    links: [{ url: "https://github.com/atharva-again/q", type: "repo" }],
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
    tags: ["Next.js", "TypeScript"],
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
    tags: ["Next.js", "TypeScript"],
    status: "active",
    featured: false,
    contentFile: "portfolio.mdx",
  },

  {
    id: "fsemend",
    title: "fsemend",
    description:
      "Collaborative platform for students to share presentations, lab reports, and project reports.",
    year: "Feb 2026",
    links: [
      { url: "https://github.com/atharva-again/fproficiency", type: "repo" },
      { url: "https://fsemend.vercel.app", type: "demo" },
    ],
    heroImage: fsemendHero,
    tags: ["Next.js", "TypeScript", "CSS", "Bun"],
    status: "active",
    featured: false,
    contentFile: "fsemend.mdx",
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}
