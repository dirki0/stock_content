import type { BannerProps } from '@nuxt/ui'

const LOGGER_PREFIX = '[banner.get]:'

export default defineEventHandler(async () => {
  const serverLogger = useServerLogger()

  try {
    const item = await useCache().getItem(BANNER_CACHE_KEY)

    if (!item) {
      return null
    }

    const banner = JSON.parse(item) as Banner

    const bannerProps: BannerProps = {
      close: banner.isClosable,
      color: banner.color,
      icon: banner.icon,
      target: banner.target,
      title: banner.title,
    }

    return {
      banner,
      bannerProps,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to get banner`, error)
    throw createError({
      ...error,
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
