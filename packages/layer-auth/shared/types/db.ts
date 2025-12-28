import type { testimonial, user } from '../../server/db/schema'

export type User = typeof user.$inferSelect

export type Testimonial = typeof testimonial.$inferSelect
