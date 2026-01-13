export default defineEventHandler(async (event) => {
  const config = useStorageConfig()
  const user = await requireAuth(event)
  const fileId = getRouterParam(event, 'id')

  if (!fileId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File ID is required',
    })
  }
  const storage = getStorageProvider(config.storage)
  const { deleteFile, getFile } = useFileStorage(storage)

  const file = await getFile(fileId)

  if (!file) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
    })
  }

  if (file.uploadedBy !== user.id && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied',
    })
  }

  const deleted = await deleteFile(fileId)

  return {
    message: deleted ? 'File deleted successfully' : 'File not found',
    success: deleted,
  }
})
