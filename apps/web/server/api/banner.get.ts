import type { BannerProps } from '@nuxt/ui'

const LOGGER_PREFIX = '[banner.get]:'

export default defineEventHandler(async () => {
  const serverLogger = useServerLogger()

  try {
    const { getActiveItem } = useBanner()
    const banner = await getActiveItem()

    if (!banner) {
      return null
    }

    const bannerProps: BannerProps = {
      close: banner.isClosable,
      color: banner.color,
      icon: banner.icon,
      target: banner.target,
      title: banner.title,
      to: banner.to,
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
