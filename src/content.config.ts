import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const MetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const FeatureSchema = z
  .array(
    z.union([
      z.string().min(1),
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
      z.record(z.string().min(1), z.string().min(1)),
    ])
  )
  .default([])
  .transform((items) =>
    items.map((item) => {
      if (typeof item !== 'string') {
        if ('title' in item && 'content' in item) return item;
        const entries = Object.entries(item);
        const [key, value] = entries[0] ?? ['', ''];
        return { title: key.trim(), content: String(value).trim() };
      }

      const [rawTitle, ...rest] = item.split(':');
      return {
        title: rawTitle.trim(),
        content: rest.join(':').trim(),
      };
    })
  );

const AchievementSchema = z
  .array(
    z.union([
      z.string().min(1),
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
      z.record(z.string().min(1), z.string().min(1)),
    ])
  )
  .default([])
  .transform((items) =>
    items.map((item) => {
      if (typeof item !== 'string') {
        if ('title' in item && 'content' in item) return item;
        const entries = Object.entries(item);
        const [key, value] = entries[0] ?? ['', ''];
        return { title: key.trim(), content: String(value).trim() };
      }

      const [rawTitle, ...rest] = item.split(':');
      return {
        title: rawTitle.trim(),
        content: rest.join(':').trim(),
      };
    })
  );

const projects = defineCollection({
  loader: glob({
    base: './src/_projects',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z
    .object({
      title: z.string().min(1),
      summary: z.string().optional(),
      description: z.string().optional(),
      date: z.coerce.date(),
      status: z.enum(['Planned', 'In Progress', 'Completed', 'Archived']).optional(),
      type: z.string().optional(),
      team: z.string().optional(),
      duration: z.string().optional(),
      categories: z.array(z.string().min(1)).default([]),
      tags: z.array(z.string().min(1)).default([]),
      metrics: z.array(MetricSchema).default([]),
      toc: z.array(z.string().min(1)).default([]),
      image: z
        .object({
          path: z.string().min(1),
          alt: z.string().optional(),
        })
        .optional(),
      pinned: z.boolean().default(false),
      mermaid: z.boolean().default(false),
      thumbnail: z.string().optional(),
      videoUrl: z.string().url().optional(),
      role: z.string().optional(),
      features: FeatureSchema,
      achievements: AchievementSchema,
    })
    .refine((data) => Boolean(data.summary || data.description), {
      message: 'Provide either summary or description',
      path: ['summary'],
    }),
});

const posts = defineCollection({
  loader: glob({
    base: './src/_posts',
    pattern: '**/*.md',
  }),
  schema: z
    .object({
      title: z.string().min(1),
      summary: z.string().optional(),
      excerpt: z.string().optional(),
      date: z.coerce.date(),
      readingTime: z.string().optional(),
      category: z.enum(['AI', 'Frontend', 'Data', 'Fintech']).optional(),
      tags: z.array(z.string().min(1)).default([]),
      status: z.enum(['Draft', 'Published', 'Archived']).optional(),
      metrics: z.array(MetricSchema).default([]),
      toc: z.array(z.string().min(1)).default([]),
      image: z
        .object({
          path: z.string().min(1),
          alt: z.string().optional(),
        })
        .optional(),
    })
    .refine((data) => Boolean(data.summary || data.excerpt), {
      message: 'Provide either summary or excerpt',
      path: ['summary'],
    }),
});

export const collections = { projects, posts };