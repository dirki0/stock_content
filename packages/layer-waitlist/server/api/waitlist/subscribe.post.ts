import type { WaitlistInsert } from 'layer-auth/shared/types/db'
import { nanoid } from 'nanoid'
import z from 'zod'

const bodySchema = z.object({
  email: z.email(),
})

const LOGGER_PREFIX = '[waitlist/subscribe.post]:'

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, bodySchema.parse)

  const serverLogger = useServerLogger()

  try {
    const { addItem, getItemByEmail } = useWaitlist()
    const { sendWaitlistVerificationEmail } = useEmail()

    const existingRecord = await getItemByEmail(email)
    if (existingRecord) {
      if (!existingRecord.emailVerified) {
        serverLogger.info(`${LOGGER_PREFIX} Already subscribed to waitlist but email is not verified`, { email })
        throw createError({
          statusCode: 409,
          statusMessage: 'Already subscribed to waitlist but email is not verified',
        })
      }

      serverLogger.info(`${LOGGER_PREFIX} Already subscribed to waitlist`, { email })
      throw createError({
        statusCode: 409,
        statusMessage: 'Already subscribed to waitlist',
      })
    }

    const emailVerificationToken = nanoid()
    const record = await addItem({ email, emailVerificationToken } as WaitlistInsert)

    await sendWaitlistVerificationEmail(email, emailVerificationToken)

    return record
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to add to waitlist`, error)
    throw createError({
      ...error,
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
