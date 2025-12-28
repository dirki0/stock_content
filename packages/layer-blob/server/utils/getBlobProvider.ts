import { getLocalBlobProvider } from '../providers/local'
import { getS3CompatibleBlobProvider } from '../providers/s3Compatible'

import type { BlobProvider } from './types'

export function getBlobProvider (config: FileManagerConfig['storage']): BlobProvider {
  const event = useEvent()
  const { private: { blobProvider, blobPublicPath, blobUploadDirectory } } = useRuntimeConfig(event)

  switch (blobProvider) {
    case 'local':
      if (!config.local) {
        throw new Error('Local storage configuration is required')
      }
      return getLocalBlobProvider(blobUploadDirectory, blobPublicPath)

    case 's3':
      if (!config.s3) {
        throw new Error('S3 storage configuration is required')
      }
      return getS3CompatibleBlobProvider({
        provider: 's3',
        ...config.s3,
      })

    case 'r2':
      if (!config.r2) {
        throw new Error('R2 storage configuration is required')
      }
      return getS3CompatibleBlobProvider({
        provider: 'r2',
        ...config.r2,
      })

    default:
      throw new Error(`Invalid blob provider configured: ${blobProvider}`)
  }
}
