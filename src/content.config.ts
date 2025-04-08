import { defineCollection, z } from 'astro:content';

// Define collections for pages and posts
export const collections = {
  pages: defineCollection({
    schema: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      image: z.string().optional(),
      slug: z.string(),
    }),
  }),
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      content: z.string(),
      slug: z.string(),
    }),
  }),
};