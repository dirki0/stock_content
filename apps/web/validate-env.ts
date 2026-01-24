import { createEnv } from '@t3-oss/env-nuxt'
import { z } from 'zod'

const skipValidation = import.meta.server || process.env.GITHUB_ACTIONS === 'true'

export const env = createEnv({
  client: {
    NUXT_PUBLIC_ADMIN_DEMO_MODE_ENABLED: z.coerce.boolean().optional(),
    NUXT_PUBLIC_BASE_URL: z.url(),
  },
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    DATABASE_NAME: z.string().nonempty(),
    DATABASE_PASSWORD: z.string().nonempty(),
    DATABASE_USER: z.string().nonempty(),
    NUXT_PRIVATE_DATABASE_URL: z.string().nonempty().optional(),
    NUXT_PRIVATE_EMAIL_CONTACT: z.email(),
    NUXT_PRIVATE_EMAIL_PLUNK_API_KEY: z.string().min(32).optional(),
    NUXT_PRIVATE_EMAIL_PLUNK_API_URL: z.url().optional(),
    NUXT_PRIVATE_EMAIL_PROVIDER: z.enum(['resend', 'plunk']),
    NUXT_PRIVATE_EMAIL_SEND_IN_DEV_MODE: z.coerce.boolean(),
    NUXT_PRIVATE_FROM_EMAIL: z.email(),
    NUXT_PRIVATE_GITHUB_CLIENT_ID: z.string().min(10).optional(),
    NUXT_PRIVATE_GITHUB_CLIENT_SECRET: z.string().min(10).optional(),
    NUXT_PRIVATE_GOOGLE_CLIENT_ID: z.string().min(10).optional(),
    NUXT_PRIVATE_GOOGLE_CLIENT_SECRET: z.string().min(10).optional(),
    NUXT_PRIVATE_POLAR_ACCESS_TOKEN: z.string().min(10),
    NUXT_PRIVATE_POLAR_ORGANIZATION_ID: z.string().min(10).optional(),
    NUXT_PRIVATE_POLAR_SERVER: z.enum(['sandbox', 'production']),
    NUXT_PRIVATE_REDIS_URL: z.string().nonempty().optional(),
    NUXT_PRIVATE_STORAGE_LOCAL_PUBLIC_PATH: z.string().nonempty().optional(),
    NUXT_PRIVATE_STORAGE_PROVIDER: z.enum(['s3', 'local']),
    NUXT_PRIVATE_STORAGE_S3_ACCESS_KEY_ID: z.string().min(10).optional(),
    NUXT_PRIVATE_STORAGE_S3_BUCKET_NAME: z.string().nonempty().optional(),
    NUXT_PRIVATE_STORAGE_S3_ENDPOINT: z.string().nonempty().optional(),
    NUXT_PRIVATE_STORAGE_S3_PUBLIC_URL: z.string().nonempty().optional(),
    NUXT_PRIVATE_STORAGE_S3_REGION: z.string().nonempty().optional(),
    NUXT_PRIVATE_STORAGE_S3_SECRET_ACCESS_KEY: z.string().min(10).optional(),
    NUXT_PRIVATE_STORAGE_UPLOAD_DIR: z.string().nonempty().optional(),
    NUXT_UMAMI_HOST: z.url().optional(),
    NUXT_UMAMI_ID: z.string().nonempty().optional(),
    POLAR_ACCESS_TOKEN: z.string().min(10),
    POLAR_SERVER: z.enum(['sandbox', 'production']),
  },
  skipValidation,
})
