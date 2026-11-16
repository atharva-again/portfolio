import type { ImageMetadata } from "astro";

export type ImageAspect = "3/2" | "16/9";
export type ImageSource = string | ImageMetadata;

export function imageSource(source: ImageSource): string {
  return typeof source === "string" ? source : source.src;
}

export function imageAspectClass(aspect?: ImageAspect): string {
  return aspect === "16/9" ? "image-aspect-video" : "image-aspect-landscape";
}
