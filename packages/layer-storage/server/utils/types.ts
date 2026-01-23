import type { Buffer } from 'node:buffer'

import type { RuntimeConfig } from 'nuxt/schema'

export interface StorageProvider {
  delete: (path: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
  getUrl: (path: string) => string
  name: string
  upload: (file: Buffer, fileName: string, mimeType: string) => Promise<{ path: string, url?: string }>
}

export type StorageProviderType = 'local' | 's3'

export type StorageConfig = RuntimeConfig['private']['storage']
