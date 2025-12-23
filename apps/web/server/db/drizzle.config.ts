import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: process.env.NUXT_PRIVATE_DATABASE_URL!,
  },
  dialect: 'postgresql',
  out: './server/db/migrations',
  schema: './server/db/schema/index.ts',
})
