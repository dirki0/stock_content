import z from 'zod'

const LOGGER_PREFIX = '[admin/banner:id/index.patch]:'

const bodySchema = z.object({
  color: z.string().min(1).optional(),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isClosable: z.boolean().optional(),
  showUntil: z.string().datetime().optional().nullable(),
  target: z.string().optional().nullable(),
  title: z.string().min(1).optional(),
  to: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      const error = createError({
        message: 'ID is required',
        statusCode: 400,
      })
      serverLogger.error(`${LOGGER_PREFIX} Missing banner ID`, error)
      throw error
    }

    const body = await readValidatedBody(event, bodySchema.parse)

    const { updateItem } = useBanner()

    // Transform showUntil to Date if provided
    const payload = {
      ...body,
      showUntil: body.showUntil ? new Date(body.showUntil) : undefined,
    }

    const updatedItem = await updateItem(id, payload)

    return {
      item: updatedItem,
      success: true,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to update banner`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
