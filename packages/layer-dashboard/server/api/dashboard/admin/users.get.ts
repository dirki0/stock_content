import { useServerAuth } from 'layer-auth/server/utils/auth'
import z from 'zod'

const LOGGER_PREFIX = '[admin/users.get]:'

const querySchema = z.object({
  filter: z.enum(zodEnum(adminUsersTableFilters)).optional().default('all'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional().default(''),
})

export default defineEventHandler(async (event): Promise<AdminUsersResponse> => {
  const serverLogger = useServerLogger()

  const { public: { adminDemoModeEnabled } } = useRuntimeConfig(event)

  try {
    const { filter, page, pageSize, search } = await getValidatedQuery(event, querySchema.parse)

    const serverAuth = useServerAuth()

    const offset = (page - 1) * pageSize

    // Build query parameters based on filter
    const queryParams: any = {
      limit: pageSize,
      offset,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    }

    // Add search if provided
    if (search) {
      queryParams.searchField = 'email'
      queryParams.searchOperator = 'contains'
      queryParams.searchValue = search
    }

    // Add filtering based on the filter parameter
    if (filter !== 'all') {
      switch (filter) {
        case 'verified':
          queryParams.filterField = 'emailVerified'
          queryParams.filterOperator = 'eq'
          queryParams.filterValue = true
          break
        case 'unverified':
          queryParams.filterField = 'emailVerified'
          queryParams.filterOperator = 'eq'
          queryParams.filterValue = false
          break
        case 'proPlan':
          // This would need to be filtered on the subscription level
          // Since Better Auth listUsers doesn't support complex joins,
          // we'll need to handle this after fetching
          // FIXME: implement proPlan filtering
          break
      }
    }

    const result = await serverAuth.api.listUsers({
      headers: event.headers, // This endpoint requires session cookies.
      query: queryParams,
    })

    if (!result || !result.users) {
      throw createError({
        message: 'Failed to fetch user data',
        statusCode: 500,
      })
    }

    // Extract users and pagination data from Better Auth API response
    const users = result.users || []
    const totalCount = result.total || 0

    const cleanedRecords = users.map((user) => {
      return {
        ...user,
        ...(adminDemoModeEnabled && {
          avatarUrl: '/images/user-avatars/avatar-placeholder.png',
          email: `user-${user.id.substring(0, 8)}@example.com`,
          id: `masked-${user.id.substring(0, 8)}`,
          name: `User ${user.id.substring(0, 8)}`,
        }),
        hasLifeTimeDeal: false,
        subscription: null,
      } as AdminSelectUser
    })

    return {
      page,
      pageSize,
      totalCount,
      users: cleanedRecords,
    }
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to get all users`, error)
    throw createError({
      ...error,
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
