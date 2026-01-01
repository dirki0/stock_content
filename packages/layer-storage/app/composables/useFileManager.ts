export interface FileManagerConfig {
  allowedTypes?: Array<string>
  maxSize?: number
  onError?: (error: Error) => void
  onProgress?: (progress: number) => void
  onSuccess?: (file: any) => void
}

export function useFileManager (config: FileManagerConfig = {}) {
  const isUploading = ref(false)
  const progress = ref(0)
  const error = ref<null | string>(null)

  const uploadToServer = async (file: File): Promise<any> => {
    if (config.maxSize && file.size > config.maxSize) {
      const errorMsg = `File size exceeds ${formatFileSize(config.maxSize)}`
      error.value = errorMsg
      config.onError?.(new Error(errorMsg))
      throw new Error(errorMsg)
    }

    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      const errorMsg = 'File type not allowed'
      error.value = errorMsg
      config.onError?.(new Error(errorMsg))
      throw new Error(errorMsg)
    }

    const formData = new FormData()
    formData.append('file', file)

    isUploading.value = true
    progress.value = 0
    error.value = null

    try {
      const response = await $fetch('/api/file/upload', {
        body: formData,
        method: 'POST',
      })
      config.onSuccess?.(response.file)
      return response.file
    }
    catch (err: any) {
      const errorMsg = err.data?.message || 'Upload failed'
      error.value = errorMsg
      config.onError?.(new Error(errorMsg))
      throw err
    }
    finally {
      isUploading.value = false
    }
  }

  const uploadMultipleFiles = async (files: Array<File> | FileList): Promise<Array<any>> => {
    const fileArray = Array.from(files)
    const results = []

    for (const file of fileArray) {
      try {
        const result = await uploadToServer(file)
        results.push(result)
      }
      catch (err: any) {
        results.push({ error: err.message })
      }
    }

    return results
  }

  return {
    error: readonly(error),
    progress: readonly(progress),
    uploading: readonly(isUploading),
    uploadMultipleFiles,
    uploadToServer,
  }
}
