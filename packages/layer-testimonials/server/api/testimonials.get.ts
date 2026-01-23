import type { H3Event } from 'h3'

const LOGGER_PREFIX = '[testimonials.get]:'

export default cachedEventHandler(async () => {
  try {
    const { getAllItems } = useTestimonials()
    return getAllItems()
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
  maxAge: import.meta.dev ? 1 : 60 * 60, // 1 hour
})
