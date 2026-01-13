export default defineEventHandler(async (event) => {
  const config = useStorageConfig()
  const user = await requireAuth(event)

  const query = getQuery(event)
  const limit = Number(query.limit) || 50
  const offset = Number(query.offset) || 0

  const storage = getStorageProvider(config)
  const { getFilesByUser } = useFileStorage(storage)

  try {
    const files = await getFilesByUser(user.id, limit, offset)
    return {
      files,
      success: true,
    }
  }
  catch (error: any) {
    const logger = useServerLogger()
    logger.error('Failed to list files', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to list files',
    })
  }
})
