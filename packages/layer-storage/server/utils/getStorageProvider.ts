import { getLocalStorageProvider } from '../providers/local'
import { getS3CompatibleStorageProvider } from '../providers/s3Compatible'

import type { StorageProvider } from './types'

export function getStorageProvider (config: FileManagerConfig['storage']): StorageProvider {
  switch (config.provider) {
    case 'local':
      if (!config.local) {
        throw new Error('Local storage configuration is required')
      }
      return getLocalStorageProvider(config.local.uploadDir, config.local.publicPath)

    case 's3':
      if (!config.s3) {
        throw new Error('S3 storage configuration is required')
      }
      return getS3CompatibleStorageProvider({
        provider: 's3',
        ...config.s3,
      })

    case 'r2':
      if (!config.r2) {
        throw new Error('R2 storage configuration is required')
      }
      return getS3CompatibleStorageProvider({
        provider: 'r2',
        ...config.r2,
      })

    default:
      throw new Error(`Invalid storage provider configured: ${config.provider}`)
  }
}
