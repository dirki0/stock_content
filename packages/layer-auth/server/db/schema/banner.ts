import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const banner = pgTable('banner', {
  id: uuid('id').primaryKey().$default(() => uuidv7()),
  title: text('title').notNull(),
  color: text('color').notNull(),
  icon: text('icon'),
  to: text('to'),
  target: text('target'),
  isClosable: boolean('is_closable').default(false).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  showUntil: timestamp('show_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
})
