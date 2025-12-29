import { defineCollection, defineContentConfig } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

const blogSchema = z.object({
  authors: z.array(
    z.object({
      avatar: z.object({ src: z.string().nonempty() }),
      name: z.string().nonempty(),
      to: z.string().nonempty(),
    }),
  ),
  category: z.string(),
  date: z.date(),
  image: z.string(),
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
  },
})
