import { plunkProvider } from '../providers/plunk'
import { resendProvider } from '../providers/resend'

import type { EmailProvider } from './getEmailProvider.types'

export function getEmailProvider (): EmailProvider {
  const event = useEvent()
  const { private: { emailProvider } } = useRuntimeConfig(event)

  switch (emailProvider) {
    case 'plunk':
      return plunkProvider()
    case 'resend':
      return resendProvider()
    default:
      throw new Error(`Invalid email provider configured: ${emailProvider}`)
  }
}
