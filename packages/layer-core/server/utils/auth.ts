import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI } from 'better-auth/plugins'
import type { H3Event } from 'h3'
import { v7 as uuidv7 } from 'uuid'

import * as schema from '../db/schema'

import { setupPolar } from './polar'

export function createBetterAuth () {
  const runtimeConfig = useRuntimeConfig()

  console.log(`Base URL is ${runtimeConfig.public.baseURL}`)

  return betterAuth({
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    advanced: {
      database: {
        generateId: () => {
          return uuidv7()
        },
      },
    },
    baseURL: runtimeConfig.public.baseURL!,
    database: drizzleAdapter(
      db,
      {
        provider: 'pg',
        schema,
      },
    ),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ url, user }) => {
        console.log(`Reset password url for ${user.email}: ${url}`)
        // FIXME: Implement email sending
        // const response = await resendInstance.emails.send({
        //   from: `${runtimeConfig.public.appName} <${runtimeConfig.public.appNotifyEmail}>`,
        //   subject: 'Reset your password',
        //   text: `Click the link to reset your password: ${url}`,
        //   to: user.email,
        // })
        // await logAuditEvent({
        //   action: 'reset_password',
        //   category: 'email',
        //   details: response.error?.message,
        //   status: response.error ? 'failure' : 'success',
        //   targetId: user.email,
        //   targetType: 'email',
        //   userId: user.id,
        // })
        // if (response.error) {
        //   console.error(`Failed to send reset password email: ${response.error.message}`)
        //   throw createError({
        //     statusCode: 500,
        //     statusMessage: 'Internal Server Error',
        //   })
        // }
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ url, user }) => {
        console.log(`Verification email url for ${user.email}: ${url}`)
        // FIXME: Implement email sending
      },
      //   const response = await resendInstance.emails.send({
      //     from: `${runtimeConfig.public.appName} <${runtimeConfig.public.appNotifyEmail}>`,
      //     subject: 'Verify your email address',
      //     text: `Click the link to verify your email: ${url}`,
      //     to: user.email,
      //   })
      //   await logAuditEvent({
      //     action: 'verification',
      //     category: 'email',
      //     details: response.error?.message,
      //     status: response.error ? 'failure' : 'success',
      //     targetId: user.email,
      //     targetType: 'email',
      //     userId: user.id,
      //   })
      //   if (response.error) {
      //     console.error(`Failed to send verification email: ${response.error.message}`)
      //     throw createError({
      //       statusCode: 500,
      //       statusMessage: 'Internal Server Error',
      //     })
      //   }
      // },
    },
    plugins: [
      ...(runtimeConfig.public.appEnv === 'development' ? [openAPI()] : []),
      admin(),
      setupPolar(),
    ],
    // secondaryStorage: cacheClient, // FIXME
    secret: runtimeConfig.betterAuthSecret,
    socialProviders: {
      github: {
        clientId: runtimeConfig.githubClientId!,
        clientSecret: runtimeConfig.githubClientSecret!,
      },
      google: {
        clientId: runtimeConfig.googleClientId!,
        clientSecret: runtimeConfig.googleClientSecret!,
      },
    },
    trustedOrigins: ['http://localhost:9009', runtimeConfig.public.baseURL!],
    user: {
      additionalFields: {
        polarCustomerId: {
          defaultValue: null,
          required: false,
          type: 'string',
        },
      },
    },
  })
}

let _auth: ReturnType<typeof betterAuth>

// Used by npm run auth:schema only.
const isAuthSchemaCommand = process.argv.some(arg => arg.includes('server/database/schema/auth.ts'))
if (isAuthSchemaCommand) {
  _auth = createBetterAuth()
}
export const auth = _auth!

export function useServerAuth () {
  if (!_auth) {
    _auth = createBetterAuth()
  }
  return _auth
}

export async function getAuthSession (event: H3Event) {
  const headers = event.headers
  const serverAuth = useServerAuth()
  const session = await serverAuth.api.getSession({
    headers,
  })
  return session
}

export async function requireAuth (event: H3Event) {
  const session = await getAuthSession(event)
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  // Save the session to the event context for later use
  event.context.user = session.user
  return session.user as User
}
