import { readMultipartFormData } from 'h3'

import { useFileStorage } from '../utils/fileStorage'

export default defineEventHandler(async (event) => {
  const config = useStorageConfig()

  const user = await requireAuth(event)

  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files provided',
    })
  }

  // Limit to single file upload
  const validFiles = formData.filter(fileData => fileData.data && fileData.filename)
  if (validFiles.length > 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only one file can be uploaded at a time',
    })
  }
  if (validFiles.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files provided',
    })
  }

  // Check upload rate limit if enabled
  if (config.uploadRateLimit) {
    const { maxUploadsPerWindow, windowSizeMinutes } = config.uploadRateLimit
    const rateLimiter = useUploadRateLimit(windowSizeMinutes, maxUploadsPerWindow)

    const { allowed, currentCount } = await rateLimiter.checkAndIncrement(user.id)

    if (!allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: `Upload rate limit exceeded. Maximum ${maxUploadsPerWindow} uploads per ${windowSizeMinutes} minutes. Current count: ${currentCount}`,
      })
    }
  }

  const storageProvider = getStorageProvider(config)
  const { uploadFile } = useFileStorage(storageProvider)

  const fileData = validFiles[0]!

  const mimeType = fileData.type || 'application/octet-stream'
  const fileSize = fileData.data.length

  // Validate file size
  if (config.maxFileSize && fileSize > Number(config.maxFileSize)) {
    throw createError({
      statusCode: 413,
      statusMessage: `File size exceeds maximum allowed size of ${formatFileSize(Number(config.maxFileSize))}`,
    })
  }

  // Validate MIME type
  if (config.allowedMimeTypes && config.allowedMimeTypes.length > 0) {
    if (!config.allowedMimeTypes.includes(mimeType)) {
      throw createError({
        statusCode: 415,
        statusMessage: `File type '${mimeType}' is not allowed.`,
      })
    }
  }

  try {
    const file = await uploadFile(
      fileData.data,
      fileData.filename!,
      mimeType,
      user.id,
      config.uploadDir,
    )
    return {
      file,
      success: true,
    }
  }
  catch (error: any) {
    const logger = useServerLogger()
    logger.error('Failed to upload file', error)
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Upload failed',
    })
  }
})
