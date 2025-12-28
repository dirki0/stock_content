import { asc, desc } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '../db/schema'

export { asc, desc }

export const useDb = () => drizzle(process.env.NUXT_PRIVATE_DATABASE_URL!, { schema })
