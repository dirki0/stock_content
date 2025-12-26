import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

const docsSchema = z.object({
  links: z.array(z.object({
    avatar: z.object({
      alt: z.string(),
      src: z.string(),
    }).optional(),
    icon: z.string(),
    label: z.string(),
    target: z.string().optional(),
    to: z.string(),
  })),
  navigation: z.object({
    title: z.string().optional(),
  }),
})

const blogSchema = z.object({
  authors: z.array(
    z.object({
      avatar: z.object({ src: z.string().nonempty() }),
      name: z.string().nonempty(),
      to: z.string().nonempty(),
    }),
  ),
  category: z.string(),
  date: z.string().date(),
  image: z.string(),
})

const contentSchema = z.object({
  links: z.array(z.object({
    avatar: z.object({
      alt: z.string(),
      src: z.string(),
    }).optional(),
    icon: z.string(),
    label: z.string(),
    target: z.string().optional(),
    to: z.string(),
  })),
  navigation: z.object({
    title: z.string().optional(),
  }),
})

export default defineContentConfig({
  collections: {
    blog: defineCollection(
      asSitemapCollection({
        schema: blogSchema,
        source: 'blog/**',
        type: 'page',
      }),
    ),
    content: defineCollection(
      asSitemapCollection({
        schema: contentSchema,
        source: '**/*',
        type: 'page',
      }),
    ),
    docs: defineCollection(
      asSitemapCollection({
        schema: docsSchema,
        source: 'docs/**',
        type: 'page',
      }),
    ),
  },
})
