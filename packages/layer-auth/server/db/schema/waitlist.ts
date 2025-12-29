import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const waitlist = pgTable('waitlist', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  email: text('email').notNull().unique(),
  emailVerificationToken: text('email_verification_token').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  id: uuid('id').primaryKey(),
  referrer: text('referrer'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
