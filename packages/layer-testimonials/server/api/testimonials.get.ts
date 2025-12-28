import type { H3Event } from 'h3'
import { testimonial } from 'layer-auth/server/db/schema'

const LOGGER_PREFIX = '[testimonials.get]:'

export default cachedEventHandler(async () => {
  const db = useDb()

  try {
    const testimonials = await db.select().from(testimonial).orderBy(desc(testimonial.createdAt))
    return testimonials
  }
  catch (error: any) {
    const serverLogger = useServerLogger()

    serverLogger.error(`${LOGGER_PREFIX} Failed to get testimonials`, error)
    throw createError({
      ...error,
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
}, {
  getKey: (event: H3Event) => event.path,
  maxAge: 60 * 60, // 1 hour
})
