import type { Buffer } from 'node:buffer'

import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
  waitUntilObjectNotExists,
} from '@aws-sdk/client-s3'

export function getS3StorageProvider (config: StorageConfig['storage']['s3']): StorageProvider {
  if (!config) {
    throw new Error('S3 storage configuration is required')
  }

  const _endpoint = config.endpoint || 'https://s3.amazonaws.com'
  const _region = config.region || 'us-east-1'

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: _region,
  })

  const upload = async (file: Buffer, fileName: string): Promise<{ path: string, url?: string }> => {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Body: new Uint8Array(file),
          Bucket: config.bucketName,
          Key: fileName,
        }),
      )
    }
    catch (error) {
      throw new Error(`Upload failed: ${error}`)
    }

    return {
      path: fileName,
    }
  }

  const deleteFile = async (path: string): Promise<void> => {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: config.bucketName,
          Key: path,
        }),
      )

      await waitUntilObjectNotExists(
        { client: s3Client, maxWaitTime: 1000 },
        { Bucket: config.bucketName, Key: path },
      )
      // A successful delete, or a delete for a non-existent object, both return a 204 response code.
    }
    catch (caught) {
      const logger = useServerLogger()
      if (
        caught instanceof S3ServiceException
        && caught.name === 'NoSuchBucket'
      ) {
        logger.error(
          `Error from S3 while deleting object from ${config.bucketName}. The bucket doesn't exist.`,
          caught,
        )
      }
      else if (caught instanceof S3ServiceException) {
        logger.error(
          `Error from S3 while deleting object from ${config.bucketName}.  ${caught.name}: ${caught.message}`,
          caught,
        )
      }
      else {
        throw caught
      }
    }
  }

  const getUrl = (path: string): string => {
    if (config.publicUrl) {
      return `${config.publicUrl}/${path}`
    }

    return `https://${config.bucketName}.s3.amazonaws.com/${path}`
  }

  const exists = async (path: string): Promise<boolean> => {
    try {
      await s3Client.send(
        new GetObjectCommand({
          Bucket: config.bucketName,
          Key: path,
        }),
      )
      return true
    }
    catch (caught) {
      const logger = useServerLogger()
      if (caught instanceof NoSuchKey) {
        logger.error(
          `Error from S3 while getting object "${path}" from "${config.bucketName}". No such key exists.`,
          caught,
        )
        return false
      }
      else if (caught instanceof S3ServiceException) {
        logger.error(
          `Error from S3 while getting object from ${config.bucketName}. ${caught.name}: ${caught.message}`,
          caught,
        )
        return false
      }
      else {
        logger.error(
          `Error from S3 while getting object from ${config.bucketName}`,
          caught as any,
        )
        return false
      }
    }
  }

  return {
    delete: deleteFile,
    exists,
    getUrl,
    name: 's3',
    upload,
  }
}
