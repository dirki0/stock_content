import { getLocalStorageProvider } from '../providers/local'
import { getS3StorageProvider } from '../providers/s3'

import type { StorageConfig, StorageProvider } from './types'

export function getStorageProvider (config: StorageConfig): StorageProvider {
  switch (config.provider) {
    case 'local':
      return getLocalStorageProvider(config.uploadDir, config.local.publicPath)

    case 's3':
      return getS3StorageProvider({
        ...config.s3,
      })

    default:
      throw new Error(`Invalid storage provider configured: ${config.provider}`)
  }
}
