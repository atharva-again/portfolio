import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { BLOG_TAGS, PROJECT_TAGS } from "./lib/tag-vocabulary";

const imageAspect = z.enum(["3/2", "16/9"]).optional();
const blogTag = z.enum(BLOG_TAGS);
const projectTag = z.enum(PROJECT_TAGS);
const link = z.object({
	type: z.enum(["repo", "demo", "docs", "medium", "huggingface", "pypi"]),
	url: z.url(),
});

const blogs = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./app/content/blogs" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: z.string(),
			publishedAt: z.string().optional(),
			heroImage: image(),
			heroImageAspect: imageAspect,
			tags: z.array(blogTag),
			links: z.array(link).optional(),
			featured: z.boolean(),
			order: z.number().int().positive(),
		}),
});

const projects = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./app/content/projects" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			year: z.string(),
			heroImage: image(),
			heroImageAspect: imageAspect,
			tags: z.array(projectTag),
			links: z.array(link).optional(),
			status: z.enum(["active", "archived"]),
			featured: z.boolean(),
			order: z.number().int().positive(),
		}),
});

export const collections = { blogs, projects };
