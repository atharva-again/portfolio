import { portfolioHero } from "../content/assets/images";
import { imageSource, type ImageSource } from "./image";
import type { Blog, Project } from "./content";

export const SITE_NAME = "Atharva Verma";
export const SITE_URL = "https://atharvaverma.com";

export const DEFAULT_SOCIAL_IMAGE = {
  url: imageSource(portfolioHero),
  alt: "Atharva Verma's portfolio",
};

export type PageMetadata = {
  path: string;
  title: string;
  description: string;
  image?: ImageSource;
  openGraphType: "website" | "article";
  noindex?: boolean;
};

export function getBlogMetadata(blog: Blog): PageMetadata {
  return {
    path: `/blogs/${blog.id}`,
    title: `${blog.data.title} — Blog • ${SITE_NAME}`,
    description: blog.data.description,
    image: blog.data.heroImage,
    openGraphType: "article",
  };
}

export function getProjectMetadata(project: Project): PageMetadata {
  return {
    path: `/projects/${project.id}`,
    title: `${project.data.title} — Projects • ${SITE_NAME}`,
    description: project.data.description,
    image: project.data.heroImage,
    openGraphType: "website",
  };
}

type MetaTag = {
  attribute: "name" | "property";
  key: string;
  content: string;
};

type ResolvedPageMetadata = {
  title: string;
  canonical?: string;
  meta: MetaTag[];
};

/** Shared metadata policy for all statically generated pages. */
export function resolvePageMetadata(page: PageMetadata): ResolvedPageMetadata {
  const canonical = page.noindex ? undefined : new URL(page.path, SITE_URL).href;
  const image = new URL(imageSource(page.image ?? DEFAULT_SOCIAL_IMAGE.url), SITE_URL).href;

  return {
    title: page.title,
    canonical,
    meta: [
      { attribute: "name", key: "description", content: page.description },
      ...(page.noindex ? [{ attribute: "name" as const, key: "robots", content: "noindex" }] : []),
      { attribute: "property", key: "og:type", content: page.openGraphType },
      { attribute: "property", key: "og:site_name", content: SITE_NAME },
      ...(canonical ? [{ attribute: "property" as const, key: "og:url", content: canonical }] : []),
      { attribute: "property", key: "og:title", content: page.title },
      { attribute: "property", key: "og:description", content: page.description },
      { attribute: "property", key: "og:image", content: image },
      { attribute: "name", key: "twitter:card", content: "summary_large_image" },
      { attribute: "name", key: "twitter:title", content: page.title },
      { attribute: "name", key: "twitter:description", content: page.description },
      { attribute: "name", key: "twitter:image", content: image },
    ],
  };
}
