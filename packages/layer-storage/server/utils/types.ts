import type { Buffer } from 'node:buffer'

export interface StorageProvider {
  delete: (path: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
  getUrl: (path: string) => string
  name: string
  upload: (file: Buffer, fileName: string, mimeType: string) => Promise<{ path: string, url?: string }>
}

export type StorageProviderType = 'local' | 'r2' | 's3'

export interface FileManagerConfig {
  allowedMimeTypes?: Array<string>
  maxFileSize?: number
  storage: {
    local?: {
      publicPath: string
      uploadDir: string
    }
    provider: StorageProviderType
    r2?: {
      accessKeyId: string
      accountId: string
      bucketName: string
      publicUrl?: string
      secretAccessKey: string
    }
    s3?: {
      accessKeyId: string
      bucketName: string
      endpoint?: string
      publicUrl?: string
      region: string
      secretAccessKey: string
    }
  }
  uploadRateLimit?: {
    maxUploadsPerWindow: number // Maximum number of uploads allowed per window
    windowSizeMinutes: number // Size of the time window in minutes
  }
}
