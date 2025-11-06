export type Project = {
  id: string;
  title: string;
  description: string;
  year?: string;
  repo?: string;
  deploy?: string;
  heroImage?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "samvaad",
    title: "Samvaad",
    description:
      "Voice-first learning/information-gathering platform. Allows users to upload their docs and have text or voice conversations with them.",
    year: "2025",
    repo: "https://github.com/atharva-again/samvaad",
    deploy: "",
    heroImage:
      "/samvaad-hero.png",
  },
  {
    id: "alertship",
    title: "AlertShip",
    description:
      "A super app for neighborhoods to get notified about upcoming outages and emergencies.",
    year: "2025",
    repo: "https://github.com/atharva-again/alertship",
    deploy: "https://alertship.vercel.app/",
    heroImage: "/alertship-hero.png"
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}
