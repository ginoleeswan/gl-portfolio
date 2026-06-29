import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    accent: z.enum(["myth", "glow", "karma"]),
    kana: z.string(),
    order: z.number(),
    year: z.string(),
    role: z.string(),
    heroImage: z.string(),
    gallery: z.array(z.object({ src: z.string(), label: z.string() })).default([]),
    techStack: z.array(z.string()),
    liveUrl: z.url().optional(),
    repoUrl: z.url(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    // ties the post to its app for accent theming + cross-linking
    project: z.enum(["myth", "glow", "karma"]),
    projectSlug: z.string(),
    readingMinutes: z.number(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, writing };
