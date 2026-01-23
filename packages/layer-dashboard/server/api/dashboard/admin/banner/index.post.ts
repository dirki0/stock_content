import z from 'zod'

const LOGGER_PREFIX = '[admin/banner.post]:'

const bodySchema = z.object({
  color: z.string().min(1),
  icon: z.string().optional(),
  isActive: z.boolean().default(false),
  isClosable: z.boolean().default(false),
  showUntil: z.string().datetime().optional(),
  target: z.string().optional(),
  title: z.string().min(1),
  to: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  try {
    const body = await readValidatedBody(event, bodySchema.parse)

    const { addItem } = useBanner()

    // Transform showUntil to Date if provided
    const payload = {
      ...body,
      showUntil: body.showUntil ? new Date(body.showUntil) : undefined,
    }

    const newItem = await addItem(payload)

    return {
      item: newItem,
      success: true,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to create banner`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
