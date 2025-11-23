import type { SendEmailHandler } from '../utils/getEmailProvider.types'

const LOGGER_PREFIX = '[email/providers/resend]:'

export function resendProvider (): EmailProvider {
  const event = useEvent()
  const { private: { emailResendApiToken } } = useRuntimeConfig(event)
  const serverLogger = useServerLogger()

  if (!emailResendApiToken) {
    const error = createError({
      status: 500,
      statusMessage: 'Resend API token is not configured',
    })
    serverLogger.error(`${LOGGER_PREFIX} Resend API token is not configured`, error)
    throw error
  }

  const send: SendEmailHandler = async ({ from, html, subject, text, to }) => {
    const apiUrl = 'https://api.resend.com/emails'

    try {
      await $fetch(apiUrl, {
        body: {
          from,
          html: html || undefined,
          subject,
          text: text || undefined,
          to: Array.isArray(to) ? to : [to],
        },
        headers: {
          'Authorization': `Bearer ${emailResendApiToken}`,
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
      serverLogger.error(`${LOGGER_PREFIX} Failed to send email to "${to}" with Resend`, catchError)
      throw catchError
    }
  }

  return { send }
}
