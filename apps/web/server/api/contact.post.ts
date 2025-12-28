import z from 'zod'

const bodySchema = z.object({
  email: z.email(),
  message: z.string().min(10),
  name: z.string().min(3),
  website: z.string('Bot detected').max(0).optional(), // honeypot: must be empty
})

const LOGGER_PREFIX = '[contact.post]:'

export default defineEventHandler(async (event) => {
  const serverLogger = useServerLogger()

  const { email, message, name } = await readValidatedBody(event, bodySchema.parse)

  try {
    await useEmail().sendContactSubmissionEmail(name, email, message)
  }
  catch (error: any) {
    serverLogger.error(`${LOGGER_PREFIX} Failed to send contact email`, error)
    throw createError({
      ...error,
      statusCode: error.status || error.statusCode || 500,
      statusMessage: error.statusMessage || error.message,
    })
  }
})
