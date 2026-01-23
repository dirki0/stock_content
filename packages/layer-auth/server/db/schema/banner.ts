import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const banner = pgTable('banner', {
  color: text('color').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  icon: text('icon'),
  id: uuid('id').primaryKey().$default(() => uuidv7()),
  isActive: boolean('is_active').default(false).notNull(),
  isClosable: boolean('is_closable').default(false).notNull(),
  showUntil: timestamp('show_until'),
  target: text('target'),
  title: text('title').notNull(),
  to: text('to'),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
})
