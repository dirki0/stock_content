import { siteConfig } from 'site-config'

const getFirstName = (fullName: string) => fullName.split(' ')[0]

export function useEmail () {
  const event = useEvent()
  const { private: { emailContact, emailSendInDevMode, fromEmail }, public: { baseUrl } } = useRuntimeConfig(event)

  const sendContactSubmissionEmail = async (name: string, email: string, message: string) => {
    if (import.meta.dev && !emailSendInDevMode) {
      // eslint-disable-next-line no-console
      console.table({ email, message, name })
    }
    else {
      const html = await renderEmailComponent('Contact', {
        email,
        message,
        name,
      }, { pretty: true })

      const emailOptions = {
        from: fromEmail,
        html,
        subject: `[${siteConfig.name}] Contact Form Submission`,
        to: emailContact,
      }
      await getEmailProvider().send(emailOptions)
    }
  }

  const sendVerificationEmail = async (name: string, email: string, oneTimePassword: string, emailVerificationCode: string) => {
    if (import.meta.dev && !emailSendInDevMode) {
      // eslint-disable-next-line no-console
      console.table({ email, emailVerificationCode, name, oneTimePassword })
    }
    else {
      const html = await renderEmailComponent('Login', {
        emailVerificationUrl: `${baseUrl}/api/auth/verify-email-token?token=${emailVerificationCode}`,
        name: getFirstName(name),
        oneTimePassword,
      }, { pretty: true })

      const emailOptions = {
        from: fromEmail,
        html,
        subject: `Login to ${siteConfig.name}`,
        to: email,
      }
      await getEmailProvider().send(emailOptions)
    }
  }

  const sendWaitlistVerificationEmail = async (email: string, emailVerificationToken: string) => {
    if (import.meta.dev && !emailSendInDevMode) {
      // eslint-disable-next-line no-console
      console.table({ email, emailVerificationToken })
    }
    else {
      const html = await renderEmailComponent('WaitlistConfirmation', {
        emailVerificationUrl: `${baseUrl}/api/waitlist/verify-email-token?token=${emailVerificationToken}`,
      }, { pretty: true })

      const emailOptions = {
        from: fromEmail,
        html,
        subject: `Confirm waitlist request for ${siteConfig.name}`,
        to: email,
      }
      await getEmailProvider().send(emailOptions)
    }
  }

  const sendPasswordResetEmail = async (name: string, email: string, resetPasswordToken: string) => {
    if (import.meta.dev && !emailSendInDevMode) {
      // eslint-disable-next-line no-console
      console.table({ email, name, resetPasswordToken })
    }
    else {
      const html = await renderEmailComponent('ResetPassword', {
        name: getFirstName(name),
        url: `${baseUrl}/auth/reset-password?token=${resetPasswordToken}`,
      }, { pretty: true })

      const emailOptions = {
        from: fromEmail,
        html,
        subject: 'Reset your password',
        to: email,
      }
      await getEmailProvider().send(emailOptions)
    }
  }

  return {
    sendContactSubmissionEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWaitlistVerificationEmail,
  }
}
