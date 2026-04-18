import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string().min(5),
		description: z.string().min(10),
		projectKey: z.enum(['act-elearning', 'ecommerce-frontend', 'le-restaurant', 'zeroday']),
		projectName: z.string(),
		part: z.number().int().positive(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
