import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = event.path

  if (path?.startsWith('/api/admin')) {
    const user = await requireAuth(event)
    if (user.role !== 'admin') {
      throw createError({
        message: 'Admin access required.',
        statusCode: 403,
        statusMessage: 'Forbidden',
      })
    }
  }
})
