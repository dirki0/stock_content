import process from 'node:process'

import { D1Dialect } from '@atinux/kysely-d1'
import { betterAuth } from 'better-auth'
import { admin, anonymous } from 'better-auth/plugins'

let _auth: ReturnType<typeof betterAuth>
export function serverAuth () {
  if (!_auth) {
    _auth = betterAuth({
      account: {
        accountLinking: {
          enabled: true,
        },
      },
      baseURL: getBaseURL(),
      database: {
        dialect: new D1Dialect({
          database: hubDatabase() as any,
        }),
        type: 'sqlite',
      },
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      plugins: [anonymous(), admin()],
      secondaryStorage: {
        delete: key => hubKV().del(`_auth:${key}`),
        get: key => hubKV().getItemRaw(`_auth:${key}`),
        set: (key, value, ttl) => {
          return hubKV().set(`_auth:${key}`, value, { ttl })
        },
      },
      sendVerificationEmail: async ({ url, user }) => {
        const { sendVerificationEmail } = useEmail()

        // FIXME: remove OTP from email
        await sendVerificationEmail(user.name, user.email, 'FIXME', url)
      },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
      },
    })
  }
  return _auth
}

function getBaseURL () {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    }
    catch {}
  }
  return baseURL
}
