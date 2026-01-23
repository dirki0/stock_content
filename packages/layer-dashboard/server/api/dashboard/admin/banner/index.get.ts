import z from 'zod'

const LOGGER_PREFIX = '[admin/banner.get]:'

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional().default(''),
})

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  try {
    const { page, pageSize, search } = await getValidatedQuery(event, querySchema.parse)

    const { getAllItems } = useBanner()
    const allItems = await getAllItems()

    // Filter by search term if provided
    let filteredItems = allItems
    if (search) {
      const searchLower = search.toLowerCase()
      filteredItems = allItems.filter((item) => {
        return item.title.toLowerCase().includes(searchLower)
      })
    }

    // Apply pagination
    const offset = (page - 1) * pageSize
    const paginatedItems = filteredItems.slice(offset, offset + pageSize)

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalCount: filteredItems.length,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to get banners`, error)
    throw createError({
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
