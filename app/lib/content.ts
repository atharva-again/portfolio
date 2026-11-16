import { getCollection, type CollectionEntry } from "astro:content";

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type Blog = CollectionEntry<"blogs">;
export type Project = CollectionEntry<"projects">;
export type ContentEntry = Blog | Project;

export async function getBlogs(): Promise<Blog[]> {
  return (await getCollection("blogs")).sort((left, right) => left.data.order - right.data.order);
}

export async function getProjects(): Promise<Project[]> {
  return (await getCollection("projects")).sort((left, right) => left.data.order - right.data.order);
}
