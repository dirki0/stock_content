import process from 'node:process'

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
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
      database: drizzleAdapter(db, {
        provider: "pg",
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      plugins: [anonymous(), admin()],
      emailVerification: {
        sendVerificationEmail: async ({ url, user }) => {
          const { sendVerificationEmail } = useEmail()

          // FIXME: remove OTP from email
          await sendVerificationEmail(user.name, user.email, 'FIXME', url)
        },
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
