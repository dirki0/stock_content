import { passkey } from '@better-auth/passkey'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI } from 'better-auth/plugins'
import type { H3Event } from 'h3'
import { v7 as uuidv7 } from 'uuid'

import * as schema from '../db/schema'

import { setupPolar } from './polar'

export function createBetterAuth () {
  const serverLogger = useServerLogger()
  const runtimeConfig = useRuntimeConfig()
  const { sendPasswordResetEmail, sendVerificationEmail } = useEmail()

  serverLogger.info(`Auth base URL is ${runtimeConfig.public.baseUrl}`)

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
    baseURL: runtimeConfig.public.baseUrl!,
    database: drizzleAdapter(
      useDb(),
      {
        provider: 'pg',
        schema,
      },
    ),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ url, user }) => {
        await sendPasswordResetEmail(user.name, user.email, url)
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ url, user }) => {
        await sendVerificationEmail(user.name, user.email, url)
      },
    },
    plugins: [
      admin(),
      setupPolar(),
      passkey(),
      ...(runtimeConfig.public.appEnv === 'development' ? [openAPI()] : []),
    ],
    secret: runtimeConfig.betterAuthSecret,
    socialProviders: {
      github: {
        clientId: runtimeConfig.private.githubClientId!,
        clientSecret: runtimeConfig.private.githubClientSecret!,
      },
      google: {
        clientId: runtimeConfig.private.googleClientId!,
        clientSecret: runtimeConfig.private.googleClientSecret!,
      },
    },
    trustedOrigins: ['http://localhost:5001', runtimeConfig.public.baseUrl!],
    user: {
      additionalFields: {
        polarCustomerId: {
          defaultValue: null,
          required: false,
          type: 'string',
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
  })
}

let _auth: ReturnType<typeof createBetterAuth>

// Used by npm run auth:schema only.
const isAuthSchemaCommand = process.argv.some(arg => arg.includes('server/db/schema/auth.ts'))
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
