export function useUploadRateLimit (windowSizeMinutes: number, maxUploadsPerWindow: number) {
  const { getItem, setItem } = useCache()
  const logger = useServerLogger()

  const getBucketKey = (userId: string): string => {
    const now = Date.now()
    const bucketTimestamp = Math.floor(now / (windowSizeMinutes * 60 * 1000))
    return `upload_rate_limit:${userId}:${bucketTimestamp}`
  }

  const checkAndIncrement = async (userId: string, incrementBy: number = 1): Promise<{ allowed: boolean, currentCount: number }> => {
    const bucketKey = getBucketKey(userId)
    const ttlSeconds = windowSizeMinutes * 60

    try {
      // Get current count
      const currentValue = await getItem(bucketKey)
      const currentCount = currentValue ? Number.parseInt(currentValue) : 0

      // Check if limit would be exceeded after increment
      if (currentCount + incrementBy > maxUploadsPerWindow) {
        return { allowed: false, currentCount }
      }

      // Increment counter by the specified amount
      const newCount = currentCount + incrementBy
      await setItem(bucketKey, newCount.toString(), ttlSeconds)

      return { allowed: true, currentCount: newCount }
    }
    catch (error: any) {
      logger.error('Rate limiter error:', error)
      return { allowed: false, currentCount: 0 }
    }
  }

  const getCurrentCount = async (userId: string): Promise<number> => {
    const bucketKey = getBucketKey(userId)
    try {
      const currentValue = await getItem(bucketKey)
      return currentValue ? Number.parseInt(currentValue) : 0
    }
    catch (error: any) {
      logger.error('Rate limiter get count error:', error)
      return 0
    }
  }

  return {
    checkAndIncrement,
    getCurrentCount,
  }
}
