import type { testimonial, user, waitlist, file } from '../../server/db/schema'

export type User = typeof user.$inferSelect

export type Testimonial = typeof testimonial.$inferSelect

export type Waitlist = typeof waitlist.$inferSelect
export type WaitlistInsert = typeof waitlist.$inferInsert
export type FileRecord = typeof file.$inferSelect
