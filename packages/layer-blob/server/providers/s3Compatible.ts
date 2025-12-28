import type { Buffer } from 'node:buffer'
import { AwsClient } from 'aws4fetch'

export const getS3CompatibleBlobProvider = ({bucketName, provider, accessKeyId, secretAccessKey, accountId, endpoint, publicUrl}: {bucketName: string, provider: 'r2' | 's3', accessKeyId: string, secretAccessKey: string, accountId?: string, endpoint?: string, region?: string, publicUrl?: string}): BlobProvider =>  {

  let _endpoint  = ''
  let region = ''

  if (provider === 'r2') {
    if (!accountId) {
      throw new Error('Account ID is required for R2 storage')
    }
    _endpoint = `https://${accountId}.r2.cloudflarestorage.com`
    region = 'auto'
  } else {
    _endpoint = endpoint || 'https://s3.amazonaws.com'
    region = region || 'us-east-1'
  }

  const client = new AwsClient({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region,
    service: 's3'
  })

  const uploadBlob = async (file: Buffer, fileName: string, mimeType: string): Promise<{ path: string, url?: string }>  => {

    const url = `${_endpoint}/${bucketName}/${fileName}`

    const response = await client.fetch(url, {
      method: 'PUT',
      body: new Uint8Array(file),
      headers: {
        'Content-Type': mimeType
      }
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return {
      path: fileName,
      url: publicUrl ? `${publicUrl}/${fileName}` : undefined
    }
  }

  const deleteBlob = async(path: string): Promise<void> => {

    const url = `${_endpoint}/${bucketName}/${path}`

    const response = await client.fetch(url, {
      method: 'DELETE'
    })

    if (!response.ok && response.status !== 404) {
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`)
    }
  }

  const getUrl = (path: string): string => {
    if (publicUrl) {
      return `${publicUrl}/${path}`
    }

    if (provider === 'r2') {
      return `https://${bucketName}.r2.dev/${path}`
    }

    return `https://${bucketName}.s3.amazonaws.com/${path}`
  }

  const exists = async (path: string): Promise<boolean> => {

    try {
      const url = `${endpoint}/${bucketName}/${path}`

      const response = await client!.fetch(url, {
        method: 'HEAD'
      })

      return response.ok
    } catch {
      return false
    }
  }

  return {
    name,
    exists,
    getUrl,
    deleteBlob,
    uploadBlob
  }
}
