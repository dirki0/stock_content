import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

import { user } from './auth'

export const file = pgTable('file', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  id: uuid('id').primaryKey().$default(() => uuidv7()),
  isActive: boolean('is_active').default(true).notNull(),
  mimeType: text('mime_type').notNull(),
  originalName: text('original_name').notNull(),
  path: text('path').notNull(),
  size: integer('size').notNull(),
  storageProvider: text('storage_provider').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  uploadedBy: uuid('uploaded_by'),
  url: text('url'),
})

export const fileRelations = relations(file, ({ one }) => ({
  uploadedByUser: one(user, {
    fields: [file.uploadedBy],
    references: [user.id],
  }),
}))
