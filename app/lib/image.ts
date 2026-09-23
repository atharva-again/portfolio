export type ImageAspect = "3/2" | "16/9";

export function imageAspectClass(aspect?: ImageAspect): string {
	return aspect === "16/9" ? "aspect-video" : "aspect-[3/2]";
}
