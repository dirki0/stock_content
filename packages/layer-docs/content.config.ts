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

export default defineContentConfig({
  collections: {
    docs: defineCollection(
      asSitemapCollection({
        schema: docsSchema,
        source: 'docs/**',
        type: 'page',
      }),
    ),
  },
})
