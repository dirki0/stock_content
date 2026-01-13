import type { Buffer } from 'node:buffer'

export interface StorageProvider {
  delete: (path: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
  getUrl: (path: string) => string
  name: string
  upload: (file: Buffer, fileName: string, mimeType: string) => Promise<{ path: string, url?: string }>
}

export type StorageProviderType = 'local' | 's3'

export interface StorageConfig {
  storage: {
    allowedMimeTypes?: Array<string>
    local: {
      publicPath: string
    }
    maxFileSize?: number
    provider: StorageProviderType
    s3: {
      accessKeyId: string
      bucketName: string
      endpoint?: string
      publicUrl?: string
      region: string
      secretAccessKey: string
    }
    uploadDir: string
    uploadRateLimit?: {
      maxUploadsPerWindow: number // Maximum number of uploads allowed per window
      windowSizeMinutes: number // Size of the time window in minutes
    }
  }
}
