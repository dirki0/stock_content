import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '../db/schema'

export const db = drizzle(process.env.NUXT_PRIVATE_DATABASE_URL!, { schema })
