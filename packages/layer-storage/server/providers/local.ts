import type { Buffer } from 'node:buffer'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'

import type { StorageProvider } from '../utils/types'

export function getLocalStorageProvider (uploadDir: string, publicPath: string): StorageProvider {
  const upload = async (file: Buffer, fileName: string): Promise<{ path: string, url?: string }> => {
    const filePath = join(uploadDir, fileName)
    const dir = dirname(filePath)

    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, file)

    return {
      path: fileName,
      url: `${publicPath}/${fileName}`,
    }
  }

  const deleteFile = async (path: string): Promise<void> => {
    const filePath = join(uploadDir, path)
    try {
      await fs.unlink(filePath)
    }
    catch (error) {
      if ((error as any).code !== 'ENOENT') {
        throw error
      }
    }
  }

  const getUrl = (path: string): string => {
    return `${publicPath}/${path}`
  }

  const exists = async (path: string): Promise<boolean> => {
    try {
      const filePath = join(uploadDir, path)
      await fs.access(filePath)
      return Promise.resolve(true)
    }
    catch {
      return Promise.resolve(false)
    }
  }

  return {
    delete: deleteFile,
    exists,
    getUrl,
    name: 'local',
    upload,
  }
}
