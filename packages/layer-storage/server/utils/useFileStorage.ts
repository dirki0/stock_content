import type { Buffer } from 'node:buffer'
import { extname } from 'node:path'

import { format } from 'date-fns'
import { file as fileTable } from 'layer-auth/server/db/schema'
import { v7 as uuidv7 } from 'uuid'

import type { StorageProvider } from './types'

export function useStorageConfig () {
  const config = useRuntimeConfig().private.storage
  if (!config) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Storage configuration not found',
    })
  }
  return config
}

function getFileTypeFromMimeType (mimeType: string) {
  if (mimeType.startsWith('image/'))
    return 'image'
  if (mimeType.startsWith('video/'))
    return 'video'
  if (mimeType.startsWith('audio/'))
    return 'audio'
  if (mimeType.startsWith('text'))
    return 'text'
  if (mimeType.startsWith('application/'))
    return 'application'
  return 'other'
}

export function useFileStorage (storage: StorageProvider) {
  const generateFileName = (originalName: string, userId?: string, uploadDir?: string): string => {
    const fileId = uuidv7()
    const ext = extname(originalName)

    const dateFolder = format(new Date(), 'yyyy-MM-dd')

    const fileName = `${fileId}${ext}`

    // ${optionalFolderName}${optionalUserId}/YYYY-MM-DD/uuid.ext
    return `${uploadDir ? `${uploadDir}/` : ''}${userId ? `${userId}/` : ''}${dateFolder}/${fileName}`
  }

  const uploadFile = async (
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    userId?: string,
    uploadDir?: string,
  ): Promise<FileRecord> => {
    const db = useDb()
    const fileId = uuidv7()
    const fileName = generateFileName(originalName, userId, uploadDir)
    const fileType = getFileTypeFromMimeType(mimeType)

    const { path } = await storage.upload(fileBuffer, fileName, mimeType)

    const fileData = {
      fileName,
      fileType,
      id: fileId,
      isActive: true,
      mimeType,
      originalName,
      path,
      size: fileBuffer.length,
      storageProvider: storage.name,
      uploadedBy: userId,
    }

    const [fileRecord] = await db.insert(fileTable).values(fileData).returning()
    if (!fileRecord) {
      throw createError({
        message: 'Failed to create file record',
        statusCode: 500,
      })
    }

    return fileRecord
  }

  const getFile = async (id: string): Promise<FileRecord | null> => {
    const db = useDb()
    try {
      const [fileRecord] = await db.select().from(fileTable).where(eq(fileTable.id, id)).limit(1)
      return fileRecord || null
    }
    catch {
      return null
    }
  }

  const deleteFile = async (id: string): Promise<boolean> => {
    const db = useDb()
    const file = await getFile(id)

    if (!file) {
      return false
    }

    try {
      await storage.delete(file.path)
    }
    catch (error: any) {
      const logger = useServerLogger()
      logger.error('Failed to delete file from storage:', error)
    }

    await db.delete(fileTable).where(eq(fileTable.id, id))

    return true
  }

  const getFilesByUser = async (userId: string, limit = 50, offset = 0): Promise<Array<FileRecord>> => {
    const db = useDb()
    return db.select()
      .from(fileTable)
      .where(and(eq(fileTable.uploadedBy, userId), eq(fileTable.isActive, true)))
      .orderBy(desc(fileTable.createdAt))
      .limit(limit)
      .offset(offset)
  }

  return {
    deleteFile,
    getFile,
    getFilesByUser,
    getFileTypeFromMimeType,
    uploadFile,
  }
}
