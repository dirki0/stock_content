import z from 'zod'

const querySchema = z.object({
  token: z.string().min(1),
})

const LOGGER_PREFIX = '[waitlist/verify-email-token.get]:'

export default defineEventHandler(async (event) => {
  const { token } = await getValidatedQuery(event, querySchema.parse)

  const serverLogger = useServerLogger()

  try {
    const { getItemByVerificationToken, updateItem } = useWaitlist()

    const record = await getItemByVerificationToken(token)
    if (!record) {
      serverLogger.info(`${LOGGER_PREFIX} Email verification token not found`, { token })
      throw createError({
        statusCode: 404,
        statusMessage: 'Email verification token not found',
      })
    }

    await updateItem({
      ...record,
      emailVerified: true,
    })

    return sendRedirect(event, '/waitlist/confirmed')
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to verify email token`, error)
    throw createError({
      ...error,
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
