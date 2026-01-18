import type { testimonial, user, waitlist, file, banner } from '../../server/db/schema'

export type User = typeof user.$inferSelect

export type Testimonial = typeof testimonial.$inferSelect
export type TestimonialInsert = typeof testimonial.$inferInsert

export type Waitlist = typeof waitlist.$inferSelect
export type WaitlistInsert = typeof waitlist.$inferInsert

export type FileRecord = typeof file.$inferSelect

export type Banner = typeof banner.$inferSelect
export type BannerInsert = typeof banner.$inferInsert
