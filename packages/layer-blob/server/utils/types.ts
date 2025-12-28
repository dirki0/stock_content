import type { Buffer } from 'node:buffer'

export interface BlobProvider {
  name: string
  uploadBlob: (file: Buffer, fileName: string, mimeType: string) => Promise<{ path: string, url?: string }>
  deleteBlob: (path: string) => Promise<void>
  getUrl: (path: string) => string
  exists: (path: string) => Promise<boolean>
}

export type BlobProviderType = 'local' | 's3' | 'r2'

export interface FileManagerConfig {
  storage: {
    provider: BlobProviderType
    local?: {
      uploadDir: string
      publicPath: string
    }
    s3?: {
      region: string
      accessKeyId: string
      secretAccessKey: string
      bucketName: string
      publicUrl?: string
      endpoint?: string
    }
    r2?: {
      accountId: string
      accessKeyId: string
      secretAccessKey: string
      bucketName: string
      publicUrl?: string
    }
  }
  maxFileSize?: number
  allowedMimeTypes?: string[]
  uploadRateLimit?: {
    maxUploadsPerWindow: number // Maximum number of uploads allowed per window
    windowSizeMinutes: number // Size of the time window in minutes
  }
}
