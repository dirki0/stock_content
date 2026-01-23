import z from 'zod'

const LOGGER_PREFIX = '[admin/testimonials.post]:'

const bodySchema = z.object({
  author: z.object({
    avatar: z.object({
      loading: z.literal('lazy'),
      src: z.string(),
    }).optional(),
    description: z.string().optional(),
    name: z.string().min(1),
  }),
  quote: z.string().min(1),
  source: z.object({
    name: z.string().min(1),
    url: z.string().optional(),
  }).optional(),
})

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  try {
    const body = await readValidatedBody(event, bodySchema.parse)

    const { addItem } = useTestimonials()
    const newItem = await addItem(body)

    return {
      item: newItem,
      success: true,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to create testimonial`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
