import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

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
  id: uuid('id').primaryKey().$default(() => uuidv7()),
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
