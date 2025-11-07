export type LinkItem = {
  url: string;
  type: "repo" | "demo" | "docs";
};

export type Project = {
  id: string;
  title: string;
  description: string;
  year?: string;
  tech?: string[];
  links?: LinkItem[];
  heroImage?: string;
  screenshots?: string[];
  tags?: string[];
  status?: "active" | "archived" | "in-progress";
  problemStatement?: string;
  solution?: string;
  architecture?: string;
  problemsFaced?: string;
  learnings?: string;
  futureVision?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "samvaad",
    title: "Samvaad",
    description:
      "Voice-first learning/information-gathering platform. Allows users to upload their docs and have text or voice conversations with them.",
    year: "2025",
    tech: ["Python", "FastAPI", "React", "Next.js", "Postgres", "OpenAI"],
    links: [
      { url: "https://github.com/atharva-again/samvaad", type: "repo" },
      
    ],
    heroImage: "/samvaad-hero.png",
    screenshots: [
    
    ],
    tags: ["NLP", "ASR", "TTS", "GenAI", "Python"],
    status: "active",
    problemStatement: "Users struggle to quickly extract insights from large documents without reading everything. Traditional search is slow and voice-based interaction is limited.",
    solution: "Built a conversational AI that ingests documents and allows natural language queries via text or voice, using RAG for accurate responses.",
    architecture: "Frontend in Next.js handles UI and voice input/output. Backend uses FastAPI with OpenAI for embeddings and generation, Postgres for vector storage.",
    problemsFaced: "Integrating ASR/TTS reliably, optimizing vector search for large docs, handling privacy concerns with user data.",
    learnings: "Deepened knowledge in LLM fine-tuning, real-time audio processing, and scalable data pipelines.",
    futureVision: "Expand to multi-modal inputs (screenshots/videos), integrate with productivity tools, and add collaborative features.",
  },
  {
    id: "alertship",
    title: "AlertShip",
    description:
      "A super app for neighborhoods to get notified about upcoming outages and emergencies.",
    year: "2025",
    tech: ["React", "Next.js", "Tailwind CSS", "Firebase"],
    links: [
      { url: "https://github.com/atharva-again/alertship", type: "repo" },
      { url: "https://alertship.vercel.app/", type: "demo" },
    ],
    heroImage: "/alertship-hero.png",
    screenshots: ["/alertship-hero.png", "/alertship-1.png"],
    tags: ["React", "Next.js", "JS/TS"],
    status: "in-progress",
    problemStatement: "Communities lack timely information about local outages and emergencies, leading to unpreparedness and confusion.",
    solution: "Developed a geo-targeted notification app where admins can broadcast alerts and users receive real-time updates.",
    architecture: "Next.js frontend with Firebase for real-time database and notifications. Uses geolocation APIs for targeting.",
    problemsFaced: "Ensuring low-latency notifications, handling user permissions for location, scaling for multiple neighborhoods.",
    learnings: "Improved skills in real-time web apps, Firebase integration, and UX for emergency communications.",
    futureVision: "Add AI-powered alert prioritization, integrate with official emergency services, and expand to global communities.",
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}
