import z from 'zod'

const LOGGER_PREFIX = '[admin/testimonials/:id/index.patch]:'

const bodySchema = z.object({
  author: z.object({
    avatar: z.object({
      loading: z.literal('lazy'),
      src: z.string(),
    }).optional(),
    description: z.string().optional(),
    name: z.string().min(1),
  }).optional(),
  quote: z.string().min(1).optional(),
  source: z.object({
    name: z.string().min(1),
    url: z.string().optional(),
  }).optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        message: 'ID is required',
        statusCode: 400,
      })
    }

    const body = await readValidatedBody(event, bodySchema.parse)

    const { updateItem } = useTestimonials()
    const updatedItem = await updateItem(id, body)

    return {
      item: updatedItem,
      success: true,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to update testimonial`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
