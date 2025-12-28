import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const testimonial = pgTable('testimonial', {
  author: jsonb('author').notNull().$type<{
    avatar?: {
      loading: 'lazy'
      src: string
    }
    description?: string
    name: string
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id').primaryKey(),
  quote: text('quote').notNull(),
  source: jsonb('source').$type<{
    name: string
    url?: string
  }>(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
