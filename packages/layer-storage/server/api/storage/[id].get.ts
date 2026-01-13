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

  const storage = getStorageProvider(config)
  const { getFile } = useFileStorage(storage)

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

  // Return the path for NuxtImg to handle
  // Don't include the base URL or uploadDir as NuxtImg will handle that
  let path = file.path

  // Remove uploadDir prefix if present
  if (config.uploadDir && path.startsWith(config.uploadDir)) {
    path = path.substring(config.uploadDir.length)
    // Remove leading slash if present
    if (path.startsWith('/')) {
      path = path.substring(1)
    }
  }

  return {
    ...file,
    url: path,
  }
})
