const LOGGER_PREFIX = '[admin/banner/:id/activate.post]:'

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

    const { activateBanner } = useBanner()
    const activatedBanner = await activateBanner(id)

    return {
      item: activatedBanner,
      success: true,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to activate banner`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
