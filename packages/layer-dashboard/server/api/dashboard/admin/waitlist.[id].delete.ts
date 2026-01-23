const LOGGER_PREFIX = '[admin/waitlist.[id].delete]:'

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

    const { deleteItem } = useWaitlist()
    await deleteItem(id)

    return {
      success: true,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to delete waitlist item`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
