const LOGGER_PREFIX = '[payment/products.get]:'

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  try {
    const allProducts = await usePayment(event).getAllProducts()
    return allProducts
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to get all products`, error)
    throw createError({
      ...error,
      message: error.message || error.statusMessage,
      statusCode: error.status || error.statusCode || 500,
    })
  }
})
