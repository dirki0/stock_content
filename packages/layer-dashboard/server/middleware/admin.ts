const LOGGER_PREFIX = '[admin.ts]:'

export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/dashboard/admin')) {
    const serverAuth = useServerAuth()
    const serverLogger = useServerLogger()

    const hasAdminRole = await serverAuth.api.userHasPermission({
      body: {
        permissions: {
          user: ['set-role', 'list', 'create', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'], // FIXME: is this correct?
        },
        role: 'admin',
      },
    })

    if (!hasAdminRole) {
      const error = createError({
        statusCode: 403,
        statusMessage: 'You are not authorized to perform this action',
      })

      serverLogger.error(`${LOGGER_PREFIX} Unauthorized admin access attempt`, error)

      throw error
    }

    const { public: { adminDemoModeEnabled } } = useRuntimeConfig(event)

    if (adminDemoModeEnabled) {
      const disallowedRequestMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
      if (disallowedRequestMethods.includes(event.method)) {
        const error = createError({
          statusCode: 405,
          statusMessage: 'This action is not allowed in admin demo mode',
        })

        serverLogger.error(`${LOGGER_PREFIX} Attempted to perform a disallowed action in admin demo mode`, error)

        throw error
      }
    }
  }
})
