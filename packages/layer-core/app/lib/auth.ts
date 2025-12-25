import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'

import * as schema from '../../server/db/schema'
import { db } from '../../server/utils/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword (url) {
      console.log('Reset password url:', url)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail ({ url, user }) {
      // await sendUserVerificationEmail(user, url)
      console.log('Verification email url:', url) // FIXME
    },
  },
  plugins: [
    admin({
      defaultBanExpiresIn: 7 * 24 * 60 * 60,
      defaultBanReason: 'Spamming',
      defaultRole: 'user',
      impersonationSessionDuration: 1 * 24 * 60 * 60,
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      firstName: {
        fieldName: 'firstName',
        input: true,
        required: true,
        returned: true,
        type: 'string',
      },
      lastName: {
        fieldName: 'lastName',
        input: true,
        required: true,
        returned: true,
        type: 'string',
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
})
