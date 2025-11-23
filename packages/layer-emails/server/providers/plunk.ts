import type { SendEmailHandler } from '../utils/getEmailProvider.types'

const LOGGER_PREFIX = '[email/providers/plunk]:'

export function plunkProvider (): EmailProvider {
  const event = useEvent()
  const { private: { emailPlunkApiKey, emailPlunkApiUrl } } = useRuntimeConfig(event)
  const serverLogger = useServerLogger()

  if (!emailPlunkApiKey) {
    const error = createError({
      status: 500,
      statusMessage: 'Plunk API key is not configured',
    })
    serverLogger.error(`${LOGGER_PREFIX} Plunk API key is not configured`, error)
    throw error
  }

  const send: SendEmailHandler = async ({ from, html, subject, text, to }) => {
    const apiUrl = emailPlunkApiUrl || 'https://api.useplunk.com/v1/send'

    try {
      await $fetch(apiUrl, {
        body: {
          body: html || text,
          from,
          subject,
          to,
        },
        headers: {
          'Authorization': `Bearer ${emailPlunkApiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    }
    catch (error: any) {
      const catchError = createError({
        ...error,
        statusCode: error.status || error.statusCode || 500,
        statusMessage: error.statusMessage || error.message,
      })
      serverLogger.error(`${LOGGER_PREFIX} Failed to send email to "${to}" with Plunk`, catchError)
      throw catchError
    }
  }

  return { send }
}
