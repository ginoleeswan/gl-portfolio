import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    order: z.number(),
    year: z.string(),
    role: z.string(),
    heroImage: z.string(),
    gallery: z.array(z.string()).default([]),
    techStack: z.array(z.string()),
    liveUrl: z.string().url(),
    repoUrl: z.string().url(),
  }),
});

export const collections = { projects };
