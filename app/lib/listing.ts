import type { ImageAspect, ImageSource } from "./image";

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  date?: string;
  tags: string[];
  image?: ImageSource;
  imageAspect?: ImageAspect;
};
